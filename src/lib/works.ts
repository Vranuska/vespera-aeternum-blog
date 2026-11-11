import { queryOptions } from "@tanstack/react-query";
import { WORK_META } from "@/data/catalog";
import { CHARACTERS } from "@/data/characters";
import fallbackEntries from "@/data/entries-fallback.json";
import { EDITORIAL_ORDER } from "@/data/reading-order";

export const ENTRIES_URL =
  "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/HEAD/entries.json";

export type RawEntry = {
  id: string; date: string; title: string; place?: string; paragraphs: string[];
  genres?: string[]; collection?: string; themes?: string[]; characters?: string[]; related_entries?: string[];
  series?: { id: string; title: string; position?: number };
  standalone?: boolean; author?: string;
  image?: { src: string; alt: string; rights: "author-owned" };
};

export function parseEntries(input: unknown): RawEntry[] {
  if (!Array.isArray(input) || !input.length) throw new Error("Arquivo vazio ou inválido");
  const ids = new Set<string>();
  for (const item of input) {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id.trim() ||
      typeof item.title !== "string" || !item.title.trim() || typeof item.date !== "string" ||
      !Array.isArray(item.paragraphs) || !item.paragraphs.length || !item.paragraphs.every((p: unknown) => typeof p === "string") ||
      (item.place !== undefined && typeof item.place !== "string") || ids.has(item.id)) throw new Error("Estrutura inválida do arquivo");
    ids.add(item.id);
    for (const key of ["genres", "themes", "characters"]) {
      if (item[key] !== undefined && (!Array.isArray(item[key]) || !item[key].every((v: unknown) => typeof v === "string"))) throw new Error("Metadados inválidos");
    }
    if (item.related_entries !== undefined && (!Array.isArray(item.related_entries) || !item.related_entries.every((v: unknown) => typeof v === "string" && v.trim()))) throw new Error("Referências relacionadas inválidas");
    for (const key of ["author", "collection"]) if (item[key] !== undefined && typeof item[key] !== "string") throw new Error("Metadados inválidos");
    if (item.standalone !== undefined && typeof item.standalone !== "boolean") throw new Error("Metadados inválidos");
    if (item.series !== undefined && (!item.series || typeof item.series.id !== "string" || typeof item.series.title !== "string" || (item.series.position !== undefined && (!Number.isFinite(item.series.position) || item.series.position < 0)))) throw new Error("Série inválida");
    if (item.image !== undefined && (!item.image || typeof item.image.src !== "string" || typeof item.image.alt !== "string" || item.image.rights !== "author-owned")) throw new Error("Imagem sem autoria declarada");
  }
  for (const item of input) {
    if (item.related_entries?.some((id: string) => !ids.has(id))) throw new Error("Referência relacionada ausente");
  }
  return input as RawEntry[];
}

export function ownedImage(image: RawEntry["image"]): RawEntry["image"] {
  if (!image || image.rights !== "author-owned" || !image.alt.trim()) return undefined;
  // Bundled/local assets, or the author's own archive. No arbitrary third-party URLs.
  if (/^\/(?!\/)/.test(image.src) || /^https:\/\/raw\.githubusercontent\.com\/Vranuska\/vespera-aeternum\//.test(image.src)) return image;
  return undefined;
}

export type Work = {
  id: string;
  order: number; // posição no arquivo original (0 = mais recente)
  title: string;
  date: string;
  place?: string | undefined;
  paragraphs: string[];
  genres: string[]; // sugestão editorial (catálogo)
  collection: string;
  themes: string[];
  characters: string[]; // slugs do Bestiário ou nomes declarados no manuscrito
  relatedEntries: string[]; // referências explícitas a outros manuscritos
  classified: boolean; // false = obra nova, ainda não catalogada
  dated: boolean;
  excerpt: string;
  words: number;
  source: "github" | "fallback";
  series?: RawEntry["series"];
  standalone?: boolean | undefined;
  author?: string | undefined;
  image?: RawEntry["image"];
};

export function normalize(raw: RawEntry[], source: Work["source"] = "github"): Work[] {
  return raw.map((e, i) => {
    const text = e.paragraphs.join(" ");
    const meta = WORK_META[e.id];
    return {
      id: e.id,
      order: i,
      title: e.title,
      date: e.date,
      place: e.place,
      paragraphs: e.paragraphs,
      genres: e.genres ?? meta?.genres ?? ["a classificar"],
      collection: e.collection ?? meta?.collection ?? "Não catalogada",
      themes: e.themes ?? meta?.themes ?? [],
      characters: e.characters ?? meta?.characters ?? CHARACTERS.filter((c) => c.pattern.test(text)).map((c) => c.slug),
      relatedEntries: e.related_entries ?? [],
      classified: !!meta || e.genres !== undefined,
      source,
      series: e.series ?? meta?.series,
      standalone: e.standalone ?? meta?.standalone,
      author: e.author ?? meta?.author,
      image: ownedImage(e.image ?? meta?.image),
      dated: /\d{4}/.test(e.date),
      excerpt: e.paragraphs.find((p) => p.length > 60) ?? e.paragraphs[0] ?? "",
      words: text.split(/\s+/).filter(Boolean).length,
    };
  });
}

export async function loadWorks(fetcher: typeof fetch = fetch): Promise<Work[]> {
  try {
    const res = await fetcher(ENTRIES_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Arquivo indisponível (${res.status})`);
    return normalize(parseEntries(await res.json()));
  } catch {
    return normalize(parseEntries(fallbackEntries), "fallback");
  }
}

/** Approved order first; otherwise a neutral title index, never fabricated chapters. */
export function bookWorks(works: Work[], approved: readonly string[] = EDITORIAL_ORDER): Work[] {
  const rank = new Map(approved.map((id, i) => [id, i]));
  return [...works].sort((a, b) => {
    const ar = rank.get(a.id), br = rank.get(b.id);
    if (ar !== undefined || br !== undefined) return (ar ?? Infinity) - (br ?? Infinity);
    const group = (a.series?.title ?? a.title).localeCompare(b.series?.title ?? b.title, "pt-BR");
    if (group) return group;
    if (a.series && b.series && a.series.id === b.series.id) {
      const delta = (a.series.position ?? Infinity) - (b.series.position ?? Infinity);
      if (delta && !Number.isNaN(delta)) return delta;
    }
    return a.title.localeCompare(b.title, "pt-BR") || a.id.localeCompare(b.id);
  });
}

export const worksQuery = queryOptions({
  queryKey: ["works"],
  queryFn: () => loadWorks(),
  staleTime: 5 * 60_000,
});

/** Reader positions are navigation state, never chapter or manuscript metadata. */
export function readerNavigation(works: Work[], id: string, mode?: "livro") {
  const sequence = mode === "livro" ? bookWorks(works) : works;
  const position = sequence.findIndex((work) => work.id === id);
  return {
    position,
    total: sequence.length,
    previous: position < 0 ? undefined : sequence[position + (mode === "livro" ? -1 : 1)],
    next: position < 0 ? undefined : sequence[position + (mode === "livro" ? 1 : -1)],
  };
}

export type LibraryFilters = {
  q?: string | undefined;
  generos?: string[] | undefined;
  personagens?: string[] | undefined;
  lugares?: string[] | undefined;
  temas?: string[] | undefined;
  colecao?: string | undefined;
  data?: "datadas" | "sem-data" | undefined;
  ordem?: "recente" | "antiga" | "titulo" | undefined;
};

/** Dentro de cada faceta: qualquer um dos valores. Entre facetas: todas. */
export function filterWorks(works: Work[], f: LibraryFilters): Work[] {
  const q = f.q?.trim().toLowerCase();
  const any = (sel: string[] | undefined, vals: string[]) => !sel?.length || sel.some((s) => vals.includes(s));
  let out = works.filter((w) => {
    if (!any(f.generos, w.genres)) return false;
    if (!any(f.personagens, w.characters)) return false;
    if (!any(f.lugares, w.place ? [w.place] : [])) return false;
    if (!any(f.temas, w.themes)) return false;
    if (f.colecao && w.collection !== f.colecao) return false;
    if (f.data === "datadas" && !w.dated) return false;
    if (f.data === "sem-data" && w.dated) return false;
    if (q && !`${w.title} ${w.place ?? ""} ${w.paragraphs.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (f.ordem === "antiga") out = [...out].sort((a, b) => b.order - a.order);
  else if (f.ordem === "titulo") out = [...out].sort((a, b) => a.title.localeCompare(b.title, "pt"));
  return out;
}

/** Explicit editorial links take precedence; reverse links are honored as well. */
export function relatedWorks(works: Work[], id: string, limit = 3): Work[] {
  const current = works.find((work) => work.id === id);
  if (!current) return [];
  const explicit = (candidate: Work) =>
    current.relatedEntries.includes(candidate.id) || candidate.relatedEntries.includes(current.id);
  return works
    .filter((candidate) =>
      candidate.id !== id &&
      (explicit(candidate) || candidate.characters.some((c) => c !== "vespera" && current.characters.includes(c))),
    )
    .sort((a, b) => Number(explicit(b)) - Number(explicit(a)))
    .slice(0, limit);
}

export function readingMinutes(w: Work) {
  return Math.max(1, Math.round(w.words / 220));
}