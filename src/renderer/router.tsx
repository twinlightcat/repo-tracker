import { createBrowserRouter } from "react-router";

import Root from "./pages/home";
import RepoFromSearch from "./pages/issues/[repo]";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "/issues/:organization/:repo",
    Component: RepoFromSearch,
  },
]);

export default router;
