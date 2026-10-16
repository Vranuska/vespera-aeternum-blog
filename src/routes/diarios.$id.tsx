import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { worksQuery, readingMinutes } from "@/lib/works";
import { Ornament } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/diarios/$id")({
  loader: async ({ context, params }) => {
    const works = await context.queryClient.ensureQueryData(worksQuery);
    const w = works.find((x) => x.id === params.id);
    if (!w) throw notFound();
    return { title: w.title, excerpt: w.excerpt };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Vespera Aeternum` },
          { name: "description", content: loaderData.excerpt.slice(0, 155) },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt.slice(0, 155) },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Manuscrito indisponível — Vespera Aeternum" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-40 text-center">
      <p className="font-display text-4xl italic text-rose">Este manuscrito não está no arquivo.</p>
      <Link to="/biblioteca" className="label-archive mt-8 inline-block text-gold">Voltar à biblioteca</Link>
    </div>
  ),
  component: Reader,
});

function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setP(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return p;
}

function Reader() {
  const { id } = Route.useParams();
  const { data: works } = useSuspenseQuery(worksQuery);
  const router = useRouter();
  const i = works.findIndex((w) => w.id === id);
  const w = works[i]!; // loader garante existência (notFound)
  const newer = works[i - 1];
  const older = works[i + 1];
  const progress = useProgress();
  const related = works.filter((x) => x.id !== w.id && x.characters.some((c) => w.characters.includes(c))).slice(0, 3);
  // Citação destacada: frase curta e marcante do próprio texto
  const pullIdx = w.paragraphs.length > 8 ? Math.floor(w.paragraphs.length / 2) : -1;
  const pull = pullIdx >= 0 ? w.paragraphs.slice(pullIdx).find((p) => p.length > 40 && p.length < 180) : undefined;
  const pullAt = pull ? w.paragraphs.indexOf(pull) : -1;

  const back = () => (window.history.length > 1 ? router.history.back() : router.navigate({ to: "/biblioteca" }));

  return (
    <article>
      <div className="fixed left-0 top-0 z-50 h-0.5 bg-gold" style={{ width: `${progress * 100}%` }} role="progressbar" aria-label="Progresso de leitura" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} />
      <div className="mx-auto max-w-3xl px-5 pt-10">
        <button onClick={back} className="label-archive text-sage hover:text-gold">← Retornar à biblioteca</button>
      </div>

      <header className="mx-auto max-w-3xl px-5 pb-12 pt-16 text-center">
        <p className="label-archive text-gold">{w.type} · {readingMinutes(w)} min de leitura</p>
        <h1 className="mt-6 font-display text-5xl font-light leading-[0.95] text-parchment md:text-7xl">{w.title}</h1>
        <p className="mt-6 text-lg italic text-rose">{w.date}</p>
        {w.place && <p className="label-archive mt-2 text-sage">{w.place}</p>}
        <Ornament className="mt-10" />
      </header>

      <div className="mx-auto max-w-[46rem] px-3 sm:px-5">
        <div className="page-parchment px-6 py-12 sm:px-14 sm:py-16">
          <div className="space-y-5 text-[1.16rem] leading-[1.75] sm:text-[1.22rem]">
            {w.paragraphs.map((p, k) => (
              <div key={k}>
                {k === pullAt && (
                  <blockquote className="my-10 border-y border-blood/40 py-8 text-center font-display text-3xl italic leading-snug text-wine">
                    “{p}”
                  </blockquote>
                )}
                {k !== pullAt && (
                  /^[*·~—\-]{1,}\s*$|^\*\s*\*\s*\*$/.test(p.trim()) ? (
                    <p className="py-4 text-center text-gold" aria-hidden="true">❦</p>
                  ) : (
                    <p className={k === 0 ? "dropcap flow-root" : ""}>{p}</p>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="mt-14 text-right">
            <p className="font-display text-4xl italic text-blood">— Vespera</p>
          </div>
        </div>
      </div>

      <nav className="mx-auto mt-16 grid max-w-5xl gap-px bg-border px-0 sm:grid-cols-2" aria-label="Navegação entre obras">
        {older ? (
          <Link to="/diarios/$id" params={{ id: older.id }} className="group bg-background p-8">
            <span className="label-archive text-sage">← Anterior</span>
            <span className="mt-2 block font-display text-2xl text-parchment group-hover:text-rose">{older.title}</span>
          </Link>
        ) : <span className="bg-background" />}
        {newer ? (
          <Link to="/diarios/$id" params={{ id: newer.id }} className="group bg-background p-8 text-right">
            <span className="label-archive text-sage">Próxima →</span>
            <span className="mt-2 block font-display text-2xl text-parchment group-hover:text-rose">{newer.title}</span>
          </Link>
        ) : <span className="bg-background" />}
      </nav>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-5xl px-5">
          <p className="label-archive text-center text-gold">Obras relacionadas</p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link to="/diarios/$id" params={{ id: r.id }} className="block frame-gold bg-plum p-6 hover:bg-wine/40">
                  <span className="font-display text-xl text-parchment">{r.title}</span>
                  <span className="mt-2 block text-sm italic text-rose">{r.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
