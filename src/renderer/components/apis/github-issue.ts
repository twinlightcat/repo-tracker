import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubIssue } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

export const keyGithubIssue = "github-issue";

export interface GitHubIssueResponse {
  issues: GitHubIssue[];
}

const fetchAllGitHubIssues = async (
  token: string,
  owner: string,
  repo: string,
): Promise<GitHubIssueResponse> => {
  let allIssues: GitHubIssue[] = [];
  let page = 1;
  const perPage = 100;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await axios.get<GitHubIssue[]>(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        params: {
          per_page: perPage,
          page,
        },
      },
    );

    allIssues = [...allIssues, ...response.data];

    // Check for Link header to determine if there's a next page
    const linkHeader = response.headers["link"];
    if (!linkHeader || !linkHeader.includes('rel="next"')) {
      hasNextPage = false; // No more pages
    } else {
      page++;
    }
  }

  return {
    issues: allIssues,
  };
};

export const useGetGitHubIssues = (owner: string, repo: string) => {
  // Get the personal access token from context
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGithubIssue, owner, repo],
    queryFn: () => fetchAllGitHubIssues(pat, owner, repo),
    enabled: !!pat && !!owner && !!repo,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
