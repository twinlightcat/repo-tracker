import React from "react";
import { useParams, NavLink } from "react-router";
import { useGetGitHubIssues } from "../../components/apis/github-issue";
import GitHubIssueTable from "../../components/content/github-issue-table";

function RepoFromSearch() {
  const { organization, repo } = useParams();
  const { data, isLoading, error } = useGetGitHubIssues(organization, repo);
  const issues = data?.issues || [];
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <div className="my-6">
        <NavLink to="/">Back to selection</NavLink>
        <h2 className="mt-2 text-2xl/7 font-bold text-gray-900">
          {organization}/{repo} Issues
        </h2>
      </div>
      <div className="p-5">
        <GitHubIssueTable issues={issues} isFetching={isLoading} />
      </div>
    </>
  );
}

export default RepoFromSearch;
