export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  company: string;
  blog: string;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export interface TechStack {
  name: string;
  icon: string;
  color: string;
}

export interface WidgetConfig {
  username: string;
  theme: 'light' | 'dark';
  showStats: boolean;
  showTechStack: boolean;
  techStack: TechStack[];
}
