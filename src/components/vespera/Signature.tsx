/** Estilo visual do manuscrito por gênero (apenas apresentação). */
export type SheetStyle = "confissao" | "carta" | "diario" | "conto" | "memoria";

export function sheetStyle(genres: string[]): SheetStyle {
  if (genres.includes("confissão")) return "confissao";
  if (genres.includes("carta")) return "carta";
  if (genres.includes("diário")) return "diario";
  if (genres.includes("conto") || genres.includes("narrativa mitológica")) return "conto";
  return "memoria";
}

export const SHEET: Record<SheetStyle, { tone: string; ink: string; ornament: string; separator: string; tilt: string }> = {
  confissao: { tone: "oklch(0.92 0.04 75)", ink: "text-ink-wine", ornament: "✠", separator: "❧", tilt: "-rotate-[5deg]" },
  carta: { tone: "oklch(0.945 0.025 90)", ink: "text-ink-black", ornament: "✉", separator: "⁂", tilt: "-rotate-[3deg]" },
  diario: { tone: "oklch(0.93 0.035 85)", ink: "text-paper-ink", ornament: "☾", separator: "✧", tilt: "-rotate-[9deg]" },
  conto: { tone: "oklch(0.915 0.04 80)", ink: "text-ink-black", ornament: "✶", separator: "❦", tilt: "-rotate-[4deg]" },
  memoria: { tone: "oklch(0.92 0.045 78)", ink: "text-ink-sepia", ornament: "❀", separator: "❦", tilt: "-rotate-[3deg]" },
};

export function Signature({ style }: { style: SheetStyle }) {
  const s = SHEET[style];
  return (
    <div className={`ml-auto mt-14 flex w-fit flex-col items-end ${s.ink}`} aria-label="Assinado: Vespera">
      <span className={`font-signature inline-block origin-bottom-right text-[3.4rem] leading-none sm:text-[4.2rem] ${s.tilt} ${style === "memoria" ? "opacity-85" : ""}`}>Vespera</span>
      <svg viewBox="0 0 220 24" className="-mt-2 h-5 w-48" aria-hidden="true">
        {style === "carta" ? (
          <path d="M4 14C60 4 120 22 170 12c18-4 30-10 40 0-12 6-24 4-30-2" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
        ) : (
          <path d="M10 14C70 8 140 18 210 10" fill="none" stroke="currentColor" strokeWidth={style === "memoria" ? 0.8 : 1.1} strokeLinecap="round" opacity={0.8} />
        )}
      </svg>
      {style === "conto" && <span className="mt-1 text-lg opacity-70">{s.ornament}</span>}
    </div>
  );
}
