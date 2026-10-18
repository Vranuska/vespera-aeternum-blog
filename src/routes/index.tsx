import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/vespera-hero.jpg";
import { worksQuery, readingMinutes } from "@/lib/works";
import { CHARACTERS } from "@/data/characters";
import { Ornament, StarSigil } from "@/components/vespera/Ornament";
import { WorkCard } from "@/components/vespera/WorkCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vespera Aeternum — O Portal" },
      { name: "description", content: "Biblioteca literária gótica de Vespera: diários, contos, cartas e mitologias de uma entidade que observa a mortalidade." },
      { property: "og:title", content: "Vespera Aeternum — O Portal" },
      { property: "og:description", content: "Há coisas que a morte não consegue levar. Infelizmente, algumas delas sabem escrever." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Portal,
});

function Portal() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const latest = works[0];
  const selected = [...works].sort((a, b) => b.words - a.words).slice(0, 3);
  const characters = CHARACTERS.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: works.filter((w) => w.characters.includes(c.slug)).length,
  })).filter((c) => c.count > 0);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img src={hero} alt="Vespera, de véu negro, observa a noite estrelada por uma janela gótica" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 veil" />
        <div className="absolute inset-x-0 bottom-0 h-48 fade-bottom" />
        <StarSigil className="pointer-events-none absolute -left-32 top-10 h-[520px] w-[520px] text-gold/15 animate-spin-slow" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 py-24">
          <p className="label-archive text-gold animate-rise">Arquivo nº I · Manuscritos de uma imortal</p>
          <h1 className="mt-6 font-display text-[clamp(3.4rem,11vw,9.5rem)] font-light leading-[0.85] tracking-tight text-parchment animate-rise">
            Vespera
            <span className="block pl-[0.6em] italic text-rose">Aeternum</span>
          </h1>
          <p className="mt-10 max-w-md text-xl italic leading-relaxed text-parchment/85 animate-rise">
            “Há coisas que a morte não consegue levar. Infelizmente, algumas delas sabem escrever.”
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6 animate-rise">
            <Link to="/biblioteca" className="label-archive border border-gold bg-wine px-8 py-4 text-parchment transition-colors hover:bg-blood">
              Entrar no Arquivo
            </Link>
            {latest && (
              <Link to="/diarios/$id" params={{ id: latest.id }} className="label-archive text-rose underline-offset-8 hover:text-parchment hover:underline">
                Último manuscrito: {latest.title} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {latest && (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <Ornament />
          <p className="label-archive mt-10 text-center text-gold">Publicação mais recente</p>
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div>
              <h2 className="font-display text-5xl leading-none text-parchment md:text-6xl">{latest.title}</h2>
              <p className="mt-4 italic text-rose">{latest.date}</p>
              {latest.place && <p className="label-archive mt-2 text-sage">{latest.place}</p>}
            </div>
            <div className="page-parchment p-8 md:p-10">
              <p className="dropcap text-lg leading-relaxed">{latest.paragraphs.slice(0, 2).join(" ")}</p>
              <Link to="/diarios/$id" params={{ id: latest.id }} className="label-archive mt-6 inline-block text-blood hover:underline">
                Continuar a leitura · {readingMinutes(latest)} min
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
          <h2 className="font-display text-4xl italic text-parchment md:text-5xl">Obras selecionadas</h2>
          <Link to="/biblioteca" className="label-archive text-gold hover:text-parchment">Todas as {works.length} →</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {selected.map((w) => <WorkCard key={w.id} work={w} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <p className="label-archive text-gold">Os conhecidos</p>
        <h2 className="mt-3 font-display text-4xl text-parchment md:text-5xl">Quem atravessa estas páginas</h2>
        <ul className="mt-10 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {characters.map((c) => (
            <li key={c.name} className="bg-background">
              <Link to="/bestiario/$slug" params={{ slug: c.slug }} className="group block p-6 transition-colors hover:bg-plum">
                <span className="font-display text-2xl text-parchment group-hover:text-rose">{c.name}</span>
                <span className="label-archive mt-2 block text-sage">{c.count} {c.count === 1 ? "obra" : "obras"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3">
        {[
          { to: "/biblioteca" as const, t: "Bibliotheca Noctis", d: "Pesquise todo o arquivo." },
          { to: "/bestiario" as const, t: "O Bestiário", d: "As fichas dos conhecidos." },
          { to: "/atlas" as const, t: "Atlas do Impossível", d: "Lugares e cronologias." },
        ].map((p) => (
          <Link key={p.to} to={p.to} className="group frame-gold bg-plum p-10 text-center">
            <StarSigil className="mx-auto h-14 w-14 text-gold transition-transform duration-700 group-hover:rotate-45" />
            <h3 className="mt-6 font-display text-3xl text-parchment">{p.t}</h3>
            <p className="mt-2 italic text-rose">{p.d}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
