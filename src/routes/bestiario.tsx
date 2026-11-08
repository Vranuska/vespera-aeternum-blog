import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery } from "@/lib/works";
import { CHARACTERS } from "@/data/characters";
import { Ornament, StarSigil } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/bestiario")({
  head: () => ({
    meta: [
      { title: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { name: "description", content: "Um índice de presenças, vínculos e testemunhos recolhidos nos manuscritos de Vespera." },
      { property: "og:title", content: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { property: "og:description", content: "Cada ficha distingue o que foi testemunhado, interpretado e aquilo que permanece sem resposta." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Bestiary,
});

function Bestiary() {
  const { data: works } = useSuspenseQuery(worksQuery);

  const records = CHARACTERS.map((character) => ({
    ...character,
    appearances: works.filter((work) => work.characters.includes(character.slug)),
  })).sort((a, b) => {
    const order = ["vespera", "padre-tomas", "ithariel", "azrakhel", "eithne"];
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.name.localeCompare(b.name, "pt");
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="label-archive text-gold">Inventário de presenças · Livro aberto</p>
        <h1 className="mt-4 font-display text-6xl font-light text-parchment md:text-8xl">
          O <em className="text-rose">Bestiário</em>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-display text-2xl italic leading-relaxed text-parchment/80">
          Não é um catálogo de monstros. É um registro daqueles que atravessaram as páginas — e daqueles que ainda deixam nelas alguma coisa de si.
        </p>
        <Ornament className="mt-8" />
      </header>

      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-border py-4 label-archive text-sage">
        <span>{records.length} fichas no arquivo</span>
        <span>{works.length} manuscritos consultados</span>
        <span>Testemunho · interpretação · lacuna</span>
      </div>

      <section aria-label="Fichas do Bestiário" className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {records.map((character, index) => (
          <Link
            key={character.slug}
            to="/bestiario/$slug"
            params={{ slug: character.slug }}
            className="group relative flex min-h-72 flex-col border border-gold/30 bg-plum/65 p-7 transition-colors duration-500 hover:border-gold/70 hover:bg-wine/70 focus-visible:outline-gold"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="label-archive text-gold">Registro {String(index + 1).padStart(2, "0")}</span>
              <StarSigil className="h-8 w-8 text-gold/70 transition-transform duration-700 group-hover:rotate-45 group-hover:text-gold" />
            </div>
            <div className="my-7 flex items-center gap-4">
              <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/45 font-display text-3xl italic text-rose">
                {character.name.charAt(0)}
              </span>
              <div>
                <h2 className="font-display text-3xl leading-tight text-parchment group-hover:text-rose">{character.name}</h2>
                <p className="mt-1 text-sm italic text-rose/90">{character.epithet}</p>
              </div>
            </div>
            <p className="line-clamp-3 text-base leading-relaxed text-parchment/75">
              {character.presentation[0]}
            </p>
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-5">
              <span className="label-archive text-sage">{character.appearances.length} {character.appearances.length === 1 ? "manuscrito" : "manuscritos"}</span>
              <span className="label-archive text-gold transition-transform group-hover:translate-x-1">Abrir ficha →</span>
            </div>
          </Link>
        ))}
      </section>

      <aside className="mx-auto mt-16 max-w-3xl border-l border-gold/50 bg-background/40 px-6 py-5">
        <p className="font-display text-xl italic leading-relaxed text-parchment/80">
          O que não foi registrado não será preenchido por conveniência. Uma origem desconhecida continua desconhecida; uma habilidade não testemunhada não se torna verdadeira só porque caberia bem numa página.
        </p>
        <p className="label-archive mt-4 text-gold">Princípio de catalogação</p>
      </aside>

      <div className="mt-14 text-center">
        <Link to="/biblioteca" className="label-archive text-gold underline-offset-4 hover:text-parchment hover:underline">Consultar os manuscritos →</Link>
      </div>
    </div>
  );
}
