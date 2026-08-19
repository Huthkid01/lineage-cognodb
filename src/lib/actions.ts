"use server";

import {
  restorerRecommendations,
  shortestArtworkPath,
} from "@/lib/queries";
import { tryDb } from "@/lib/safe";

export async function traceArtworkPath(fromId: string, toId: string) {
  return tryDb(() => shortestArtworkPath(fromId, toId));
}

export async function recommendRestorers(artworkId: string) {
  return tryDb(() => restorerRecommendations(artworkId));
}
