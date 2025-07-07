import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubRepo } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

export const keyGitHubOrgRepos = "github-org-repos";

export interface GitHubRepoResponse {
  repositories: GitHubRepo[];
}
const fetchOrgRepos = async (
  token: string,
  org: string,
): Promise<GitHubRepoResponse> => {
  if (!org) return { repositories: [] };
  const response = await axios.get<GitHubRepo[]>(
    `https://api.github.com/orgs/${org}/repos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      params: {
        per_page: 5, // Limit to top 5 repos
        sort: "updated", // Sort by recently updated
      },
    },
  );

  return {
    repositories: response.data,
  };
};

const useSearchOrgRepos = (org: string, { enabled = true } = {}) => {
  // Get the personal access token from context
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGitHubOrgRepos, org],
    queryFn: () => fetchOrgRepos(pat, org),
    enabled: !!pat && !!org && enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};

export default useSearchOrgRepos;
