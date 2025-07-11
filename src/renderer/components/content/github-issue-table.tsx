import React, { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GitHubIssue } from "../../../types/github";
import Button from "../../components/common/button";
import Spinner from "../common/spinner";

interface GitHubIssueTableProps {
  issues: GitHubIssue[];
  isFetching?: boolean;
}

const ClipBoardIcon = () => (
  <svg
    className="w-16 h-16 text-gray-400 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2 Sist:2h2a2 2 0 012 2"
    />
  </svg>
);

const columnHelper = createColumnHelper<GitHubIssue>();

const columns = [
  columnHelper.accessor("state", {
    header: "Status",
    cell: (info) => (
      <span
        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
          info.getValue() === "open"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {info.getValue().toUpperCase()}
      </span>
    ),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => {
      const issue = info.row.original;
      return (
        <div className="font-medium text-gray-900">
          {issue.title}
          {issue.number ? (
            <span className="ml-1 text-sm text-red-800">(#{issue.number})</span>
          ) : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("user", {
    header: "Author",
    cell: (info) => {
      const user = info.getValue();
      return (
        <div className="flex items-center gap-x-4">
          <img
            alt="Avatar"
            src={user.avatar_url}
            className="size-8 rounded-full bg-gray-800"
          />
          <div className="truncate text-sm/6 font-medium">{user.login}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    cell: (info) => {
      const issue = info.row.original;
      return (
        <Button
          variant="secondary"
          onClick={() => window.api.openExternal(issue.html_url)}
          className="px-4 py-2 text-sm"
        >
          View on GitHub
        </Button>
      );
    },
  }),
];

const GitHubIssueTable: React.FC<GitHubIssueTableProps> = ({
  issues,
  isFetching,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(20);

  // Get unique creators for the filter dropdown
  const creators = useMemo(() => {
    const uniqueCreators = [
      ...new Set(issues.map((issue) => issue.user.login)),
    ];
    return uniqueCreators.sort();
  }, [issues]);

  // Filter issues based on search term and selected creator
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCreator = selectedCreator
        ? issue.user.login === selectedCreator
        : true;
      return matchesSearch && matchesCreator;
    });
  }, [issues, searchTerm, selectedCreator]);

  const table = useReactTable({
    data: filteredIssues,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex gap-4 flex-row items-center relative justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          disabled={isFetching}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white w-full sm:w-1/2 rounded-lg grow border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCreator || ""}
          onChange={(e) => setSelectedCreator(e.target.value || null)}
          className="bg-white w-full sm:w-1/4 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Creators</option>
          {creators.map((creator) => (
            <option key={creator} value={creator}>
              {creator}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg shadow-lg">
        {filteredIssues.length === 0 && !isFetching ? (
          <div className="flex flex-col items-center justify-center h-full bg-white p-8 text-center">
            <ClipBoardIcon />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Issues Found
            </h3>
            <p className="text-gray-500">
              There are currently no issues to display. Try adjusting your
              search or filters.
            </p>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-386px)] overflow-y-auto custom-scrollbar">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-semibold tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {filteredIssues.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className=""
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="primary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                table.setPageSize(Number(e.target.value));
              }}
              className="rounded-lg border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {isFetching && filteredIssues.length === 0 ? (
        <div className="flex items-center justify-center h-full bg-white p-8">
          <Spinner size="lg" />
        </div>
      ) : null}
    </div>
  );
};

export default GitHubIssueTable;
