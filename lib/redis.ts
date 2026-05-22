import { Redis } from "@upstash/redis";

// Lazily created singleton — safe to import in any server context
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;

  // Vercel sometimes injects KV_REST_API_URL depending on the exact integration path used
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or KV_REST_API_URL env vars. " +
        "Check your Vercel Environment Variables tab."
    );
  }

  _redis = new Redis({ url, token });
  return _redis;
}

// ─── Shame Board helpers ───────────────────────────────────────────────────

export interface ShameEntry {
  username: string;
  grade: "A" | "B" | "C" | "D" | "F";
  overall: number;
  killerLine: string;
  date: string; // ISO date string
}

const SHAME_KEY = "shame:leaderboard";
const MAX_SHAME_ENTRIES = 20;

/**
 * Attempt to add an entry to the Hall of Shame (sorted set keyed by score ASC).
 * Only D and F grades qualify. Keeps only the 20 worst-ever scores.
 */
export async function maybeAddToShame(entry: ShameEntry): Promise<void> {
  const redis = getRedis();
  // Use overall score as rank (lower = more shameful = appears first)
  await redis.zadd(SHAME_KEY, {
    score: entry.overall,
    member: JSON.stringify(entry),
  });
  // Trim to worst MAX_SHAME_ENTRIES (keep lowest scores)
  const count = await redis.zcard(SHAME_KEY);
  if (count > MAX_SHAME_ENTRIES) {
    // Remove the highest scores (least shameful) to keep only the worst
    await redis.zremrangebyrank(SHAME_KEY, MAX_SHAME_ENTRIES, -1);
  }
}

/**
 * Return the Hall of Shame sorted by score ASC (most shameful first).
 */
export async function getShameBoard(): Promise<ShameEntry[]> {
  const redis = getRedis();
  const raw = await redis.zrange(SHAME_KEY, 0, MAX_SHAME_ENTRIES - 1);
  return raw.map((item) =>
    typeof item === "string" ? JSON.parse(item) : (item as ShameEntry)
  );
}
