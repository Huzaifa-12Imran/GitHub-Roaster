import { NextRequest } from "next/server";
import { getUser, getRepos, getEvents } from "@/lib/github";
import { generateRoast } from "@/lib/roast-engine";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await params;
    const { username } = resolvedParams;

    if (!username) {
      return new Response("Missing username", { status: 400 });
    }

    const user = await getUser(username);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // A fast roast just for the badge
    const repos = await getRepos(username);
    const events = await getEvents(username);
    const result = generateRoast(user, repos, events, [], [], []);

    const gradeColors: Record<string, string> = {
      'A': '#66ff66',
      'B': '#aaff66',
      'C': '#ffff66',
      'D': '#ffaa66',
      'F': '#ff6666'
    };
    const color = gradeColors[result.grade] || '#66ff66';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="130" height="28" role="img" aria-label="Roast Grade: ${result.grade}">
        <title>Roast Grade: ${result.grade}</title>
        <clipPath id="r">
          <rect width="130" height="28" rx="3" fill="#fff"/>
        </clipPath>
        <g clip-path="url(#r)">
          <rect width="85" height="28" fill="#2d2d2d"/>
          <rect x="85" width="45" height="28" fill="${color}"/>
        </g>
        <g fill="#fff" text-anchor="middle" font-family="monospace, Verdana, Geneva, DejaVu Sans, sans-serif" text-rendering="geometricPrecision" font-size="12" font-weight="bold">
          <text x="42.5" y="19" fill="#fff" textLength="65">ROAST GRADE</text>
          <text x="107.5" y="19" fill="#111" textLength="15">${result.grade}</text>
        </g>
      </svg>
    `.trim();

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"
      }
    });
  } catch (e) {
    return new Response("Error generating badge", { status: 500 });
  }
}
