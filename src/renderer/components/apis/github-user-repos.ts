import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubRepo } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

export const keyGitHubUserRepos = "github-user-repos";

export interface GitHubRepoResponse {
  repositories: GitHubRepo[];
}
const fetchUserRepos = async (token: string): Promise<GitHubRepoResponse> => {
  const response = await axios.get<GitHubRepo[]>(
    `https://api.github.com/user/repos`,
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

const useGetUserRepos = () => {
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGitHubUserRepos],
    queryFn: () => fetchUserRepos(pat),
    enabled: !!pat, // Only fetch if PAT is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};

export default useGetUserRepos;
