import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubRepo } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

interface RateLimitInfo {
  limit: number; // Total rate limit
  remaining: number; // Remaining requests
  reset: number; // Unix timestamp when limit resets
  used: number; // Used requests
}

interface GitHubRepoResponse {
  repositories: GitHubRepo[];
  rateLimit: RateLimitInfo;
}

export const keyGitHubRepoSearch = "github-repo-search";

const fetchGitHubRepos = async (
  token: string,
  query: string,
): Promise<GitHubRepoResponse> => {
  if (!query.trim())
    return {
      repositories: [],
      rateLimit: { limit: 0, remaining: 0, reset: 0, used: 0 },
    };
  const response = await axios.get<{ items: GitHubRepo[] }>(
    `https://api.github.com/search/repositories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      params: {
        q: query,
        per_page: 5, // Limit to top 5 results
      },
    },
  );
  return {
    repositories: response.data.items,
    rateLimit: {
      limit: parseInt(response.headers["x-ratelimit-limit"] || "0", 10),
      remaining: parseInt(response.headers["x-ratelimit-remaining"] || "0", 10),
      reset: parseInt(response.headers["x-ratelimit-reset"] || "0", 10),
      used: parseInt(response.headers["x-ratelimit-used"] || "0", 10),
    },
  };
};

const useSearchGitHubRepos = (query: string, { enabled = true } = {}) => {
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGitHubRepoSearch, query],
    queryFn: () => fetchGitHubRepos(pat, query),
    enabled: !!pat && !!query.trim() && enabled, // Only fetch if query is non-empty
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};

export default useSearchGitHubRepos;
