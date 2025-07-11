import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useGetUser, { keyGitHubUser } from "../../apis/github-user";
import { usePat } from "../../hooks/use-pat";
import SkeletonProfile from "./skeleton-profile";

export default function Profile() {
  const { deletePat } = usePat();
  const { data, isLoading } = useGetUser();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(() => {
    queryClient.removeQueries({
      queryKey: [keyGitHubUser],
    });
    deletePat();
  }, [queryClient, deletePat]);

  if (!data?.user?.id && !isLoading) {
    return null;
  }

  if (!data?.user?.id && isLoading) {
    return <SkeletonProfile />;
  }

  const { user } = data;

  return (
    <span className="group block shrink-0">
      <div className="flex items-center">
        <div>
          <img
            alt="avatar"
            src={user.avatar_url}
            className="inline-block size-9 rounded-full"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {user.login}
          </p>
          <a
            href="#"
            className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
            onClick={handleLogout}
          >
            Logout
          </a>
        </div>
      </div>
    </span>
  );
}
