import { GithubUser, GithubRepo, GithubEvent, RoastResult } from "./types";
import { roastLines, compliments } from "./roast-lines";

const getLineForScore = (category: keyof typeof roastLines, score: number) => {
  const bins = roastLines[category];
  for (const bin of bins) {
    if (score <= bin.max) return bin.line;
  }
  return bins[bins.length - 1].line;
};

function scoreConsistency(events: GithubEvent[]): number {
  if (events.length === 0) return 10;
  
  const now = Date.now();
  const pushEvents = events.filter(e => e.type === "PushEvent");
  
  if (pushEvents.length === 0) return 20;

  const dates = pushEvents.map(e => new Date(e.created_at).getTime());
  const maxGap = Math.max(...dates.map((d, i) => i === 0 ? now - d : dates[i-1] - d));
  const daysGap = maxGap / (1000 * 60 * 60 * 24);

  if (daysGap > 30) return 30;
  if (daysGap > 14) return 50;
  if (daysGap > 7) return 70;
  return 90;
}

function scoreSocial(user: GithubUser): number {
  if (user.following === 0 && user.followers === 0) return 50;
  const ratio = user.followers / (user.following || 1);
  if (ratio > 5) return 90;
  if (ratio > 1) return 70;
  if (ratio < 0.1 && user.following > 100) return 10; // Follow farming
  return 40;
}

function scoreOriginality(repos: GithubRepo[]): number {
  if (repos.length === 0) return 50;
  const forks = repos.filter(r => r.fork).length;
  const forkRatio = forks / repos.length;
  
  if (forkRatio > 0.8) return 10;
  if (forkRatio > 0.5) return 40;
  if (forkRatio < 0.2) return 90;
  return 70;
}

export function generateRoast(
  user: GithubUser,
  repos: GithubRepo[],
  events: GithubEvent[],
  topReadmes: (string | null)[],
  topCommitsList: any[][],
  packageJsons: (string | null)[]
): RoastResult {
  // Simple heuristic scores for missing detailed data
  const consistency = scoreConsistency(events);
  const social = scoreSocial(user);
  const originality = scoreOriginality(repos);
  
  // Doc: -20 if no readme, else based on length
  let docScore = 50;
  const readmesFound = topReadmes.filter(r => r && r.length > 50).length;
  if (readmesFound === 0 && topReadmes.length > 0) docScore = 15;
  else if (readmesFound > 0) docScore = Math.min(100, 20 + (readmesFound * 20));

  // Naming: check for bad commit msgs
  let badMsgs = 0;
  let totalMsgs = 0;
  topCommitsList.forEach(commits => {
    commits.forEach(c => {
      totalMsgs++;
      const msg = c.commit?.message?.toLowerCase() || "";
      if (msg.length < 10 || msg === "fix" || msg === "update" || msg === "wip") {
        badMsgs++;
      }
    });
  });
  // If no commits fetched (e.g. repos have no recent history), assume moderate laziness
  const naming = totalMsgs === 0 ? 35 : Math.max(10, 100 - (badMsgs / totalMsgs * 100));

  // Hygiene: open issues on old repos, 'test' in name
  const abandoned = repos.filter(r => r.open_issues_count > 0 && new Date(r.pushed_at).getTime() < Date.now() - 31536000000).length;
  const testNames = repos.filter(r => r.name.toLowerCase().includes("test") || r.name.toLowerCase().includes("untitled")).length;
  
  // Use ratios instead of absolute counts because users with 500+ repos auto-fail otherwise
  const abandonedRatio = repos.length > 0 ? abandoned / repos.length : 0;
  const testRatio = repos.length > 0 ? testNames / repos.length : 0;
  
  let hygiene = 100 - (abandonedRatio * 200) - (testRatio * 200);
  if (hygiene < 0) hygiene = 10;

  // Diversity: languages
  const langs = new Set(repos.map(r => r.language).filter(Boolean));
  const diversity = Math.min(100, langs.size * 20);

  // Real Testing Score: parsing package.json for testing frameworks
  let testing = 20; // Default low score
  if (packageJsons.length > 0) {
    const testFrameworks = ["jest", "vitest", "mocha", "ava", "pytest", "rspec", "cypress", "playwright"];
    let reposWithTests = 0;
    
    packageJsons.forEach(pkgStr => {
      if (pkgStr) {
        try {
          const pkg = JSON.parse(pkgStr);
          const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
          const hasTestFramework = testFrameworks.some(fw => allDeps[fw]);
          const hasTestScript = pkg.scripts && pkg.scripts.test && !pkg.scripts.test.includes("echo \"Error: no test specified\"");
          
          if (hasTestFramework || hasTestScript) {
            reposWithTests++;
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    });
    
    testing = Math.min(100, 20 + (reposWithTests / packageJsons.length) * 80);
  } else if (testNames > 0) {
    testing = 25; // Fallback if no package.json but has test-named repos
  } else {
    testing = 10; // No package.json found at all — very likely untested
  }

  const scores = {
    consistency: Math.round(consistency),
    documentation: Math.round(docScore),
    testing: Math.round(testing),
    hygiene: Math.round(hygiene),
    naming: Math.round(naming),
    diversity: Math.round(diversity),
    social: Math.round(social),
    originality: Math.round(originality)
  };

  const weights = {
    consistency: 0.20,
    documentation: 0.15,
    testing: 0.20,
    hygiene: 0.15,
    naming: 0.10,
    diversity: 0.05,
    social: 0.05,
    originality: 0.10,
  };

  const overall = Object.entries(weights).reduce((sum, [key, w]) => sum + scores[key as keyof typeof scores] * w, 0);

  const overallScore = Math.round(overall);

  const finalScores = {
    ...scores,
    overall: overallScore
  };

  const grade =
    overall >= 85 ? 'A' :
    overall >= 70 ? 'B' :
    overall >= 55 ? 'C' :
    overall >= 40 ? 'D' : 'F';

  return {
    username: user.login,
    grade,
    scores: finalScores,
    lines: {
      consistency: getLineForScore("consistency", scores.consistency),
      documentation: getLineForScore("documentation", scores.documentation),
      testing: getLineForScore("testing", scores.testing),
      hygiene: getLineForScore("hygiene", scores.hygiene),
      naming: getLineForScore("naming", scores.naming),
      diversity: getLineForScore("diversity", scores.diversity),
      social: getLineForScore("social", scores.social),
      originality: getLineForScore("originality", scores.originality),
    },
    compliments: [
      compliments[Math.floor(Math.random() * compliments.length)],
      compliments[Math.floor(Math.random() * compliments.length)]
    ].filter((v, i, a) => a.indexOf(v) === i), // dedupe
    killerLine: (() => {
      // Pick the line from the worst-scoring category for maximum impact
      const categoryScores: [keyof typeof scores, number][] = [
        ["consistency", scores.consistency],
        ["documentation", scores.documentation],
        ["testing", scores.testing],
        ["hygiene", scores.hygiene],
        ["naming", scores.naming],
        ["diversity", scores.diversity],
        ["social", scores.social],
        ["originality", scores.originality],
      ];
      const worst = categoryScores.reduce((min, cur) => cur[1] < min[1] ? cur : min);
      return getLineForScore(worst[0] as keyof typeof roastLines, worst[1]);
    })()
  };
}
