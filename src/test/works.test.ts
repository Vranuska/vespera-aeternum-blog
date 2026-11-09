import { describe, it, expect } from "vitest";
import { normalize, parseEntries, bookWorks, loadWorks, ownedImage, readerNavigation } from "@/lib/works";
import editorial from "@/data/editorial-fallback.json";

const raw = (id: string, title: string) => ({ id, title, date: "Sem data", paragraphs: ["Texto original sem alterações."], characters: [] });
describe("Arquivo e ordem editorial", () => {
  it("preserva parágrafos originais e personagens sem Vespera", () => {
    const entry = raw("novo", "Novo");
    const work = normalize([entry])[0];
    expect(work?.paragraphs).toEqual(entry.paragraphs);
    expect(work?.characters).toEqual([]);
    expect(work?.series).toBeUndefined();
    expect(work?.standalone).toBeUndefined();
  });
  it("separa ordem editorial da cronologia sem mutar o arquivo", () => {
    const works = normalize([raw("z", "Zulu"), raw("a", "Alfa")]);
    expect(bookWorks(works).map(w => w.id)).toEqual(["a", "z"]);
    expect(bookWorks(works, ["z", "a"]).map(w => w.id)).toEqual(["z", "a"]);
    expect(works.map(w => w.id)).toEqual(["z", "a"]);
  });
  it("ordena somente posições explícitas de séries e mantém contos autônomos", () => {
    const works = normalize([{ ...raw("dois", "A"), series: { id: "s", title: "Série", position: 2 } }, { ...raw("um", "Z"), series: { id: "s", title: "Série", position: 1 } }, { ...raw("solo", "Solo"), standalone: true }]);
    expect(bookWorks(works).map(w => w.id)).toEqual(["um", "dois", "solo"]);
    expect(works[2]?.standalone).toBe(true);
  });
  it("navega anterior/próximo pelo índice de livro sem inventar metadados antigos", () => {
    const works = normalize([raw("z", "Zulu"), raw("m", "Meio"), raw("a", "Alfa")]);
    const navigation = readerNavigation(works, "m", "livro");
    expect(navigation.previous?.id).toBe("a");
    expect(navigation.next?.id).toBe("z");
    expect(navigation.position).toBe(1);
    expect(navigation.total).toBe(3);
    expect(works.map(w => w.id)).toEqual(["z", "m", "a"]);
    expect(works.every(w => w.series === undefined && w.standalone === undefined)).toBe(true);
  });
  it("preserva os vizinhos da leitura cronológica", () => {
    const works = normalize([raw("recente", "A"), raw("meio", "B"), raw("antigo", "C")]);
    expect(readerNavigation(works, "meio").previous?.id).toBe("antigo");
    expect(readerNavigation(works, "meio").next?.id).toBe("recente");
  });
  it("não volta ao início nos limites do livro nem navega de obra ausente", () => {
    const works = normalize([raw("z", "Zulu"), raw("a", "Alfa")]);
    expect(readerNavigation(works, "a", "livro").previous).toBeUndefined();
    expect(readerNavigation(works, "a", "livro").next?.id).toBe("z");
    expect(readerNavigation(works, "z", "livro").next).toBeUndefined();
    expect(readerNavigation(works, "z", "livro").previous?.id).toBe("a");
    expect(readerNavigation(works, "ausente", "livro").previous).toBeUndefined();
    expect(readerNavigation(works, "ausente", "livro").next).toBeUndefined();
  });
  it("rejeita estrutura inválida e IDs duplicados", () => {
    expect(() => parseEntries([{ id: "x" }])).toThrow();
    expect(() => parseEntries([raw("x", "A"), raw("x", "B")])).toThrow();
  });
  it("usa cópia fiel de segurança em erro remoto", async () => {
    const works = await loadWorks(async () => { throw new Error("offline"); });
    expect(works).toHaveLength(46);
    const chapterIds = editorial.editorial_reading_order.chapters.map((chapter) => chapter.entry_id);
    expect(chapterIds.every((id) => works.some((work) => work.id === id))).toBe(true);
    expect(works[0]?.id).toBe("2026-10-15-a-colher-que-me-venceu");
    expect(works.every(w => w.source === "fallback")).toBe(true);
  });
  it("não sobrepõe arquivo remoto válido com cópia local", async () => {
    const works = await loadWorks(async () => new Response(JSON.stringify([raw("novo", "Novo")])));
    expect(works.map(w => w.id)).toEqual(["novo"]);
    expect(works[0]?.source).toBe("github");
  });
  it("aceita apenas imagens próprias de origem permitida", () => {
    expect(ownedImage({ src: "https://third-party.test/photo.jpg", alt: "Foto", rights: "author-owned" })).toBeUndefined();
    expect(ownedImage({ src: "/obras/propria.jpg", alt: "Obra", rights: "author-owned" })?.src).toBe("/obras/propria.jpg");
  });
});