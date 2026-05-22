import { GithubUser, GithubRepo, GithubEvent } from "./types";

const GITHUB_API = "https://api.github.com";

// Helper to get headers with optional token
const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  return {
    "Accept": "application/vnd.github.v3+json",
    ...(token ? { "Authorization": `token ${token}` } : {}),
  };
};

// Generic fetcher with Next.js cache
async function fetchGithub<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`GitHub API error ${res.status} on ${endpoint}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function getUser(username: string): Promise<GithubUser | null> {
  return fetchGithub<GithubUser>(`/users/${username}`);
}

export async function getRepos(username: string): Promise<GithubRepo[]> {
  const repos = await fetchGithub<GithubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
  return repos || [];
}

export async function getEvents(username: string): Promise<GithubEvent[]> {
  const events = await fetchGithub<GithubEvent[]>(`/users/${username}/events/public?per_page=100`);
  return events || [];
}

export async function getCommits(username: string, repo: string): Promise<any[]> {
  const commits = await fetchGithub<any[]>(`/repos/${username}/${repo}/commits?per_page=50`);
  return commits || [];
}

export async function getReadme(username: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${username}/${repo}/readme`, {
      headers: {
        ...getHeaders(),
        "Accept": "application/vnd.github.raw",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

export async function getLanguages(username: string, repo: string): Promise<Record<string, number>> {
  const langs = await fetchGithub<Record<string, number>>(`/repos/${username}/${repo}/languages`);
  return langs || {};
}

export async function getPackageJson(username: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${username}/${repo}/contents/package.json`, {
      headers: {
        ...getHeaders(),
        "Accept": "application/vnd.github.v3.raw",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}
