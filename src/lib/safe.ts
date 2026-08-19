import { DatabaseConfigError, DatabaseUnavailableError } from "./db";

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export async function tryDb<T>(work: () => Promise<T>): Promise<DbResult<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    const message =
      error instanceof DatabaseUnavailableError || error instanceof DatabaseConfigError
        ? error.message
        : error instanceof Error
          ? error.message
          : "The graph query failed.";
    return { ok: false, message };
  }
}
