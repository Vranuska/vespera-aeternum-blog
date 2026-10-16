import { queryOptions } from "@tanstack/react-query";

export const ENTRIES_URL =
  "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/HEAD/entries.json";

type RawEntry = { id: string; date: string; title: string; place?: string; paragraphs: string[] };

export type WorkType = "diário" | "conto" | "fragmento" | "carta" | "episódio mitológico";

export type Work = {
  id: string;
  order: number; // posição no arquivo original (0 = mais recente)
  title: string;
  date: string;
  place?: string | undefined;
  paragraphs: string[];
  type: WorkType; // provisório — inferido
  characters: string[]; // provisório — inferido
  excerpt: string;
  words: number;
};

export const WORK_TYPES: WorkType[] = ["diário", "conto", "fragmento", "carta", "episódio mitológico"];

/** Personagens detectados por menção nos textos originais (provisório até a Etapa 2). */
export const CHARACTER_MATCHERS: { name: string; pattern: RegExp }[] = [
  { name: "Padre Tomás", pattern: /padre tom[aá]s/i },
  { name: "Ithariel", pattern: /ithariel/i },
  { name: "Azrakhel", pattern: /azrakhel/i },
  { name: "Eithne", pattern: /eithne/i },
  { name: "Helena", pattern: /\bhelena\b/i },
  { name: "O irmão", pattern: /\bmeu irm[aã]o\b/i },
  { name: "A menina do sapato vermelho", pattern: /sapato vermelho/i },
  { name: "O reflexo", pattern: /\bespelho\b|\breflexo\b/i },
  { name: "O anjo", pattern: /\barcanjo\b|\banjo\b/i },
];

function inferType(e: RawEntry): WorkType {
  const s = `${e.id} ${e.title}`.toLowerCase();
  if (s.includes("carta")) return "carta";
  if (s.includes("expulsa do céu") || s.includes("expulsa-do-ceu")) return "episódio mitológico";
  if (/^\d{4}-\d{2}-\d{2}/.test(e.id) || /\d{2}h\d{2}/.test(e.date)) return "diário";
  if (e.paragraphs.length <= 30) return "fragmento";
  return "conto";
}

export function normalize(raw: RawEntry[]): Work[] {
  return raw.map((e, i) => {
    const text = e.paragraphs.join(" ");
    return {
      id: e.id,
      order: i,
      title: e.title,
      date: e.date,
      place: e.place,
      paragraphs: e.paragraphs,
      type: inferType(e),
      characters: CHARACTER_MATCHERS.filter((c) => c.pattern.test(text) || c.pattern.test(e.title)).map((c) => c.name),
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

export type LibraryFilters = { q?: string | undefined; tipo?: string | undefined; personagem?: string | undefined; ordem?: "recente" | "antiga" | "titulo" | undefined };

export function filterWorks(works: Work[], f: LibraryFilters): Work[] {
  const q = f.q?.trim().toLowerCase();
  let out = works.filter((w) => {
    if (f.tipo && w.type !== f.tipo) return false;
    if (f.personagem && !w.characters.includes(f.personagem)) return false;
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
