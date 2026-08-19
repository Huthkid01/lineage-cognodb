import neo4j, { Driver, Integer, Session } from "neo4j-driver";

export class DatabaseUnavailableError extends Error {
  constructor(message = "The graph database is unreachable.") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export class DatabaseConfigError extends Error {
  constructor(
    message = "Missing CognoDB connection details. Set COGNODB_URI and COGNODB_PASSWORD.",
  ) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

let driver: Driver | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new DatabaseConfigError(`Missing ${name}.`);
  }
  return value;
}

export function getDriver(): Driver {
  if (driver) return driver;

  const uri = requiredEnv("COGNODB_URI");
  const user = process.env.COGNODB_USER?.trim() || "cognodb";
  const password = requiredEnv("COGNODB_PASSWORD");

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    connectionTimeout: 8000,
    maxConnectionPoolSize: 10,
  });

  return driver;
}

export async function withRead<T>(
  work: (tx: import("neo4j-driver").ManagedTransaction) => Promise<T>,
): Promise<T> {
  let session: Session | undefined;
  try {
    session = getDriver().session();
    return await session.executeRead(work);
  } catch (error) {
    throw wrapDbError(error);
  } finally {
    await session?.close();
  }
}

export async function withWrite<T>(
  work: (tx: import("neo4j-driver").ManagedTransaction) => Promise<T>,
): Promise<T> {
  let session: Session | undefined;
  try {
    session = getDriver().session();
    return await session.executeWrite(work);
  } catch (error) {
    throw wrapDbError(error);
  } finally {
    await session?.close();
  }
}

export async function ping(): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const d = getDriver();
    await d.verifyConnectivity();
    return { ok: true };
  } catch (error) {
    return { ok: false, message: wrapDbError(error).message };
  }
}

export function wrapDbError(error: unknown): Error {
  if (error instanceof DatabaseConfigError) return error;
  const message = error instanceof Error ? error.message : String(error);
  if (
    /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|Failed to connect|ServiceUnavailable|SessionExpired|SSL|certificate|authentication/i.test(
      message,
    )
  ) {
    return new DatabaseUnavailableError(
      "CognoDB is unreachable or refused the connection. Check the URI, password, and that the instance is still running.",
    );
  }
  return error instanceof Error ? error : new Error(message);
}

export function toNumber(value: unknown, fallback = 0): number {
  if (neo4j.isInt(value)) return (value as Integer).toNumber();
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return fallback;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && "properties" in value) {
    return (value as { properties: Record<string, unknown> }).properties;
  }
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}
