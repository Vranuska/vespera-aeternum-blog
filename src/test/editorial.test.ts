import { describe, it, expect } from "vitest";
import { parseEditorial, buildEras, loadEditorial, OUTSIDE } from "@/lib/editorial";
import { EDITORIAL_ORDER } from "@/data/reading-order";
import { bookWorks, normalize, readerNavigation } from "@/lib/works";
import fallback from "@/data/editorial-fallback.json";

const index = parseEditorial(fallback, "fallback");
const allIds = new Set([
  ...index.chronology.map((c) => c.entry_id),
  ...index.unplaced.map((u) => u.entry_id),
]);

describe("Índice editorial", () => {
  it("rejeita estrutura inválida e datas fora do formato", () => {
    expect(() => parseEditorial({})).toThrow();
    expect(() =>
      parseEditorial({
        editorial_reading_order: { chapters: [] },
        universe_chronology: [{ entry_id: "x", label: "L", time: "ontem" }],
        unplaced_archive: [],
      }),
    ).toThrow();
  });
  it("agrupa nas eras do índice e por mês", () => {
    const { eras, missing } = buildEras(index, allIds);
    expect(missing).toEqual([]);
    expect(eras.map((e) => e.key)).toEqual([
      "1886",
      "1891",
      "1898",
      "1926",
      "1943",
      "1944",
      "1997",
      OUTSIDE,
    ]);
    const e1943 = eras.find((e) => e.key === "1943")!;
    expect(e1943.months.map((m) => m.label)).toEqual(["novembro de 1943", "dezembro de 1943"]);
    expect(eras.find((e) => e.key === "1891")!.months[0]!.entries).toHaveLength(3);
  });
  it("fora da cronologia contém só unplaced_archive", () => {
    const { eras } = buildEras(index, allIds);
    const outside = eras.find((e) => e.key === OUTSIDE)!.months[0]!.entries.map((e) => e.id);
    expect(outside).toEqual(index.unplaced.map((u) => u.entry_id));
    expect(outside).toHaveLength(31);
  });
  it("ignora IDs ausentes em entries.json e os reporta", () => {
    const known = new Set([...allIds].filter((id) => id !== "2026-10-26-a-costura-invisivel"));
    const { eras, missing } = buildEras(index, known);
    expect(missing).toEqual(["2026-10-26-a-costura-invisivel"]);
    expect(eras.some((e) => e.key === "1886")).toBe(false);
  });
  it("usa cópia local se o índice remoto falhar", async () => {
    expect(
      (
        await loadEditorial(async () => {
          throw new Error("offline");
        })
      ).source,
    ).toBe("fallback");
  });
});

describe("Ordem de leitura aprovada", () => {
  it("espelha exatamente os 16 capítulos do índice", () => {
    expect(EDITORIAL_ORDER).toEqual(index.chapters.map((c) => c.entry_id));
    expect(EDITORIAL_ORDER).toHaveLength(16);
  });
  it("modo livro segue a ordem aprovada e mantém as demais obras acessíveis", () => {
    const raw = (id: string, title: string) => ({
      id,
      title,
      date: "x",
      paragraphs: ["p"],
      characters: [],
    });
    const works = normalize([
      raw("solto", "Aaa"),
      raw(EDITORIAL_ORDER[1]!, "Z"),
      raw(EDITORIAL_ORDER[0]!, "Y"),
    ]);
    expect(bookWorks(works).map((w) => w.id)).toEqual([
      EDITORIAL_ORDER[0],
      EDITORIAL_ORDER[1],
      "solto",
    ]);
    expect(readerNavigation(works, EDITORIAL_ORDER[0]!, "livro").next?.id).toBe(EDITORIAL_ORDER[1]);
  });
});