import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import { keyGithubIssue } from "../apis/github-issue";
import useSearchGitHubRepos from "../apis/github-search-repo";
import useSearchOrgRepos from "../apis/github-org-repos";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../common/button";
import Spinner from "../common/spinner";

const RepoSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setShowDropdown(!!searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isRepoSearch = debouncedSearchTerm.includes("/");
  const [orgPart, repoPart] = debouncedSearchTerm.split("/", 2);
  const {
    data: searchData,
    isFetching: isFetchingSearch,
    error: searchError,
  } = useSearchGitHubRepos(debouncedSearchTerm, { enabled: !isRepoSearch });
  const {
    data: orgRepoData,
    isFetching: isFetchingOrgRepos,
    error: orgReposError,
  } = useSearchOrgRepos(orgPart, { enabled: isRepoSearch });

  const repos = useMemo(() => {
    const searchRepos = searchData?.repositories || [];
    const orgReposList = (orgRepoData?.repositories || [])
      .filter((repo) => {
        if (repoPart) {
          return repo.name.toLowerCase().includes(repoPart.toLowerCase());
        }
        return true;
      })
      .slice(0, 5);
    return isRepoSearch ? orgReposList : searchRepos;
  }, [searchData, isRepoSearch, orgRepoData, repoPart]);

  const isFetching = isFetchingSearch || isFetchingOrgRepos;
  const error = searchError || orgReposError;

  const isValidOrgRepo =
    isRepoSearch &&
    orgRepoData?.repositories.some(
      (repo) => repo.full_name === debouncedSearchTerm,
    );

  const handleRepoSelect = useCallback(
    (org: string, repo: string) => {
      const fullName = `${org}/${repo}`;
      setSearchTerm(fullName);
      setDebouncedSearchTerm(fullName);
      setShowDropdown(false);
      queryClient.invalidateQueries({
        queryKey: [keyGithubIssue, org, repo],
      });
      navigate(`/issues/${org}/${repo}`);
    },
    [queryClient, navigate],
  );

  const handleViewRepo = useCallback(() => {
    if (isValidOrgRepo) {
      const [owner, repo] = debouncedSearchTerm.split("/");
      queryClient.invalidateQueries({
        queryKey: [keyGithubIssue, owner, repo],
      });
      navigate(`/issues/${owner}/${repo}`);
      setShowDropdown(false);
    }
  }, [isValidOrgRepo, debouncedSearchTerm, queryClient, navigate]);

  return (
    <div className="mb-8">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Search</h2>
      </div>
      <div
        className="relative w-full flex items-center gap-2"
        ref={containerRef}
      >
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="repo, org/repo (e.g., TanStack/query)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(!!debouncedSearchTerm)}
            onBlur={() => {
              setShowDropdown(false);
            }}
            className="bg-white w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
          {showDropdown &&
            debouncedSearchTerm &&
            !isRepoSearch &&
            repos.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    onMouseDown={() =>
                      handleRepoSelect(repo.owner.login, repo.name)
                    }
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-semibold">
                          {repo.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {repo.description || "No description available"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          repo.private
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {showDropdown &&
            debouncedSearchTerm &&
            !isRepoSearch &&
            repos.length === 0 &&
            !isFetching && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg p-4 text-gray-500 border border-gray-200">
                No repositories found
              </div>
            )}
          {showDropdown && isRepoSearch && repos.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  onMouseDown={() =>
                    handleRepoSelect(repo.owner.login, repo.name)
                  } // Changed to onMouseDown
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-150"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold">
                        {repo.full_name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {repo.description || "No description available"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        repo.private
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {repo.private ? "Private" : "Public"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showDropdown &&
            isRepoSearch &&
            repos.length === 0 &&
            !isFetching &&
            orgPart && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg p-4 text-gray-500 border border-gray-200">
                No repositories found for {orgPart}
              </div>
            )}
        </div>
        <Button
          onClick={handleViewRepo}
          variant="primary"
          disabled={!isValidOrgRepo}
        >
          View Issues
        </Button>
      </div>
      {error && error.status !== 404 && (
        <div className="mt-4 text-red-500 text-center">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default RepoSearch;
