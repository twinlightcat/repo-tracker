import React from "react";
import { useNavigate } from "react-router";

import { keyGithubIssue } from "../apis/github-issue";
import useGetUserRepos from "../apis/github-user-repos";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../common/button";

const UserRepos: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: userRepoData,
    isFetching: isFetchingUser,
    error: userError,
  } = useGetUserRepos();

  // Use user repos only when search term is empty, otherwise use org repos for repo search
  const repos = userRepoData?.repositories || [];

  const isFetching = isFetchingUser;
  const error = userError;

  const handleViewRepo = (owner: string, repo: string) => {
    queryClient.invalidateQueries({
      queryKey: [keyGithubIssue, owner, repo],
    });
    navigate(`/issues/${owner}/${repo}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800">Your Repositories</h2>
      {error && (
        <div className="mt-4 text-red-500 text-center">
          Error: {error.message}
        </div>
      )}
      {repos.length > 0 && (
        <div className="mt-6 w-full grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {repo.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {repo.description || "No description available"}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      repo.private
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {repo.private ? "Private" : "Public"}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => handleViewRepo(repo.owner.login, repo.name)}
                    variant="secondary"
                    size="sm"
                  >
                    View Issues
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {repos.length === 0 && !isFetching && (
        <div className="mt-4 text-gray-500 text-center">
          No user repositories created.
        </div>
      )}
    </div>
  );
};

export default UserRepos;
