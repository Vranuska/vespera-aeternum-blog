import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery, type Work } from "@/lib/works";
import { characterBySlug } from "@/data/characters";
import { bestiaryAsset, bestiaryRecordById, type BestiaryRecord } from "@/lib/bestiary";
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
  const record = bestiaryRecordById(slug);

  if (record) return <CanonicalDossier record={record} works={works} />;

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="label-archive mb-4 mt-12 text-gold">{children}</h2>;
}

function CanonicalDossier({ record, works }: { record: BestiaryRecord; works: Work[] }) {
  const sourceWork = works.find((work) => work.id === record.first_record.entry_id);
  const appearances = works.filter((work) => work.characters.includes(record.id));

  return (
    <article className="mx-auto max-w-5xl px-5 py-14">
      <Link to="/bestiario" className="label-archive text-sage hover:text-gold">← O Bestiário</Link>

      <header className="mt-10 text-center">
        <p className="label-archive text-gold">{record.status_label} · {record.kind}</p>
        <h1 className="mt-4 font-display text-6xl font-light text-parchment md:text-7xl">{record.name}</h1>
        <p className="mt-3 text-xl italic text-rose">{record.epithet}</p>
        <Ornament className="mt-8" />
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
        <figure className="frame-gold bg-header p-2">
          <img
            src={bestiaryAsset(record.main_image.src)}
            alt={record.main_image.alt}
            loading="lazy"
            decoding="async"
            className="block max-h-[34rem] w-full object-cover"
          />
          <figcaption className="px-3 py-3 text-center font-display text-base italic text-rose">{record.main_image.caption}</figcaption>
        </figure>

        <div className="flex flex-col justify-center border border-border bg-plum/60 p-6 sm:p-8">
          <p className="label-archive text-gold">Classificação registrada</p>
          <p className="mt-3 font-display text-2xl text-parchment">{record.classification}</p>
          <p className="mt-5 text-lg leading-relaxed text-parchment/85">{record.summary}</p>
          <p className="mt-6 border-t border-border pt-4 text-sm italic text-sage">
            O dossiê distingue testemunho, interpretação e desconhecimento. Uma lacuna não é autorização para inventar uma habilidade.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading>História conhecida</SectionHeading>
        <div className="space-y-5 text-[1.12rem] leading-[1.85] text-parchment/90 sm:text-xl">
          {record.biography.map((paragraph, i) => <p key={i} className={i === 0 ? "dropcap flow-root" : ""}>{paragraph}</p>)}
        </div>
      </section>

      <section>
        <SectionHeading>Aptidões testemunhadas</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {record.abilities.map((ability) => (
            <article key={ability.title} className="border border-border bg-card/70 p-5">
              <h3 className="font-display text-2xl text-parchment">{ability.title}</h3>
              <p className="mt-3 leading-relaxed text-parchment/80">{ability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading>Limites do que sabemos</SectionHeading>
        <ul className="space-y-3 border-l border-blood pl-5 text-parchment/85">
          {record.known_limits.map((limit, i) => <li key={i}>{limit}</li>)}
        </ul>
      </section>

      <section>
        <SectionHeading>Cronologia dos testemunhos</SectionHeading>
        <ol className="space-y-5">
          {record.chronology.map((item, i) => (
            <li key={item.moment} className="grid gap-2 border-b border-border/60 pb-5 sm:grid-cols-[12rem_1fr]">
              <div>
                <p className="font-display text-xl text-parchment">{item.moment}</p>
                <p className="mt-1 text-sm italic text-rose">{item.date}</p>
              </div>
              <div className="border-l border-gold/40 pl-4">
                <p className="label-archive text-sage">{item.place}</p>
                <p className="mt-2 leading-relaxed text-parchment/85">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeading>Aparições e vestígios</SectionHeading>
        <div className="grid gap-6 md:grid-cols-2">
          {record.gallery.map((item) => (
            <figure key={item.src} className="overflow-hidden border border-gold/40 bg-header">
              <img
                src={bestiaryAsset(item.src)}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="block aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5">
                <strong className="font-display text-xl font-normal text-parchment">{item.caption}</strong>
                <p className="mt-2 label-archive text-sage">{item.date} · {item.place}</p>
                <p className="mt-3 leading-relaxed text-parchment/80">{item.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading>Vozes preservadas</SectionHeading>
        <div className="grid gap-5 md:grid-cols-2">
          {record.quotations.map((quote, i) => (
            <blockquote key={i} className="border-l border-gold/60 bg-plum/40 p-5">
              <p className="font-display text-2xl italic leading-snug text-parchment">“{quote.text}”</p>
              <cite className="mt-3 block text-sm not-italic text-sage">{quote.context}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading>Relações registradas</SectionHeading>
        <ul className="space-y-4">
          {record.connections.map((connection) => (
            <li key={connection.name} className="border-b border-border/60 pb-4">
              <h3 className="font-display text-xl text-parchment">{connection.name}</h3>
              <p className="mt-1 leading-relaxed text-parchment/80">{connection.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading>Manuscrito de origem</SectionHeading>
        <div className="flex flex-wrap items-center gap-4">
          {sourceWork ? (
            <Link to="/diarios/$id" params={{ id: sourceWork.id }} className="label-archive border border-gold/50 bg-wine px-4 py-3 text-parchment hover:bg-blood">
              Ler “{sourceWork.title}” →
            </Link>
          ) : (
            <a href={"https://github.com/Vranuska/vespera-aeternum/blob/main/" + record.first_record.manuscript} target="_blank" rel="noreferrer" className="label-archive border border-gold/50 bg-wine px-4 py-3 text-parchment hover:bg-blood">
              Abrir manuscrito arquivado →
            </a>
          )}
          <a href={"https://github.com/Vranuska/vespera-aeternum/blob/main/" + record.first_record.manuscript} target="_blank" rel="noreferrer" className="label-archive text-rose underline underline-offset-4 hover:text-parchment">
            Consultar arquivo canônico
          </a>
        </div>
      </section>

      {appearances.length > 0 && (
        <section>
          <SectionHeading>Outras aparições no arquivo</SectionHeading>
          <ul className="space-y-2">
            {appearances.map((work) => (
              <li key={work.id}>
                <Link to="/diarios/$id" params={{ id: work.id }} className="font-display text-xl text-parchment hover:text-rose">{work.title}</Link>
                <span className="ml-2 text-sm italic text-sage">{work.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm italic text-sage">Dossiê canônico. O que não foi testemunhado permanece em aberto.</p>
    </article>
  );
}
