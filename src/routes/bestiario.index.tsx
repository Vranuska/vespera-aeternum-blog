import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery } from "@/lib/works";
import { CHARACTERS } from "@/data/characters";
import { Ornament } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/bestiario/")({
  head: () => ({
    meta: [
      { title: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { name: "description", content: "Fichas literárias dos personagens de Vespera Aeternum, escritas a partir dos manuscritos originais." },
      { property: "og:title", content: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { property: "og:description", content: "Mortais, anjos, demônios e reflexos que cruzaram o caminho de Vespera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Bestiary,
});

function Bestiary() {
  const { data: works } = useSuspenseQuery(worksQuery);
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-archive text-gold">Livro dos conhecidos · {CHARACTERS.length} fichas</p>
      <h1 className="mt-3 font-display text-6xl font-light text-parchment md:text-8xl">O <em className="text-rose">Bestiário</em></h1>
      <p className="mt-6 max-w-2xl text-lg italic text-parchment/80">Fichas compostas a partir dos próprios manuscritos. O que é confirmado, o que é interpretação e o que permanece mistério vem sempre separado. Serão ampliadas a cada nova história.</p>
      <Ornament className="mt-10 justify-start" />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CHARACTERS.map((c) => {
          const n = works.filter((w) => w.characters.includes(c.slug)).length;
          return (
            <li key={c.slug}>
              <Link to="/bestiario/$slug" params={{ slug: c.slug }} className="group flex h-full flex-col bg-card p-6 frame-gold transition-transform duration-500 hover:-translate-y-1">
                <span className="label-archive text-gold">{c.nature}</span>
                <span className="mt-5 font-display text-3xl text-parchment group-hover:text-rose">{c.name}</span>
                <span className="mt-1 italic text-rose">{c.epithet}</span>
                <span className="mt-4 line-clamp-3 text-parchment/75">{c.presentation[0]}</span>
                <span className="mt-auto pt-5 label-archive text-sage">{n} {n === 1 ? "obra" : "obras"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
