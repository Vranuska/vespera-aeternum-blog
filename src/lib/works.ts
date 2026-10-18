import { queryOptions } from "@tanstack/react-query";
import { WORK_META } from "@/data/catalog";
import { CHARACTERS } from "@/data/characters";

export const ENTRIES_URL =
  "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/HEAD/entries.json";

type RawEntry = { id: string; date: string; title: string; place?: string; paragraphs: string[] };

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
  characters: string[]; // slugs do Bestiário
  classified: boolean; // false = obra nova, ainda não catalogada
  dated: boolean;
  excerpt: string;
  words: number;
};

export function normalize(raw: RawEntry[]): Work[] {
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
      genres: meta?.genres ?? ["a classificar"],
      collection: meta?.collection ?? "Não catalogada",
      themes: meta?.themes ?? [],
      characters: meta?.characters ?? CHARACTERS.filter((c) => c.pattern.test(text)).map((c) => c.slug),
      classified: !!meta,
      dated: /\d{4}/.test(e.date),
      excerpt: e.paragraphs.find((p) => p.length > 60) ?? e.paragraphs[0] ?? "",
      words: text.split(/\s+/).filter(Boolean).length,
    };
  });
}

export const worksQuery = queryOptions({
  queryKey: ["works"],
  queryFn: async (): Promise<Work[]> => {
    const res = await fetch(ENTRIES_URL);
    if (!res.ok) throw new Error(`Arquivo indisponível (${res.status})`);
    return normalize((await res.json()) as RawEntry[]);
  },
  staleTime: 5 * 60_000,
});

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

export function readingMinutes(w: Work) {
  return Math.max(1, Math.round(w.words / 220));
}
