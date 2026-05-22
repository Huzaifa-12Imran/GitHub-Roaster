import { notFound } from "next/navigation";
import { getUser, getRepos, getEvents, getCommits, getReadme, getPackageJson } from "@/lib/github";
import { generateRoast } from "@/lib/roast-engine";
import Link from "next/link";
import { ShareButtons } from "@/components/ShareButtons";
import { ScoreBar } from "@/components/ScoreBar";

export default async function RoastPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const user = await getUser(username);
  if (!user) {
    notFound();
  }

  const repos = await getRepos(username);
  const events = await getEvents(username);

  const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
  const [readmes, commits, packageJsons] = await Promise.all([
    Promise.all(topRepos.map(r => getReadme(username, r.name))),
    Promise.all(topRepos.map(r => getCommits(username, r.name))),
    Promise.all(topRepos.map(r => getPackageJson(username, r.name)))
  ]);

  const result = generateRoast(user, repos, events, readmes, commits, packageJsons);

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-4xl mx-auto w-full pt-16 sm:pt-32">
      <nav className="mb-16">
        <Link href="/" className="font-display tracking-widest text-sm uppercase opacity-50 hover:opacity-100 hover:text-accent transition-all">
          ← Back to safety
        </Link>
      </nav>

      <header className="mb-24 flex flex-col md:flex-row gap-8 items-start justify-between border-b border-foreground/10 pb-16">
        <div>
          <h1 className="text-display mb-2">{user.login}</h1>
          <p className="text-xl opacity-50 font-display">
            {user.public_repos} repos · {user.followers} followers
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-display-xl text-accent leading-none">{result.grade}</div>
          <div className="font-display tracking-widest text-sm uppercase opacity-50 mt-2">Overall Grade</div>
        </div>
      </header>

      <main className="grid md:grid-cols-2 gap-x-16 gap-y-24 mb-32">
        <div className="space-y-12">
          <h2 className="font-display tracking-widest text-sm uppercase opacity-50 mb-8 border-b border-foreground/10 pb-4">The Breakdown</h2>
          <ScoreBar label="Consistency" score={result.scores.consistency} />
          <ScoreBar label="Documentation" score={result.scores.documentation} />
          <ScoreBar label="Testing" score={result.scores.testing} />
          <ScoreBar label="Hygiene" score={result.scores.hygiene} />
          <ScoreBar label="Naming" score={result.scores.naming} />
          <ScoreBar label="Diversity" score={result.scores.diversity} />
          <ScoreBar label="Social" score={result.scores.social} />
          <ScoreBar label="Originality" score={result.scores.originality} />
        </div>

        <div className="space-y-12">
          <h2 className="font-display tracking-widest text-sm uppercase opacity-50 mb-8 border-b border-foreground/10 pb-4">The Verdict</h2>
          <div className="space-y-8 text-lg text-foreground/80">
            <p>"{result.lines.consistency}"</p>
            <p>"{result.lines.documentation}"</p>
            <p>"{result.lines.testing}"</p>
            <p>"{result.lines.hygiene}"</p>
            <p className="text-accent">"{result.lines.naming}"</p>
          </div>

          <div className="mt-16 pt-8 border-t border-foreground/10">
            <h3 className="font-display tracking-widest text-xs uppercase opacity-30 mb-4">Silver Linings</h3>
            <ul className="text-sm opacity-60 space-y-2 list-disc list-inside">
              {result.compliments.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-foreground/10 pt-16 pb-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <ShareButtons username={username} grade={result.grade} />
        <a 
          href={`/api/og?username=${username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
        >
          View Share Card
        </a>
      </footer>
    </div>
  );
}
