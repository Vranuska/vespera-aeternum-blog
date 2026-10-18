import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery } from "@/lib/works";
import { characterBySlug } from "@/data/characters";
import { Ornament } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/bestiario/$slug")({
  loader: async ({ context, params }) => {
    const c = characterBySlug(params.slug);
    if (!c) throw notFound();
    await context.queryClient.ensureQueryData(worksQuery);
    return { name: c.name, epithet: c.epithet, intro: c.presentation[0] ?? "" };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — O Bestiário · Vespera Aeternum` },
          { name: "description", content: loaderData.intro.slice(0, 155) },
          { property: "og:title", content: `${loaderData.name}, ${loaderData.epithet}` },
          { property: "og:description", content: loaderData.intro.slice(0, 155) },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Ficha indisponível — Vespera Aeternum" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-40 text-center">
      <p className="font-display text-4xl italic text-rose">Nenhuma ficha com este nome.</p>
      <Link to="/bestiario" className="label-archive mt-8 inline-block text-gold">Voltar ao Bestiário</Link>
    </div>
  ),
  errorComponent: ({ error }) => <p role="alert" className="py-40 text-center text-rose">{error instanceof Error ? error.message : String(error)}</p>,
  component: Sheet,
});

function Sheet() {
  const { slug } = Route.useParams();
  const c = characterBySlug(slug)!;
  const { data: works } = useSuspenseQuery(worksQuery);
  const title = (id: string) => works.find((w) => w.id === id)?.title ?? id;
  const appears = works.filter((w) => w.characters.includes(c.slug));
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="label-archive mb-4 mt-12 text-gold">{children}</h2>;

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link to="/bestiario" className="label-archive text-sage hover:text-gold">← O Bestiário</Link>
      <header className="mt-10 text-center">
        <p className="label-archive text-gold">{c.nature}</p>
        <h1 className="mt-4 font-display text-6xl font-light text-parchment md:text-7xl">{c.name}</h1>
        <p className="mt-3 text-xl italic text-rose">{c.epithet}</p>
        {c.aliases && <p className="label-archive mt-3 text-sage">Também: {c.aliases.join(" · ")}</p>}
        <Ornament className="mt-8" />
      </header>

      <section className="mt-10 space-y-5 text-[1.15rem] leading-[1.8] text-parchment/90">
        {c.presentation.map((p, i) => <p key={i} className={i === 0 ? "dropcap flow-root" : ""}>{p}</p>)}
      </section>

      {c.quotes.length > 0 && (
        <section>
          <H>Citações dos manuscritos</H>
          {c.quotes.map((q) => (
            <blockquote key={q.text} className="mb-6 border-l border-blood pl-5">
              <p className="font-display text-2xl italic leading-snug text-parchment">{q.text}</p>
              <Link to="/diarios/$id" params={{ id: q.work }} className="label-archive mt-2 inline-block text-sage hover:text-gold">— {title(q.work)}</Link>
            </blockquote>
          ))}
        </section>
      )}

      <H>Confirmado nos textos</H>
      <ul className="space-y-3">
        {c.confirmed.map((f) => (
          <li key={f.text} className="text-parchment/90">✧ {f.text} <Link to="/diarios/$id" params={{ id: f.work }} className="italic text-rose hover:text-parchment">({title(f.work)})</Link></li>
        ))}
      </ul>

      {c.traits.length > 0 && (<><H>Características demonstradas</H><div className="flex flex-wrap gap-2">{c.traits.map((t) => <span key={t} className="label-archive border border-border px-2 py-1 text-rose">{t}</span>)}</div></>)}

      {c.relations.length > 0 && (
        <>
          <H>Relações conhecidas</H>
          <ul className="space-y-2">
            {c.relations.map((r) => (
              <li key={r.name}>
                {r.slug ? <Link to="/bestiario/$slug" params={{ slug: r.slug }} className="font-display text-xl text-parchment hover:text-rose">{r.name}</Link> : <span className="font-display text-xl text-parchment">{r.name}</span>}
                <span className="text-parchment/75"> — {r.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {c.interpretations.length > 0 && (<><H>Interpretação literária</H>{c.interpretations.map((t) => <p key={t} className="mb-3 italic text-parchment/80">{t}</p>)}</>)}
      {c.mysteries.length > 0 && (<><H>Mistérios não revelados</H>{c.mysteries.map((t) => <p key={t} className="mb-3 text-rose">? {t}</p>)}</>)}

      <H>Aparece em</H>
      <ul className="space-y-1">
        {appears.map((w) => <li key={w.id}><Link to="/diarios/$id" params={{ id: w.id }} className="italic text-parchment hover:text-rose">{w.title}</Link>{!w.classified && <span className="label-archive ml-2 text-sage">detecção automática</span>}</li>)}
      </ul>
      <p className="mt-12 text-sm italic text-sage">Ficha sujeita a revisão conforme novas histórias forem publicadas.</p>
    </article>
  );
}
