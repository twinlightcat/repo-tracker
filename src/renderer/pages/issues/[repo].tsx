import React from "react";
import { useParams, NavLink } from "react-router";
import { useGetGitHubIssues } from "../../components/apis/github-issue";
import GitHubIssueTable from "../../components/content/github-issue-table";

const BackToIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="size-4"
  >
    <path
      fillRule="evenodd"
      d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
      clipRule="evenodd"
    />
  </svg>
);

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
        <NavLink to="/">
          <div className="flex items-baseline gap-2 text-gray-600 hover:text-gray-900">
            <BackToIcon />
            Back to selection
          </div>
        </NavLink>
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
