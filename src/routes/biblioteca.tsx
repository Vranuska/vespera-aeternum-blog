import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LayoutGrid, List } from "lucide-react";
import { worksQuery, filterWorks, WORK_TYPES, CHARACTER_MATCHERS, type LibraryFilters } from "@/lib/works";
import { WorkCard, WorkRow } from "@/components/vespera/WorkCard";
import { Ornament } from "@/components/vespera/Ornament";

type Search = { q?: string | undefined; tipo?: string | undefined; personagem?: string | undefined; ordem?: LibraryFilters["ordem"] | undefined; modo?: "lista" | undefined };

export const Route = createFileRoute("/biblioteca")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    tipo: typeof s["tipo"] === "string" && s["tipo"] ? s["tipo"] : undefined,
    personagem: typeof s["personagem"] === "string" && s["personagem"] ? s["personagem"] : undefined,
    ordem: s["ordem"] === "antiga" || s["ordem"] === "titulo" ? s["ordem"] : undefined,
    modo: s["modo"] === "lista" ? "lista" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Bibliotheca Noctis — Vespera Aeternum" },
      { name: "description", content: "Arquivo pesquisável de todas as obras de Vespera: diários, contos, cartas, fragmentos e episódios mitológicos." },
      { property: "og:title", content: "Bibliotheca Noctis — Vespera Aeternum" },
      { property: "og:description", content: "Pesquise o arquivo completo de manuscritos de Vespera." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Library,
});

const selectCls = "w-full border border-input bg-background px-3 py-2.5 font-serif text-parchment focus:border-gold";

function Library() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/biblioteca" });
  const set = (patch: Partial<Search>) => navigate({ search: (s) => ({ ...s, ...patch }), replace: true });
  const results = filterWorks(works, search);
  const active = !!(search.q || search.tipo || search.personagem || search.ordem);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-archive text-gold">Arquivo · {works.length} manuscritos</p>
      <h1 className="mt-3 font-display text-6xl font-light text-parchment md:text-8xl">Bibliotheca <em className="text-rose">Noctis</em></h1>
      <Ornament className="mt-10 justify-start" />

      <div className="mt-10 grid gap-4 border border-border bg-plum/60 p-5 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="block">
          <span className="label-archive text-sage">Título ou palavra</span>
          <input
            defaultValue={search.q ?? ""}
            onChange={(e) => set({ q: e.target.value || undefined })}
            placeholder="colher, céu, espelho…"
            className={`${selectCls} mt-2 placeholder:text-sage`}
          />
        </label>
        <label className="block">
          <span className="label-archive text-sage">Tipo</span>
          <select value={search.tipo ?? ""} onChange={(e) => set({ tipo: e.target.value || undefined })} className={`${selectCls} mt-2`}>
            <option value="">Todos</option>
            {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label-archive text-sage">Personagem</span>
          <select value={search.personagem ?? ""} onChange={(e) => set({ personagem: e.target.value || undefined })} className={`${selectCls} mt-2`}>
            <option value="">Todos</option>
            {CHARACTER_MATCHERS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="label-archive text-rose" aria-live="polite">
          {results.length} {results.length === 1 ? "obra encontrada" : "obras encontradas"}
          {active && (
            <button onClick={() => navigate({ search: { modo: search.modo }, replace: true })} className="ml-4 text-gold underline underline-offset-4">
              Limpar filtros
            </button>
          )}
        </p>
        <div className="flex border border-border" role="group" aria-label="Modo de exibição">
          <button onClick={() => set({ modo: undefined })} aria-pressed={search.modo !== "lista"} className={`p-2.5 ${search.modo !== "lista" ? "bg-wine text-parchment" : "text-sage"}`} aria-label="Galeria"><LayoutGrid size={16} /></button>
          <button onClick={() => set({ modo: "lista" })} aria-pressed={search.modo === "lista"} className={`p-2.5 ${search.modo === "lista" ? "bg-wine text-parchment" : "text-sage"}`} aria-label="Lista"><List size={16} /></button>
        </div>
      </div>

      <p className="mt-3 text-sm italic text-sage">Tipos e personagens são provisórios, deduzidos dos próprios textos — serão revistos na próxima etapa.</p>

      {results.length === 0 ? (
        <p className="py-24 text-center font-display text-3xl italic text-rose">Nenhum manuscrito responde a este chamado.</p>
      ) : search.modo === "lista" ? (
        <div className="mt-8">{results.map((w) => <WorkRow key={w.id} work={w} />)}</div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((w) => <WorkCard key={w.id} work={w} />)}
        </div>
      )}
    </div>
  );
}
