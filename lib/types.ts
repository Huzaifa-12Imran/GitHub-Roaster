export interface GithubUser {
  login: string;
  avatar_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  name: string;
  full_name: string;
  description: string;
  fork: boolean;
  stargazers_count: number;
  language: string | null;
  has_wiki: boolean;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  created_at: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload?: any;
}

export interface RoastScores {
  consistency: number;
  documentation: number;
  testing: number;
  hygiene: number;
  naming: number;
  diversity: number;
  social: number;
  originality: number;
  overall: number;
}

export interface RoastCategory {
  score: number;
  line: string;
}

export interface RoastResult {
  username: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  scores: RoastScores;
  lines: {
    consistency: string;
    documentation: string;
    testing: string;
    hygiene: string;
    naming: string;
    diversity: string;
    social: string;
    originality: string;
  };
  compliments: string[];
  killerLine: string;
}
