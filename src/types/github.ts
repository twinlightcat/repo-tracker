export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
  description: string | null;
}

export interface GitHubOrg {
  id: number;
  login: string;
  description: string | null;
}

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

interface GitHubLabel {
  id?: number;
  name?: string;
  color?: string;
  default?: boolean;
  description?: string | null;
}

interface GitHubMilestone {
  id?: number;
  number?: number;
  title?: string;
  description?: string | null;
  state?: string;
}

interface GitHubPullRequest {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at: string | null;
}

interface GitHubReactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface GitHubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  state: string;
  locked: boolean;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  milestone: GitHubMilestone | null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  type: string | null;
  active_lock_reason: string | null;
  draft: boolean;
  pull_request?: GitHubPullRequest; // Optional, as not all issues are pull requests
  body: string | null;
  closed_by: GitHubUser | null;
  reactions: GitHubReactions;
  timeline_url: string;
  performed_via_github_app: null; // Adjust if GitHub Apps are used
  state_reason: string | null;
}
