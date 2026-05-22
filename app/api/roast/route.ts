import { NextRequest, NextResponse } from "next/server";
import { getUser, getRepos, getEvents, getCommits, getReadme, getPackageJson } from "@/lib/github";
import { generateRoast } from "@/lib/roast-engine";
import { maybeAddToShame } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const user = await getUser(username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const repos = await getRepos(username);
    const events = await getEvents(username);

    // Top 5 repos by stars
    const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
    
    // Fetch commits, readmes, and package.json in parallel
    const [readmes, commits, packageJsons] = await Promise.all([
      Promise.all(topRepos.map(r => getReadme(username, r.name))),
      Promise.all(topRepos.map(r => getCommits(username, r.name))),
      Promise.all(topRepos.map(r => getPackageJson(username, r.name)))
    ]);

    const result = generateRoast(user, repos, events, readmes, commits, packageJsons);

    if (result.grade === "D" || result.grade === "F") {
      try {
        await maybeAddToShame({
          username: result.username,
          grade: result.grade,
          overall: result.scores.overall,
          killerLine: result.killerLine,
          date: new Date().toISOString()
        });
      } catch (redisError) {
        console.error("Failed to add to Hall of Shame (KV might not be configured):", redisError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Roast API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
