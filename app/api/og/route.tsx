import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getUser, getRepos, getEvents } from "@/lib/github";
import { generateRoast } from "@/lib/roast-engine";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response("Missing username", { status: 400 });
    }

    const user = await getUser(username);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const repos = await getRepos(username);
    const events = await getEvents(username);
    
    // For OG card, we can generate a quick roast without full deep fetch to be fast
    const result = generateRoast(user, repos, events, [], [], []);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111115",
            color: "#e6e6e6",
            fontFamily: "monospace",
            padding: "80px",
            border: "16px solid #111115"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "auto" }}>
            <div style={{ fontSize: 32, opacity: 0.5, letterSpacing: "0.1em" }}>GH_ROAST</div>
            <div style={{ fontSize: 32, opacity: 0.5, letterSpacing: "0.1em" }}>v1.0.0</div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", margin: "auto" }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>{user.login}</div>
            <div style={{ fontSize: 180, fontWeight: 700, color: "#66ff66", lineHeight: 1, marginBottom: 40 }}>{result.grade}</div>
            <div style={{ fontSize: 40, maxWidth: "800px", lineHeight: 1.4, opacity: 0.8 }}>
              "{result.killerLine}"
            </div>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "auto", opacity: 0.3, fontSize: 24, letterSpacing: "0.1em" }}>
            github-roaster.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
