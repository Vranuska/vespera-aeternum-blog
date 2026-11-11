import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // GitHub Pages hosts this app below /vespera-aeternum/, not at the domain root.
    basepath: import.meta.env.BASE_URL.replace(/\/$/, ""),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
