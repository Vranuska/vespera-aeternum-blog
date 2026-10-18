import { Link } from "@tanstack/react-router";
import type { Work } from "@/lib/works";
import { readingMinutes } from "@/lib/works";
import { characterBySlug } from "@/data/characters";

export function WorkCard({ work, index }: { work: Work; index?: number }) {
  return (
    <Link
      to="/diarios/$id"
      params={{ id: work.id }}
      className="group relative flex h-full flex-col bg-card p-6 frame-gold transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between label-archive text-sage">
        <span>Nº {String((index ?? work.order) + 1).padStart(3, "0")}</span>
        <span className="text-gold">{work.genres.join(" · ")}</span>
      </div>
      <h3 className="mt-6 font-display text-3xl leading-tight text-parchment transition-colors group-hover:text-rose">
        {work.title}
      </h3>
      <p className="mt-2 text-sm italic text-rose">{work.date}</p>
      <p className="mt-5 line-clamp-4 text-[0.98rem] leading-relaxed text-parchment/75">{work.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {work.characters.filter((c) => c !== "vespera").slice(0, 3).map((c) => (
          <span key={c} className="label-archive border border-border px-2 py-1 text-rose">{characterBySlug(c)?.name ?? c}</span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 label-archive">
        <span className="text-sage">{readingMinutes(work)} min de leitura</span>
        <span className="text-gold transition-transform group-hover:translate-x-1">Ler →</span>
      </div>
    </Link>
  );
}

export function WorkRow({ work }: { work: Work }) {
  return (
    <Link
      to="/diarios/$id"
      params={{ id: work.id }}
      className="group grid grid-cols-1 gap-1 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
    >
      <div>
        <span className="font-display text-2xl text-parchment group-hover:text-rose">{work.title}</span>
        <span className="ml-3 text-sm italic text-sage">{work.date}</span>
      </div>
      <span className="label-archive text-gold">{work.genres.join(" · ")} · {readingMinutes(work)} min</span>
    </Link>
  );
}
