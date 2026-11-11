// @lovable.dev/vite-tanstack-config already includes TanStack Start, React,
// Tailwind, Nitro and the Lovable development integrations. Keep that stack intact.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // This project is published inside the /vespera-aeternum/ GitHub Pages path.
  vite: {
    base: "/vespera-aeternum/",
  },
  tanstackStart: {
    // Keep the existing SSR error wrapper used by Lovable.
    server: { entry: "server" },
    // Start prerendering at the actual router base path. Link crawling then
    // discovers the archive indexes and their individual manuscript routes.
    prerender: {
      enabled: true,
      autoSubfolderIndex: true,
      autoStaticPathsDiscovery: false,
      crawlLinks: true,
      concurrency: 4,
      retryCount: 2,
      retryDelay: 1000,
      failOnError: true,
    },
    pages: [
      {
        path: "/vespera-aeternum/",
        prerender: { enabled: true },
      },
    ],
  },
});
