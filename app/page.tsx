import { UsernameInput } from "@/components/UsernameInput";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* N4 Nav (simulated for simplicity) */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10 mix-blend-difference">
        <div className="font-display tracking-widest text-sm uppercase opacity-50">GH_ROAST v1.0.0</div>
        <div className="hidden sm:flex px-3 py-1 border border-foreground/20 text-xs opacity-50 font-display">
          Press ⌘K to search
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16">
        <section className="w-full text-center px-4 animate-pulse-once">
          <h1 className="text-display-xl max-w-[12ch] mx-auto text-foreground mix-blend-lighten">
            Your code is public.
            <br />
            <span className="text-foreground/30">Act accordingly.</span>
          </h1>
          <UsernameInput />
        </section>
        
        <hr className="rule-thick w-full max-w-5xl mx-auto opacity-50 my-32" />
        
        <section className="w-full max-w-3xl mx-auto px-6 pb-32">
          <h2 className="text-display text-center mb-16 opacity-80">A purely algorithmic, brutal assessment.</h2>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="border border-foreground/10 p-8 bg-paper-2 hover:bg-paper-3 transition-colors duration-dur-slow relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity text-accent text-6xl font-display">F</div>
              <h3 className="text-xl font-display mb-4 text-accent">Consistency</h3>
              <p className="text-foreground/70 mb-4">"You commit like you go to the gym — with every intention of starting Monday."</p>
              <div className="text-xs uppercase tracking-widest opacity-40">Score: 24/100</div>
            </div>
            <div className="border border-foreground/10 p-8 bg-paper-2 hover:bg-paper-3 transition-colors duration-dur-slow relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity text-accent text-6xl font-display">D</div>
              <h3 className="text-xl font-display mb-4 text-accent">Documentation</h3>
              <p className="text-foreground/70 mb-4">"Your README has fewer words than this sentence."</p>
              <div className="text-xs uppercase tracking-widest opacity-40">Score: 41/100</div>
            </div>
          </div>
        </section>
      </main>

      {/* Ft5 Statement Footer */}
      <footer className="mt-auto px-6 py-16 border-t border-foreground/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-md">
            <h2 className="text-xl font-display leading-snug mb-8">
              No database. No LLM. Just your raw, unfiltered public GitHub data.
            </h2>
            <div className="text-xs tracking-widest opacity-50 uppercase flex gap-4">
              <Link href="/hall-of-shame" className="hover:text-accent transition-colors">Hall of shame</Link>
              <span>·</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Source</a>
            </div>
          </div>
          <div className="text-xs opacity-40 text-right">
            GH_ROAST © {new Date().getFullYear()}
            <br />
            Built for the dark.
          </div>
        </div>
      </footer>
    </>
  );
}
