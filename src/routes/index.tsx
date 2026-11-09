import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/vespera-hero.jpg";
import { worksQuery, readingMinutes } from "@/lib/works";
import { characterBySlug } from "@/data/characters";
import { Ornament } from "@/components/vespera/Ornament";
import { Monogram } from "@/components/vespera/Monogram";
import { Manuscript } from "@/components/vespera/Manuscript";
import { WorkRow } from "@/components/vespera/WorkCard";
import { Constellation } from "@/components/vespera/Constellation";
import { editorialQuery } from "@/lib/editorial";

const FEATURED_TITLE = "O lugar onde a água ferve";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vespera Aeternum — O Portal" },
      { name: "description", content: "Biblioteca literária gótica de Vespera: diários, contos, cartas e mitologias de uma entidade que observa a mortalidade." },
      { property: "og:title", content: "Vespera Aeternum — O Portal" },
      { property: "og:description", content: "Há coisas que a morte não consegue levar. Infelizmente, algumas delas sabem escrever." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(worksQuery), context.queryClient.ensureQueryData(editorialQuery)]),
  component: Portal,
});

type SideLink = { label: string; to: string; search?: Record<string, unknown> };
const SIDE: SideLink[] = [
  { label: "Diários", to: "/diarios" },
  { label: "Ordem de leitura", to: "/diarios", search: { modo: "livro" } },
  { label: "Cronologia", to: "/biblioteca", search: { ordem: "antiga" } },
  { label: "Personagens", to: "/bestiario" },
  { label: "Lugares", to: "/atlas" },
  { label: "Objetos", to: "/biblioteca" },
  { label: "Cartas", to: "/biblioteca", search: { generos: ["carta"] } },
  { label: "Mapas", to: "/atlas" },
  { label: "Bestiário", to: "/bestiario" },
];

function Portal() {
  const { data: works } = useSuspenseQuery(worksQuery);
  const { data: editorial } = useSuspenseQuery(editorialQuery);
  const featured = works.find((w) => w.title === FEATURED_TITLE) ?? works[0];
  const others = works.filter((w) => w.id !== featured?.id).slice(0, 6);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-3 py-8 sm:px-5 lg:grid-cols-[15rem_1fr] lg:py-12">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav aria-label="Arquivo" className="frame-gold bg-header p-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Monogram className="h-9 w-9 text-gold" />
            <p className="label-archive text-gold">Índice do arquivo</p>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">
            {SIDE.map((s) => (
              <li key={s.label}>
                <Link to={s.to} search={s.search as never} className="block border-b border-border/60 py-2.5 font-display text-lg text-parchment transition-colors hover:text-rose">
                  <span className="mr-2 text-gold" aria-hidden="true">❧</span>{s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label-archive mt-5 text-sage">{works.length} manuscritos no arquivo</p>
        </nav>
      </aside>

      {featured && (
        <article>
          <header className="text-center">
            <p className="label-archive text-gold">Manuscrito em destaque · {featured.genres.join(" · ")}</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-light leading-[0.95] text-parchment">{featured.title}</h1>
            <p className="mt-3 italic text-rose">{featured.date}{featured.place ? ` · ${featured.place}` : ""}</p>
            <Ornament className="mt-6" />
          </header>

          <figure className="mx-auto mt-8 max-w-[46rem] frame-gold bg-header p-2">
            <img src={hero} alt="Vespera, de véu negro, observa a noite estrelada por uma janela gótica" width={1920} height={1088} className="h-56 w-full object-cover object-[70%_center] sepia-[.25] sm:h-72" />
            <figcaption className="label-archive py-2 text-center text-sage">Prancha I · Vespera à janela</figcaption>
          </figure>

          <div className="mt-6"><Manuscript work={featured} /></div>

          <footer className="mx-auto mt-6 grid max-w-[46rem] gap-4 border-y border-border py-5 label-archive text-sage sm:grid-cols-3">
            <span>Coleção<br /><span className="text-parchment">{featured.collection}</span></span>
            <span>Leitura<br /><span className="text-parchment">{readingMinutes(featured)} min · {featured.words} palavras</span></span>
            <span>Presenças<br /><span className="text-parchment">{featured.characters.map((c) => characterBySlug(c)?.name ?? c).join(", ") || "—"}</span></span>
          </footer>
          <div className="mx-auto mt-4 flex max-w-[46rem] flex-wrap justify-between gap-4">
            <Link to="/diarios/$id" params={{ id: featured.id }} className="label-archive text-gold hover:text-parchment">Abrir no leitor →</Link>
            <Link to="/biblioteca" className="label-archive text-rose hover:text-parchment">Entrar na Bibliotheca →</Link>
          </div>

          <Constellation index={editorial} works={works} />

          <section className="mx-auto mt-16 max-w-[46rem]">
            <h2 className="font-display text-3xl italic text-parchment">Outros manuscritos</h2>
            <div className="mt-4">{others.map((w) => <WorkRow key={w.id} work={w} />)}</div>
          </section>
        </article>
      )}
    </div>
  );
}