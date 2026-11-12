import handler from "@tanstack/react-start/server-entry";

// Use TanStack Start's built-in ServerEntry directly.
// The custom wrapper previously delegated through createServerEntry, but the
// GitHub Pages prerender runner still received a server without a callable
// fetch method. The built-in entry already owns request context and default
// SSR error conversion, so no custom wrapper is needed for this static portal.
export default handler;
