import { describe, it, expect } from "vitest";
import { parseEditorial, buildEras, buildEraDays, loadEditorial, OUTSIDE } from "@/lib/editorial";
import { EDITORIAL_ORDER } from "@/data/reading-order";
import { bookWorks, normalize, readerNavigation } from "@/lib/works";
import fallback from "@/data/editorial-fallback.json";

const index = parseEditorial(fallback, "fallback");
const allIds = new Set([
  ...index.chronology.map((c) => c.entry_id),
  ...index.unplaced.map((u) => u.entry_id),
]);

describe("Índice editorial", () => {
  it("mantém A maré autônoma fora do Volume I e com data de universo própria", () => {
    const mare = "2026-11-10-a-mare-nao-assina-recibos";
    const rua = "2026-11-09-a-rua-que-cabia-na-margem";
    expect(index.chapters.some((chapter) => chapter.entry_id === mare)).toBe(false);
    expect(index.chronology.find((entry) => entry.entry_id === mare)?.time).toBe("1921-11");
    expect(index.unplaced.some((entry) => entry.entry_id === mare)).toBe(false);
    const arc = fallback.continuity_notes.secondary_arcs.find((item) => item.id === "registros-na-margem");
    expect(arc?.seeded_in).toEqual([rua, mare]);
  });
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
      "1921",
      "1922",
      "1926",
      "1943",
      "1944",
      "1996",
      "1997",
      "1998",
      OUTSIDE,
    ]);
    const e1943 = eras.find((e) => e.key === "1943")!;
    expect(e1943.months.map((m) => m.label)).toEqual(["novembro de 1943", "dezembro de 1943"]);
    expect(eras.find((e) => e.key === "1891")!.months[0]!.entries).toHaveLength(3);
  });
  it("abre dias exatos e preserva registros cuja data só é conhecida por mês", () => {
    const { eras } = buildEras(index, allIds);
    const january = eras.find((era) => era.key === "1944")!.months.find((month) => month.key === "01")!;
    const exact = buildEraDays(january.entries);
    expect(exact.days.map((day) => day.key)).toEqual(["12", "14", "21", "25", "29"]);
    expect(exact.partial).toEqual([]);

    const november = eras.find((era) => era.key === "1891")!.months[0]!;
    const partial = buildEraDays(november.entries);
    expect(partial.days).toEqual([]);
    expect(partial.partial).toHaveLength(3);
  });
  it("fora da cronologia contém só unplaced_archive", () => {
    const { eras } = buildEras(index, allIds);
    const outside = eras.find((e) => e.key === OUTSIDE)!.months[0]!.entries.map((e) => e.id);
    expect(outside).toEqual(index.unplaced.map((u) => u.entry_id));
    expect(outside).toHaveLength(35);
    expect(outside).toContain("2026-11-20-as-estrelas-do-lado-de-dentro");
    expect(outside).toContain("2026-11-20-folha-de-prova-de-eva");
    expect(outside).not.toContain("2026-11-10-a-mare-nao-assina-recibos");
  });
  it("mantém o Caderno de Eva como arco secundário sem data de universo inventada", () => {
    const story = "2026-11-20-as-estrelas-do-lado-de-dentro";
    const document = "2026-11-20-folha-de-prova-de-eva";
    expect(index.chapters.some((chapter) => [story, document].includes(chapter.entry_id))).toBe(false);
    expect(index.chronology.some((entry) => [story, document].includes(entry.entry_id))).toBe(false);
    expect(index.unplaced.map((entry) => entry.entry_id)).toEqual(expect.arrayContaining([story, document]));
    const arc = fallback.continuity_notes.secondary_arcs.find((item) => item.id === "azrakhel-e-eva");
    expect(arc?.editorial_sequence.map((item) => item.entry_id)).toEqual([story, document]);
    expect(arc?.seeded_in).toContain("azrakhel-o-demonio-que-veio-me-matar-v1");
  });
  it("mantém A primeira saída como arco secundário com cronologia e ordem próprias", () => {
    const story = "2026-11-23-a-feira-nao-perguntou-meu-nome";
    const document = "2026-11-23-nota-da-banca-de-papelaria";
    expect(index.chapters.some((chapter) => [story, document].includes(chapter.entry_id))).toBe(false);
    expect(index.chronology.find((entry) => entry.entry_id === story)?.time).toBe("1996");
    expect(index.chronology.find((entry) => entry.entry_id === document)?.time).toBe("1996");
    expect(index.unplaced.map((entry) => entry.entry_id)).not.toContain(story);
    expect(index.unplaced.map((entry) => entry.entry_id)).not.toContain(document);
    const arc = fallback.continuity_notes.secondary_arcs.find((item) => item.id === "menina-do-sapato-vermelho");
    expect(arc?.editorial_sequence.map((item) => item.entry_id)).toEqual([story, document]);
  });
  it("mantém o testemunho de Eithne e sua correção fora da cronologia e do Volume I", () => {
    const story = "2026-11-27-o-som-que-ficou-na-margem";
    const document = "2026-11-27-correcao-a-margem";
    expect(index.chapters.some((chapter) => [story, document].includes(chapter.entry_id))).toBe(false);
    expect(index.chronology.some((entry) => [story, document].includes(entry.entry_id))).toBe(false);
    expect(index.unplaced.map((entry) => entry.entry_id)).toEqual(expect.arrayContaining([story, document]));
    const arc = fallback.continuity_notes.secondary_arcs.find((item) => item.id === "eithne-family-traveler");
    expect(arc?.editorial_sequence.map((item) => item.entry_id)).toEqual([story, document]);
    expect(arc?.seeded_in).toContain("bestiario-eithne-v1");
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
  it("espelha exatamente os capítulos do índice", () => {
    expect(EDITORIAL_ORDER).toEqual(index.chapters.map((c) => c.entry_id));
    expect(EDITORIAL_ORDER).toHaveLength(index.chapters.length);
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