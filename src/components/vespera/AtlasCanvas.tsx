import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Minus, Plus, LocateFixed } from "lucide-react";
import type { AtlasMap, Kind, Place } from "@/data/atlas";

const W = 1000, H = 700, MIN = 0.6, MAX = 4;
type T = { x: number; y: number; k: number };
const clampK = (k: number) => Math.min(MAX, Math.max(MIN, k));

/** Glifos originais por tipo de lugar. */
export function PlaceGlyph({ kind, size = 18 }: { kind: Kind; size?: number }) {
  const s = size / 2;
  const p: Record<string, ReactNode> = {
    plano: <><circle r={s} fill="none" /><circle r={s * 0.45} /><path d={`M${-s * 1.5} 0H${s * 1.5}`} /></>,
    casa: <path d={`M${-s} ${s}V${-s * 0.1}L0 ${-s}L${s} ${-s * 0.1}V${s}Z`} fill="none" />,
    quarto: <rect x={-s * 0.8} y={-s * 0.8} width={s * 1.6} height={s * 1.6} fill="none" />,
    salão: <><path d={`M${-s} ${s}H${s}M${-s * 0.7} ${s}V${-s * 0.4}M${s * 0.7} ${s}V${-s * 0.4}M0 ${s}V${-s * 0.4}M${-s} ${-s * 0.4}L0 ${-s}L${s} ${-s * 0.4}Z`} fill="none" /></>,
    jardim: <><circle cy={-s * 0.3} r={s * 0.55} fill="none" /><path d={`M0 ${s * 0.25}V${s}`} /><circle cx={-s * 0.6} cy={s * 0.3} r={s * 0.3} fill="none" /><circle cx={s * 0.6} cy={s * 0.3} r={s * 0.3} fill="none" /></>,
    palácio: <path d={`M${-s} ${s}V${-s * 0.2}H${-s * 0.5}V${-s}H${-s * 0.2}V${-s * 0.5}H${s * 0.2}V${-s}H${s * 0.5}V${-s * 0.2}H${s}V${s}Z`} fill="none" />,
    biblioteca: <path d={`M${-s} ${s}V${-s}H${-s * 0.4}V${s}M${-s * 0.2} ${s}V${-s}H${s * 0.4}V${s}M${s * 0.5} ${s}L${s * 0.9} ${-s}`} fill="none" />,
    tribunal: <path d={`M0 ${-s}V${s}M${-s} ${-s * 0.5}H${s}M${-s} ${-s * 0.5}L${-s * 1.2} ${s * 0.2}H${-s * 0.6}ZM${s} ${-s * 0.5}L${s * 0.6} ${s * 0.2}H${s * 1.2}Z`} fill="none" />,
    mar: <path d={`M${-s} 0q${s / 2} ${-s / 2} ${s} 0t${s} 0M${-s} ${s * 0.6}q${s / 2} ${-s / 2} ${s} 0t${s} 0`} fill="none" />,
    corte: <path d={`M${-s} ${s * 0.6}L${-s} ${-s * 0.6}L${-s * 0.4} 0L0 ${-s}L${s * 0.4} 0L${s} ${-s * 0.6}V${s * 0.6}Z`} fill="none" />,
    taberna: <path d={`M${-s * 0.6} ${-s * 0.8}H${s * 0.6}L${s * 0.4} ${s}H${-s * 0.4}ZM${s * 0.6} ${-s * 0.3}H${s}V${s * 0.4}H${s * 0.5}`} fill="none" />,
    aldeia: <path d={`M${-s} ${s}V0L${-s * 0.5} ${-s * 0.5}L0 0V${s}M0 ${s}V${-s * 0.2}L${s * 0.5} ${-s}L${s} ${-s * 0.2}V${s}`} fill="none" />,
    cidade: <path d={`M${-s} ${s}V${-s * 0.3}H${-s * 0.3}V${s}M${-s * 0.3} ${s}V${-s}H${s * 0.3}V${s}M${s * 0.3} ${s}V0H${s}V${s}`} fill="none" />,
    lago: <ellipse rx={s} ry={s * 0.6} fill="none" />,
    estação: <path d={`M${-s} ${s}V${-s * 0.2}A${s} ${s} 0 0 1 ${s} ${-s * 0.2}V${s}M${-s} ${s * 0.4}H${s}`} fill="none" />,
    igreja: <path d={`M${-s * 0.7} ${s}V${-s * 0.1}L0 ${-s * 0.6}L${s * 0.7} ${-s * 0.1}V${s}ZM0 ${-s * 0.6}V${-s * 1.3}M${-s * 0.3} ${-s}H${s * 0.3}`} fill="none" />,
    torre: <path d={`M${-s * 0.4} ${s}V${-s * 0.4}L0 ${-s}L${s * 0.4} ${-s * 0.4}V${s}M${-s * 0.2} 0A${s * 0.2} ${s * 0.2} 0 0 1 ${s * 0.2} 0`} fill="none" />,
    ponte: <path d={`M${-s} ${s * 0.3}Q0 ${-s} ${s} ${s * 0.3}M${-s} ${s * 0.3}H${s}`} fill="none" />,
    estrela: <path d={`M0 ${-s}L${s * 0.25} ${-s * 0.25}L${s} 0L${s * 0.25} ${s * 0.25}L0 ${s}L${-s * 0.25} ${s * 0.25}L${-s} 0L${-s * 0.25} ${-s * 0.25}Z`} fill="none" />,
    portal: <><ellipse rx={s * 0.6} ry={s} fill="none" /><ellipse rx={s * 0.3} ry={s * 0.6} fill="none" /></>,
  };
  return <g stroke="currentColor" strokeWidth={1.4} fill="currentColor">{p[kind] ?? p["plano"]}</g>;
}

/** Pseudoaleatório determinístico para a decoração. */
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }

function Terrain({ map }: { map: AtlasMap }) {
  const r = rng(map.id.length * 977 + 13);
  const stars = Array.from({ length: map.terrain === "cosmos" || map.terrain === "vazio" ? 140 : 40 }, () => [r() * W, r() * H, r() * 1.4 + 0.3] as const);
  return (
    <g aria-hidden="true">
      <rect width={W} height={H} fill="var(--obsidian)" />
      <rect width={W} height={H} fill="url(#atlas-glow)" />
      {/* graticule */}
      {Array.from({ length: 11 }, (_, i) => <path key={`v${i}`} d={`M${i * 100} 0V${H}`} stroke="var(--gold)" strokeOpacity={0.06} />)}
      {Array.from({ length: 8 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 100}H${W}`} stroke="var(--gold)" strokeOpacity={0.06} />)}
      {stars.map(([x, y, s], i) => <circle key={i} cx={x} cy={y} r={s} fill="var(--parchment)" opacity={0.35} className={i % 7 === 0 ? "animate-flicker" : undefined} />)}
      {map.terrain === "cosmos" && [120, 230, 340].map((rad) => <ellipse key={rad} cx={500} cy={350} rx={rad * 1.35} ry={rad * 0.8} fill="none" stroke="var(--gold)" strokeOpacity={0.18} strokeDasharray="2 6" />)}
      {map.terrain === "celeste" && Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-50 + i * 130} ${200 + (i % 3) * 140}q60 -40 120 0t120 0`} fill="none" stroke="var(--parchment)" strokeOpacity={0.12} />)}
      {map.terrain === "infernal" && Array.from({ length: 14 }, (_, i) => { const x = 40 + r() * 920, y = 80 + r() * 560; return <path key={i} d={`M${x - 16} ${y + 10}L${x} ${y - 14}L${x + 16} ${y + 10}`} fill="none" stroke="var(--blood)" strokeOpacity={0.5} />; })}
      {(map.terrain === "mortal" || map.terrain === "aldeia") && Array.from({ length: 18 }, (_, i) => { const x = 40 + r() * 920, y = 60 + r() * 580; return <path key={i} d={`M${x - 12} ${y + 8}L${x - 3} ${y - 8}L${x + 4} ${y + 2}L${x + 10} ${y - 4}L${x + 18} ${y + 8}`} fill="none" stroke="var(--sage)" strokeOpacity={0.45} />; })}
      {map.terrain === "aldeia" && <path d="M620 700C650 600 760 560 720 500S860 380 1000 300" fill="none" stroke="var(--rose)" strokeOpacity={0.35} strokeWidth={14} />}
      {map.terrain === "entre" && [0, 1, 2, 3].map((i) => <circle key={i} cx={500} cy={350} r={90 + i * 85} fill="none" stroke="var(--rose)" strokeOpacity={0.1 + i * 0.03} strokeDasharray={i % 2 ? "1 9" : "14 10"} />)}
      {map.terrain === "casa" && <path d="M120 120H880V600H120Z M120 380H880 M470 120V600" fill="none" stroke="var(--gold)" strokeOpacity={0.2} strokeWidth={2} />}
      {/* rosa dos ventos */}
      <g transform="translate(905 610)" stroke="var(--gold)" strokeOpacity={0.55} fill="none">
        <circle r={34} /><circle r={4} />
        <path d="M0 -46L6 0L0 46L-6 0Z M-46 0L0 6L46 0L0 -6Z" />
        <text y={-52} textAnchor="middle" fill="var(--gold)" stroke="none" fontSize={11} className="font-display">N</text>
      </g>
      <rect x={8} y={8} width={W - 16} height={H - 16} fill="none" stroke="var(--gold)" strokeOpacity={0.35} />
      <rect x={16} y={16} width={W - 32} height={H - 32} fill="none" stroke="var(--gold)" strokeOpacity={0.15} />
    </g>
  );
}

export function AtlasCanvas({ map, selected, onSelect }: { map: AtlasMap; selected?: string | undefined; onSelect: (p: Place) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<T>({ x: 0, y: 0, k: 1 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(0);
  const pinch = useRef<{ d: number; k: number } | null>(null);

  useEffect(() => setT({ x: 0, y: 0, k: 1 }), [map.id]);

  const unit = () => (ref.current ? W / ref.current.getBoundingClientRect().width : 1);
  const local = (cx: number, cy: number) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: (cx - r.left) * unit(), y: (cy - r.top) * unit() };
  };
  const zoomAt = useCallback((px: number, py: number, nk: number) => {
    setT((o) => { const k = clampK(nk); return { k, x: px - ((px - o.x) / o.k) * k, y: py - ((py - o.y) / o.k) * k }; });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e.clientX, e.clientY);
      setT((o) => { const k = clampK(o.k * Math.exp(-e.deltaY * 0.0015)); return { k, x: p.x - ((p.x - o.x) / o.k) * k, y: p.y - ((p.y - o.y) / o.k) * k }; });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const down = (e: PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a!.x - b!.x, a!.y - b!.y), k: t.k };
    }
  };
  const move = (e: PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      const mid = local((a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
      zoomAt(mid.x, mid.y, pinch.current.k * (d / pinch.current.d));
      moved.current += 10;
      return;
    }
    const u = unit(), dx = (cur.x - prev.x) * u, dy = (cur.y - prev.y) * u;
    moved.current += Math.abs(dx) + Math.abs(dy);
    if (moved.current > 4) {
      if (!ref.current?.hasPointerCapture(e.pointerId)) ref.current?.setPointerCapture(e.pointerId);
      setT((o) => ({ ...o, x: o.x + dx, y: o.y + dy }));
    }
  };
  const up = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const key = (e: KeyboardEvent) => {
    const step = 40;
    const k: Record<string, () => void> = {
      ArrowLeft: () => setT((o) => ({ ...o, x: o.x + step })),
      ArrowRight: () => setT((o) => ({ ...o, x: o.x - step })),
      ArrowUp: () => setT((o) => ({ ...o, y: o.y + step })),
      ArrowDown: () => setT((o) => ({ ...o, y: o.y - step })),
      "+": () => zoomAt(W / 2, H / 2, t.k * 1.3),
      "=": () => zoomAt(W / 2, H / 2, t.k * 1.3),
      "-": () => zoomAt(W / 2, H / 2, t.k / 1.3),
    };
    if (k[e.key] && e.target === e.currentTarget) { e.preventDefault(); k[e.key]!(); }
  };

  const byId = Object.fromEntries(map.places.map((p) => [p.id, p]));
  const btn = "flex h-10 w-10 items-center justify-center border border-gold/50 bg-background/80 text-parchment hover:bg-wine";

  return (
    <div className="relative">
      <div
        ref={ref}
        role="application"
        aria-label={`Mapa: ${map.title}. Arraste para mover, use a roda ou as teclas + e − para aproximar; Tab percorre os lugares.`}
        tabIndex={0}
        onKeyDown={key}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="relative aspect-[10/7] w-full cursor-grab touch-none select-none overflow-hidden border border-gold/40 outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing"
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="atlas-glow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="var(--plum)" stopOpacity={0.9} />
              <stop offset="70%" stopColor="var(--wine)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--obsidian)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
            <Terrain map={map} />
            {map.links.map((l, i) => {
              const a = byId[l.from], b = byId[l.to];
              if (!a || !b) return null;
              return (
                <g key={i}>
                  <path d={`M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 50} ${b.x} ${b.y}`} fill="none" stroke={l.kind === "portal" ? "var(--rose)" : "var(--gold)"} strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray={l.status === "inferida" ? "4 6" : undefined} />
                  {l.label && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 30} textAnchor="middle" fontSize={11} fill="var(--sage)" fontStyle="italic">{l.label}{l.status === "inferida" ? " (inferida)" : ""}</text>}
                </g>
              );
            })}
            {map.places.map((p) => {
              const on = selected === p.id;
              const big = p.kind === "plano";
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x} ${p.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}${p.status === "provisório" ? " (provisório)" : ""}`}
                  aria-pressed={on}
                  className="cursor-pointer outline-none [&:focus-visible>circle.ring]:stroke-parchment"
                  onClick={() => { if (moved.current <= 4) onSelect(p); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(p); } }}
                >
                  <circle r={big ? 46 : 26} fill="var(--gold)" opacity={0.12} className="animate-flicker" />
                  <circle className="ring" r={big ? 34 : 18} fill="var(--obsidian)" stroke={on ? "var(--parchment)" : p.status === "provisório" ? "var(--sage)" : "var(--gold)"} strokeWidth={on ? 2.5 : 1.5} strokeDasharray={p.status === "provisório" ? "3 4" : undefined} />
                  <g className={on ? "text-parchment" : "text-gold"}><PlaceGlyph kind={p.kind} size={big ? 30 : 16} /></g>
                  <text y={big ? 62 : 38} textAnchor="middle" fontSize={big ? 20 : 14} fill="var(--parchment)" className="font-display" style={{ paintOrder: "stroke", stroke: "var(--obsidian)", strokeWidth: 4 }}>{p.name}</text>
                  {p.map && <text y={big ? 82 : 54} textAnchor="middle" fontSize={10} fill="var(--gold)" letterSpacing={2}>EXPLORÁVEL</text>}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="absolute bottom-3 left-3 flex flex-col gap-1">
        <button className={btn} aria-label="Aproximar" onClick={() => zoomAt(W / 2, H / 2, t.k * 1.3)}><Plus size={16} /></button>
        <button className={btn} aria-label="Afastar" onClick={() => zoomAt(W / 2, H / 2, t.k / 1.3)}><Minus size={16} /></button>
        <button className={btn} aria-label="Recentralizar" onClick={() => setT({ x: 0, y: 0, k: 1 })}><LocateFixed size={16} /></button>
      </div>
    </div>
  );
}
