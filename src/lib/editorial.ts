import { queryOptions } from "@tanstack/react-query";
import fallbackIndex from "@/data/editorial-fallback.json";

export const EDITORIAL_URL =
  "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/editorial/indice-romance-mosaico.json";

export type ChronologyItem = {
  entry_id: string;
  title: string;
  time: string;
  label: string;
  precision?: string;
};
export type UnplacedItem = { entry_id: string; title: string; publication_label?: string };
export type EditorialIndex = {
  chapters: { number: number; entry_id: string; title: string }[];
  chronology: ChronologyItem[];
  unplaced: UnplacedItem[];
  source: "github" | "fallback";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = any;
const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/** Validates only the fields the site uses. Universe time comes solely from `time`. */
export function parseEditorial(
  input: unknown,
  source: EditorialIndex["source"] = "github",
): EditorialIndex {
  const d = input as R;
  const chapters = d?.editorial_reading_order?.chapters;
  if (
    !Array.isArray(chapters) ||
    !Array.isArray(d?.universe_chronology) ||
    !Array.isArray(d?.unplaced_archive)
  )
    throw new Error("Índice editorial inválido");
  for (const c of chapters)
    if (!str(c?.entry_id) || !Number.isFinite(c?.number)) throw new Error("Capítulo inválido");
  for (const c of d.universe_chronology)
    if (
      !str(c?.entry_id) ||
      !str(c?.label) ||
      typeof c?.time !== "string" ||
      !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(c.time)
    )
      throw new Error("Cronologia inválida");
  for (const u of d.unplaced_archive)
    if (!str(u?.entry_id)) throw new Error("Arquivo não posicionado inválido");
  return {
    chapters: chapters.map((c: R) => ({
      number: c.number,
      entry_id: c.entry_id,
      title: c.title ?? "",
    })),
    chronology: d.universe_chronology.map((c: R) => ({
      entry_id: c.entry_id,
      title: c.title ?? "",
      time: c.time,
      label: c.label,
      precision: c.precision,
    })),
    unplaced: d.unplaced_archive.map((u: R) => ({
      entry_id: u.entry_id,
      title: u.title ?? "",
      publication_label: u.publication_label,
    })),
    source,
  };
}

export async function loadEditorial(fetcher: typeof fetch = fetch): Promise<EditorialIndex> {
  // Use the synchronized editorial snapshot during static prerender; refresh remotely in the browser.
  if (import.meta.env.SSR) return parseEditorial(fallbackIndex, "fallback");
  try {
    const res = await fetcher(EDITORIAL_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Índice indisponível (${res.status})`);
    return parseEditorial(await res.json());
  } catch {
    return parseEditorial(fallbackIndex, "fallback");
  }
}

export const editorialQuery = queryOptions({
  queryKey: ["editorial-index"],
  queryFn: () => loadEditorial(),
  staleTime: 5 * 60_000,
});

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export type EraEntry = { id: string; title: string; label: string; time?: string; precision?: string };
export type Era = {
  key: string;
  label: string;
  months: { key: string; label: string; entries: EraEntry[] }[];
};
export const OUTSIDE = "fora";

/** Groups by universe year/month in index order; IDs absent from entries.json are skipped and reported. */
export function buildEras(index: EditorialIndex, knownIds: Set<string>) {
  const missing: string[] = [];
  const eras: Era[] = [];
  for (const c of index.chronology) {
    if (!knownIds.has(c.entry_id)) {
      missing.push(c.entry_id);
      continue;
    }
    const [year, month] = c.time.split("-");
    let era = eras.find((e) => e.key === year);
    if (!era) eras.push((era = { key: year!, label: year!, months: [] }));
    const mKey = month ?? "—";
    let m = era.months.find((x) => x.key === mKey);
    if (!m)
      era.months.push(
        (m = {
          key: mKey,
          label: month ? `${MONTHS[Number(month) - 1]} de ${year}` : `${year} · mês não indicado`,
          entries: [],
        }),
      );
    m.entries.push({ id: c.entry_id, title: c.title, label: c.label, time: c.time, ...(c.precision ? { precision: c.precision } : {}) });
  }
  const outside: EraEntry[] = [];
  for (const u of index.unplaced) {
    if (!knownIds.has(u.entry_id)) {
      missing.push(u.entry_id);
      continue;
    }
    outside.push({
      id: u.entry_id,
      title: u.title,
      label: u.publication_label ?? "Sem posição na cronologia",
    });
  }
  if (outside.length)
    eras.push({
      key: OUTSIDE,
      label: "Fora da cronologia",
      months: [{ key: OUTSIDE, label: "Arquivo não posicionado", entries: outside }],
    });
  return { eras, missing };
}