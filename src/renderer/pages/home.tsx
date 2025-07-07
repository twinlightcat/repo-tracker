import React from "react";
import RepoSearch from "../components/content/repo-search";
import { usePat } from "../components/hooks/use-pat";
import Welcome from "../components/content/welcome";
import UserRepos from "../components/content/user-repos";

function Root() {
  const { pat } = usePat();

  if (!pat) {
    return <Welcome />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        Select a Repository
      </h1>

      <div>
        <RepoSearch />
        <UserRepos />
      </div>
    </>
  );
}

export default Root;
