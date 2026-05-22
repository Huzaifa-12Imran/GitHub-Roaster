import { NextResponse } from "next/server";
import { getShameBoard } from "@/lib/redis";

export const revalidate = 0; // Always fetch fresh

export async function GET() {
  try {
    const shameData = await getShameBoard();
    if (!shameData || shameData.length === 0) {
      return NextResponse.json({ error: "No shame data available" }, { status: 404 });
    }

    // Since getShameBoard returns them sorted ASC by score (lowest first),
    // the very first element is the worst score.
    const worst = shameData[0];

    return NextResponse.json(worst);
  } catch (error) {
    console.error("Failed to fetch worst shame entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
