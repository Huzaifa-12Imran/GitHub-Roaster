> A brutal, purely algorithmic assessment of your GitHub profile. No database, no LLM API, no paid anything. Just your raw public data exposed.

A brutal, purely algorithmic assessment of your GitHub profile. No database, no LLM API, no paid anything. Just your raw public data exposed.

## Install and Usage

Clone the repo, install the dependencies, and run it locally.

```bash
git clone https://github.com/yourname/github-roast.git
cd github-roast
npm install
npm run dev
```

If you want higher rate limits (5000 req/hr instead of 60), create a `.env.local` file and add your GitHub token:
```env
GITHUB_TOKEN=ghp_your_token_here
```

## Example Output

```text
Grade: D
Score: 41/100

"Your README has fewer words than this sentence."
"12 open issues. 0 comments. A graveyard of good intentions."
```

## Roast Badge

Once you get your roast, embed your grade permanently in your GitHub profile `README.md` to show off your resilience:

```markdown
[![Roast Grade](https://github-roaster.vercel.app/badge/yourusername)](https://github-roaster.vercel.app/roast/yourusername)
```

This will render a dynamically generated SVG badge reflecting your grade.

## Hall of Shame

We keep a persistent leaderboard of the lowest-scoring public roasts at `/hall-of-shame`. It's stored in `data/shame.json`. Every week, a GitHub Action runs to tweet the most brutally roasted profile. 

## Contributing

Think you can write a better roast line? We welcome additions to the scoring logic! 
1. Open `lib/roast-lines.ts`
2. Add your most savage line to the appropriate category bin (0-19 is the lowest).
3. Submit a PR.

Turn your users into contributors, which drives PRs and keeps you active on Rankistan.
