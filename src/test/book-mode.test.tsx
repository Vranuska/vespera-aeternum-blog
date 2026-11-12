import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from "@tanstack/react-router";
import { BookNavigation } from "@/components/vespera/BookNavigation";
import { normalize, parseEntries, bookWorks, readerNavigation } from "@/lib/works";
import { EDITORIAL_ORDER } from "@/data/reading-order";
import entries from "@/data/entries-fallback.json";
import editorial from "@/data/editorial-fallback.json";

const works = normalize(parseEntries(entries), "fallback");

describe("Modo livro", () => {
  it("segue a ordem editorial aprovada do Volume I", () => {
    const chapters = editorial.editorial_reading_order.chapters.map((c) => c.entry_id);
    expect(EDITORIAL_ORDER).toEqual(chapters);
    expect(bookWorks(works).slice(0, chapters.length).map((w) => w.id)).toEqual(chapters);
    expect(bookWorks(works)[0]?.id).toBe("2026-10-21-o-inventario-das-coisas-que-ainda-funcionam");
  });

  it("links de anterior, próximo e índice preservam modo=livro", async () => {
    const nav = readerNavigation(works, EDITORIAL_ORDER[1]!, "livro");
    const root = createRootRoute({ component: Outlet });
    const page = createRoute({ getParentRoute: () => root, path: "/", component: () => <BookNavigation navigation={nav} location="fim" /> });
    const stub = createRoute({ getParentRoute: () => root, path: "/diarios/$id" });
    const index = createRoute({ getParentRoute: () => root, path: "/diarios" });
    const router = createRouter({ routeTree: root.addChildren([page, stub, index]), history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("Obra 2 de " + works.length)).toBeTruthy();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/diarios/" + EDITORIAL_ORDER[0] + "?modo=livro");
    expect(hrefs).toContain("/diarios/" + EDITORIAL_ORDER[2] + "?modo=livro");
    expect(hrefs).toContain("/diarios?modo=livro");
  });
});