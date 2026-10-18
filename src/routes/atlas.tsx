import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { worksQuery } from "@/lib/works";
import { MAPS, ROOT_MAP, type Place } from "@/data/atlas";
import { characterBySlug } from "@/data/characters";
import { AtlasCanvas, PlaceGlyph } from "@/components/vespera/AtlasCanvas";

type Search = { mapa?: string | undefined; local?: string | undefined };

export const Route = createFileRoute("/atlas")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mapa: typeof s["mapa"] === "string" && s["mapa"] ? s["mapa"] : undefined,
    local: typeof s["local"] === "string" && s["local"] ? s["local"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Atlas do Impossível — Vespera Aeternum" },
      { name: "description", content: "Mapa interativo da cosmologia de Vespera: o Entre, os Firmamentos, os domínios infernais e o mundo dos mortais." },
      { property: "og:title", content: "Atlas do Impossível — Vespera Aeternum" },
      { property: "og:description", content: "Explore os planos e lugares por onde Vespera atravessa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Atlas,
});

/** Trilha: caminho do mapa raiz até o mapa atual. */
function trail(mapId: string): string[] {
  const parentOf = (id: string) => Object.values(MAPS).find((m) => m.places.some((p) => p.map === id))?.id;
  const out = [mapId];
  let cur = parentOf(mapId);
  while (cur) { out.unshift(cur); cur = parentOf(cur); }
  return out;
}

function Atlas() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/atlas" });
  const mapId = search.mapa && MAPS[search.mapa] ? search.mapa : ROOT_MAP;
  const map = MAPS[mapId]!;
  const crumbs = trail(mapId);
  const place = map.places.find((p) => p.id === search.local);
  const go = (s: Search) => navigate({ search: s });
  const title = (id: string) => works.find((w) => w.id === id)?.title;
  const near = place ? map.links.filter((l) => l.from === place.id || l.to === place.id).map((l) => map.places.find((p) => p.id === (l.from === place.id ? l.to : l.from))!).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <p className="label-archive text-gold">Cartografia ficcional · protótipo</p>
      <h1 className="mt-3 font-display text-5xl font-light text-parchment md:text-7xl">Atlas do <em className="text-rose">Impossível</em></h1>

      <nav aria-label="Trilha de localização" className="mt-8 flex flex-wrap items-center gap-2 label-archive">
        {crumbs.length > 1 && (
          <button onClick={() => go({ mapa: crumbs[crumbs.length - 2] === ROOT_MAP ? undefined : crumbs[crumbs.length - 2] })} className="mr-3 border border-gold/50 px-3 py-1.5 text-parchment hover:bg-wine">← Voltar</button>
        )}
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            {i > 0 && <span className="text-sage">›</span>}
            {i === crumbs.length - 1 ? <span className="text-parchment">{MAPS[c]!.title}</span> : (
              <button onClick={() => go({ mapa: c === ROOT_MAP ? undefined : c })} className="text-gold hover:underline">{MAPS[c]!.title}</button>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div>
          <AtlasCanvas map={map} selected={place?.id} onSelect={(p) => go({ mapa: search.mapa, local: p.id })} />
          <p className="mt-3 text-sm italic text-sage">
            {map.subtitle}. Posições ilustrativas — os manuscritos não descrevem a geografia. Contornos tracejados indicam lugares ou conexões provisórios.
          </p>
        </div>

        <aside aria-live="polite" className="border border-gold/40 bg-plum/70 p-6 lg:max-h-[80vh] lg:overflow-y-auto">
          {!place ? (
            <div>
              <p className="label-archive text-gold">{map.title}</p>
              <p className="mt-4 text-lg italic leading-relaxed text-parchment/85">Escolha um marcador para abrir sua ficha. Lugares marcados como explorável levam a um mapa mais detalhado.</p>
              <ul className="mt-6 space-y-2">
                {map.places.map((p) => (
                  <li key={p.id}><button onClick={() => go({ mapa: search.mapa, local: p.id })} className="text-left font-display text-xl text-parchment hover:text-rose">{p.name}</button></li>
                ))}
              </ul>
            </div>
          ) : (
            <PlacePanel place={place} near={near} title={title} onClose={() => go({ mapa: search.mapa })} onEnter={() => go({ mapa: place.map })} onPick={(p) => go({ mapa: search.mapa, local: p.id })} />
          )}
        </aside>
      </div>
      <p className="mt-10 label-archive text-sage">Editor de mundos, regiões e marcadores: previsto para a Etapa 3, com o painel administrativo.</p>
    </div>
  );
}

function PlacePanel({ place, near, title, onClose, onEnter, onPick }: { place: Place; near: Place[]; title: (id: string) => string | undefined; onClose: () => void; onEnter: () => void; onPick: (p: Place) => void }) {
  return (
    <div className="animate-rise">
      <div className="flex items-start justify-between">
        <p className="label-archive text-gold">{place.kind} · <span className={place.status === "provisório" ? "text-sage" : "text-rose"}>{place.status}</span></p>
        <button onClick={onClose} aria-label="Fechar painel" className="text-sage hover:text-parchment"><X size={18} /></button>
      </div>
      <h2 className="mt-3 font-display text-4xl leading-tight text-parchment">{place.name}</h2>
      <div className="mt-5 flex justify-center border border-gold/30 bg-background/60 py-8 text-gold" aria-hidden="true">
        <svg viewBox="-40 -40 80 80" width={120} height={120}><circle r={36} fill="none" stroke="currentColor" strokeOpacity={0.4} /><circle r={30} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeDasharray="2 4" /><PlaceGlyph kind={place.kind} size={36} /></svg>
      </div>
      <p className="mt-5 text-[1.05rem] leading-relaxed text-parchment/90">{place.description}</p>
      {place.map && <button onClick={onEnter} className="label-archive mt-5 w-full border border-gold bg-wine px-4 py-3 text-parchment hover:bg-blood">Explorar esta região →</button>}
      {place.history?.length ? <Section t="História">{place.history.map((h) => <p key={h}>{h}</p>)}</Section> : null}
      {place.characters?.length ? (
        <Section t="Personagens">
          <div className="flex flex-wrap gap-2">{place.characters.map((s) => { const c = characterBySlug(s); return c ? <Link key={s} to="/bestiario/$slug" params={{ slug: s }} className="label-archive border border-border px-2 py-1 text-rose hover:text-parchment">{c.name}</Link> : null; })}</div>
        </Section>
      ) : null}
      {place.works?.length ? (
        <Section t="Obras">
          <ul className="space-y-1">{place.works.map((id) => title(id) && <li key={id}><Link to="/diarios/$id" params={{ id }} className="italic text-parchment hover:text-rose">{title(id)}</Link></li>)}</ul>
        </Section>
      ) : null}
      {near.length ? <Section t="Conexões"><div className="flex flex-wrap gap-2">{near.map((p) => <button key={p.id} onClick={() => onPick(p)} className="label-archive border border-border px-2 py-1 text-gold">{p.name}</button>)}</div></Section> : null}
      {place.secrets?.length ? <Section t="Segredos e rumores">{place.secrets.map((s) => <p key={s} className="italic text-rose">{s}</p>)}</Section> : null}
    </div>
  );
}

function Section({ t, children }: { t: string; children: React.ReactNode }) {
  return <div className="mt-6 border-t border-border pt-4"><p className="label-archive mb-3 text-sage">{t}</p><div className="space-y-2 text-parchment/85">{children}</div></div>;
}
