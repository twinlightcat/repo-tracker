import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GitHubUser } from "../../../types/github";
import { usePat } from "../hooks/use-pat";

export const keyGitHubUser = "github-user";

export interface GitHubUserResponse {
  user: GitHubUser;
}
export const fetchUser = async (token: string): Promise<GitHubUserResponse> => {
  const response = await axios.get<GitHubUser>(`https://api.github.com/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    params: {
      sort: "updated", // Sort by recently updated
    },
  });
  return {
    user: response.data,
  };
};

const useGetUser = () => {
  // Get the personal access token from context
  const { pat } = usePat();

  return useQuery({
    queryKey: [keyGitHubUser],
    queryFn: () => fetchUser(pat),
    enabled: !!pat, // Only fetch if PAT is available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export default useGetUser;
