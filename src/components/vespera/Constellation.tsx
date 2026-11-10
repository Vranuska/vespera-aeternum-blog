import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Monogram } from "./Monogram";
import { buildEras, type EditorialIndex } from "@/lib/editorial";
import type { Work } from "@/lib/works";

const PHRASE = "Tudo aquilo que foi esquecido ainda existe em algum lugar de mim";
const OUTER = "MEMORIA · TEMPUS · CINIS · LUX · ANIMA · SILENTIUM · NOX · AETERNUM · ";
const INNER = "o que se perde · o que se guarda · o que retorna · ";

export function Constellation({ index, works }: { index: EditorialIndex; works: Work[] }) {
  const knownIds = useMemo(() => new Set(works.map((work) => work.id)), [works]);
  const { eras, missing } = useMemo(() => buildEras(index, knownIds), [index, knownIds]);
  const workById = useMemo(() => new Map(works.map((work) => [work.id, work] as const)), [works]);
  const chapters = useMemo(
    () => index.chapters.filter((chapter) => knownIds.has(chapter.entry_id)),
    [index, knownIds],
  );
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    if (missing.length)
      console.warn("[constelação] IDs do índice ausentes em entries.json:", missing);
  }, [missing]);
  const era = eras.find((e) => e.key === selected);
  const count = (k: string) =>
    eras.find((e) => e.key === k)?.months.reduce((n, m) => n + m.entries.length, 0) ?? 0;

  return (
    <section id="constelacao" aria-labelledby="constelacao-titulo" className="mx-auto mt-16 max-w-[46rem] px-4 sm:px-0">
      <h2
        id="constelacao-titulo"
        className="text-center font-display text-3xl italic text-parchment"
      >
        Constelação de memórias
      </h2>
      <p className="label-archive mt-2 text-center text-sage">
        Cronologia do universo · índice editorial da autora
      </p>

      <div className="relative mx-auto mt-8 aspect-square w-full max-w-[26rem]">
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full text-gold"
          aria-hidden="true"
        >
          <defs>
            <path id="ring-outer" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
            <path id="ring-inner" d="M200,200 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1 -236,0" />
          </defs>
          <g className="origin-center animate-spin-slow [animation-duration:240s] [transform-box:fill-box]">
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.5"
            />
            <circle
              cx="200"
              cy="200"
              r="162"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              strokeDasharray="1 5"
              opacity="0.6"
            />
            <text className="fill-current font-mono text-[9px] tracking-[0.35em]" opacity="0.55">
              <textPath href="#ring-outer">{OUTER.repeat(2)}</textPath>
            </text>
          </g>
          <g className="origin-center animate-spin-slow [animation-direction:reverse] [animation-duration:320s] [transform-box:fill-box]">
            <circle
              cx="200"
              cy="200"
              r="132"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.45"
            />
            <text className="fill-current font-display text-[11px] italic" opacity="0.5">
              <textPath href="#ring-inner">{INNER.repeat(3)}</textPath>
            </text>
          </g>
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.35"
          />
        </svg>

        <div className="absolute inset-[30%] flex flex-col items-center justify-center text-center">
          <Monogram className="h-12 w-12 text-gold sm:h-14 sm:w-14" />
          <p className="mt-2 font-display text-[0.8rem] italic leading-snug text-parchment sm:text-base">
            {PHRASE}
          </p>
        </div>

        {eras.map((e, i) => {
          const angle = (i / eras.length) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + 37.5 * Math.cos(angle),
            y = 50 + 37.5 * Math.sin(angle);
          const active = e.key === selected;
          return (
            <button
              key={e.key}
              type="button"
              onClick={() => setSelected(active ? null : e.key)}
              aria-pressed={active}
              aria-label={`${e.label}: ${count(e.key)} manuscritos`}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span
                className={`block h-3 w-3 rounded-full border border-gold shadow-[0_0_10px_var(--color-gold)] ${active ? "bg-parchment" : "bg-gold animate-flicker"}`}
              />
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap border border-gold/40 bg-header px-2 py-1 font-display text-sm italic text-parchment opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {e.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Eras da constelação"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {eras.map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => setSelected(e.key === selected ? null : e.key)}
            aria-pressed={e.key === selected}
            aria-controls="constelacao-era"
            className={`label-archive min-h-11 border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-gold ${e.key === selected ? "border-gold bg-header text-gold" : "border-border text-rose hover:text-parchment"}`}
          >
            {e.label} <span className="text-sage">({count(e.key)})</span>
          </button>
        ))}
      </div>

      <div id="constelacao-era" aria-live="polite" className="mt-6">
        {era && (
          <div className="frame-gold bg-header p-5">
            <h3 className="font-display text-2xl text-parchment">{era.label}</h3>
            {era.months.map((m) => (
              <div key={m.key} className="mt-4">
                <p className="label-archive border-b border-border pb-1 text-gold">{m.label}</p>
                <ul className="mt-2">
                  {m.entries.map((en) => (
                    <li key={en.id} className="border-b border-border/50 py-2">
                      <Link
                        to="/diarios/$id"
                        params={{ id: en.id }}
                        className="font-display text-lg text-parchment hover:text-rose"
                      >
                        {en.title}
                      </Link>
                      <p className="text-sm italic text-sage">{en.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <details className="mt-8 border border-gold/30 bg-header">
        <summary className="cursor-pointer px-5 py-4 font-display text-xl text-parchment">
          Volume I — Ciclo das Inacabadas
          <span className="label-archive ml-3 text-gold">{chapters.length} capítulos · ordem editorial</span>
        </summary>
        <div className="border-t border-border px-5 py-4">
          <p className="mb-4 text-sm italic text-sage">
            Esta é a sequência de leitura do romance-mosaico. A constelação acima mostra outra coisa: a cronologia do universo, que não precisa seguir a ordem em que os manuscritos são lidos.
          </p>
          <ol className="grid gap-x-6 sm:grid-cols-2">
            {chapters.map((chapter) => {
              const work = workById.get(chapter.entry_id);
              if (!work) return null;
              return (
                <li key={chapter.entry_id} className="border-b border-border/50 py-3">
                  <Link to="/diarios/$id" params={{ id: chapter.entry_id }} className="block hover:text-rose">
                    <span className="label-archive text-gold">Capítulo {chapter.number}</span>
                    <span className="mt-1 block font-display text-lg text-parchment">{work.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </details>
      <p className="mt-4 text-center">
        <Link to="/diarios" className="label-archive text-rose hover:text-parchment">
          Índice completo dos diários →
        </Link>
      </p>
    </section>
  );
}