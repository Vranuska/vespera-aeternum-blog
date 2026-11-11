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
    // Generate the public archive as static HTML for GitHub Pages.
    // Link crawling discovers the individual diary/manuscript routes from the indexes.
    prerender: {
      enabled: true,
      autoSubfolderIndex: true,
      autoStaticPathsDiscovery: true,
      crawlLinks: true,
      concurrency: 4,
      retryCount: 2,
      retryDelay: 1000,
      failOnError: true,
    },
  },
});
