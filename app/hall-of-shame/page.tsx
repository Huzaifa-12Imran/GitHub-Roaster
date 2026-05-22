import Link from "next/link";
import { getShameBoard, ShameEntry } from "@/lib/redis";

export const revalidate = 60; // Revalidate every minute

export default async function HallOfShame() {
  let shameData: ShameEntry[] = [];
  try {
    shameData = await getShameBoard();
  } catch (error) {
    console.error("Failed to fetch Hall of Shame:", error);
  }
  
  const sortedData = [...shameData].sort((a, b) => a.overall - b.overall);

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto w-full pt-16 sm:pt-32">
      <nav className="mb-16">
        <Link href="/" className="font-display tracking-widest text-sm uppercase opacity-50 hover:opacity-100 hover:text-accent transition-all">
          ← Back to safety
        </Link>
      </nav>

      <header className="mb-24 border-b border-foreground/10 pb-16">
        <h1 className="text-display mb-4 text-accent">Hall of Shame</h1>
        <p className="text-xl opacity-50 font-display max-w-2xl">
          The lowest-scoring public roasts. People intentionally share these bad scores for the joke.
        </p>
      </header>

      <main className="space-y-8 mb-32">
        {sortedData.map((entry, i) => (
          <div key={i} className="border border-foreground/10 p-6 bg-paper-2 hover:bg-paper-3 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="text-display text-accent opacity-50 w-16">#{i + 1}</div>
            <div className="flex-1">
              <Link href={`/roast/${entry.username}`} className="text-xl font-display hover:text-accent transition-colors block mb-2">
                @{entry.username}
              </Link>
              <p className="text-foreground/70 text-sm">"{entry.killerLine}"</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="text-4xl font-display text-error">{entry.grade}</div>
              <div className="text-xs uppercase tracking-widest opacity-40">Score: {entry.overall}/100</div>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-auto border-t border-foreground/10 pt-16 pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="max-w-md">
          <h2 className="text-xl font-display leading-snug mb-8">
            Think you can do worse?
          </h2>
          <div className="text-xs tracking-widest opacity-50 uppercase flex gap-4">
            <Link href="/" className="hover:text-accent transition-colors">Roast yourself</Link>
          </div>
        </div>
        <div className="text-xs opacity-40 text-right">
          GH_ROAST © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
