import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubOrg } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

export const keyGitHubOrgs = "github-orgs";

export const fetchGitHubOrgs = async (token: string): Promise<GitHubOrg[]> => {
  const response = await axios.get<GitHubOrg[]>(
    `https://api.github.com/user/orgs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return response.data;
};

const useGetGitHubOrgs = () => {
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGitHubOrgs],
    queryFn: () => fetchGitHubOrgs(pat),
    enabled: !!pat,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};

export default useGetGitHubOrgs;
