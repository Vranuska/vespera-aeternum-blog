import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LayoutGrid, List } from "lucide-react";
import { worksQuery, filterWorks, type LibraryFilters } from "@/lib/works";
import { GENRES, COLLECTIONS, THEMES } from "@/data/catalog";
import { CHARACTERS } from "@/data/characters";
import { WorkCard, WorkRow } from "@/components/vespera/WorkCard";
import { Ornament } from "@/components/vespera/Ornament";

type Search = LibraryFilters & { modo?: "lista" | undefined };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const arr = (v: unknown) => { const a = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : typeof v === "string" && v ? [v] : []; return a.length ? a : undefined; };

export const Route = createFileRoute("/biblioteca")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: str(s["q"]),
    generos: arr(s["generos"]),
    personagens: arr(s["personagens"]),
    lugares: arr(s["lugares"]),
    temas: arr(s["temas"]),
    colecao: str(s["colecao"]),
    data: s["data"] === "datadas" || s["data"] === "sem-data" ? s["data"] : undefined,
    ordem: s["ordem"] === "antiga" || s["ordem"] === "titulo" ? s["ordem"] : undefined,
    modo: s["modo"] === "lista" ? "lista" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Bibliotheca Noctis — Vespera Aeternum" },
      { name: "description", content: "Arquivo pesquisável das obras de Vespera, com filtros por gênero, personagem, lugar, tema e coleção." },
      { property: "og:title", content: "Bibliotheca Noctis — Vespera Aeternum" },
      { property: "og:description", content: "Pesquise o arquivo completo de manuscritos de Vespera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Library,
});

const selectCls = "w-full border border-input bg-background px-3 py-2.5 font-serif text-parchment focus:border-gold";

function Chips({ label, options, value, onChange }: { label: string; options: { v: string; l: string }[]; value?: string[] | undefined; onChange: (v: string[] | undefined) => void }) {
  const sel = value ?? [];
  const toggle = (v: string) => { const n = sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]; onChange(n.length ? n : undefined); };
  return (
    <fieldset>
      <legend className="label-archive text-sage">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.v} type="button" aria-pressed={sel.includes(o.v)} onClick={() => toggle(o.v)}
            className={`border px-2.5 py-1 text-sm transition-colors ${sel.includes(o.v) ? "border-gold bg-wine text-parchment" : "border-border text-rose hover:text-parchment"}`}>
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Library() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/biblioteca" });
  const set = (patch: Partial<Search>) => navigate({ search: (s) => ({ ...s, ...patch }), replace: true });
  const results = filterWorks(works, search);
  const { modo, ...f } = search;
  const active = Object.values(f).some(Boolean);
  const places = [...new Set(works.map((w) => w.place).filter((p): p is string => !!p))].sort((a, b) => a.localeCompare(b, "pt"));
  const usedChars = CHARACTERS.filter((c) => works.some((w) => w.characters.includes(c.slug)));

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-archive text-gold">Arquivo · {works.length} manuscritos</p>
      <h1 className="mt-3 font-display text-6xl font-light text-parchment md:text-8xl">Bibliotheca <em className="text-rose">Noctis</em></h1>
      <Ornament className="mt-10 justify-start" />

      <div className="mt-10 space-y-6 border border-border bg-plum/60 p-5">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <label className="block">
            <span className="label-archive text-sage">Título ou palavra</span>
            <input defaultValue={search.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="colher, céu, espelho…" className={`${selectCls} mt-2 placeholder:text-sage`} />
          </label>
          <label className="block">
            <span className="label-archive text-sage">Coleção</span>
            <select value={search.colecao ?? ""} onChange={(e) => set({ colecao: e.target.value || undefined })} className={`${selectCls} mt-2`}>
              <option value="">Todas</option>
              {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="label-archive text-sage">Data</span>
            <select value={search.data ?? ""} onChange={(e) => set({ data: (e.target.value || undefined) as Search["data"] })} className={`${selectCls} mt-2`}>
              <option value="">Todas</option>
              <option value="datadas">Datadas</option>
              <option value="sem-data">Sem data</option>
            </select>
          </label>
          <label className="block">
            <span className="label-archive text-sage">Ordem</span>
            <select value={search.ordem ?? ""} onChange={(e) => set({ ordem: (e.target.value || undefined) as Search["ordem"] })} className={`${selectCls} mt-2`}>
              <option value="">Mais recentes</option>
              <option value="antiga">Mais antigas</option>
              <option value="titulo">Por título</option>
            </select>
          </label>
        </div>
        <Chips label="Gêneros (vários)" options={GENRES.map((g) => ({ v: g, l: g }))} value={search.generos} onChange={(generos) => set({ generos })} />
        <Chips label="Personagens" options={usedChars.map((c) => ({ v: c.slug, l: c.name }))} value={search.personagens} onChange={(personagens) => set({ personagens })} />
        <Chips label="Temas" options={THEMES.map((t) => ({ v: t, l: t }))} value={search.temas} onChange={(temas) => set({ temas })} />
        <details>
          <summary className="label-archive cursor-pointer text-sage">Lugares ({places.length})</summary>
          <div className="mt-3"><Chips label="" options={places.map((p) => ({ v: p, l: p }))} value={search.lugares} onChange={(lugares) => set({ lugares })} /></div>
        </details>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="label-archive text-rose" aria-live="polite">
          {results.length} {results.length === 1 ? "obra encontrada" : "obras encontradas"}
          {active && <button onClick={() => navigate({ search: { modo }, replace: true })} className="ml-4 text-gold underline underline-offset-4">Limpar filtros</button>}
        </p>
        <div className="flex border border-border" role="group" aria-label="Modo de exibição">
          <button onClick={() => set({ modo: undefined })} aria-pressed={modo !== "lista"} className={`p-2.5 ${modo !== "lista" ? "bg-wine text-parchment" : "text-sage"}`} aria-label="Galeria"><LayoutGrid size={16} /></button>
          <button onClick={() => set({ modo: "lista" })} aria-pressed={modo === "lista"} className={`p-2.5 ${modo === "lista" ? "bg-wine text-parchment" : "text-sage"}`} aria-label="Lista"><List size={16} /></button>
        </div>
      </div>
      <p className="mt-3 text-sm italic text-sage">Gêneros são sugestões feitas a partir da leitura integral; uma obra pode ter vários. Revisão manual chegará com o painel administrativo.</p>

      {results.length === 0 ? (
        <p className="py-24 text-center font-display text-3xl italic text-rose">Nenhum manuscrito responde a este chamado.</p>
      ) : modo === "lista" ? (
        <div className="mt-8">{results.map((w) => <WorkRow key={w.id} work={w} />)}</div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{results.map((w) => <WorkCard key={w.id} work={w} />)}</div>
      )}
    </div>
  );
}
