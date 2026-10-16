import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Ornament } from "./Ornament";

const NAV = [
  { to: "/biblioteca", label: "Bibliotheca Noctis" },
  { to: "/diarios", label: "Os Diários" },
  { to: "/bestiario", label: "Bestiário" },
  { to: "/atlas", label: "Atlas" },
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(localStorage.getItem("vespera-reduce-motion") === "1");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);
  const toggle = () =>
    setReduced((r) => {
      localStorage.setItem("vespera-reduce-motion", r ? "0" : "1");
      return !r;
    });
  return { reduced, toggle };
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { reduced, toggle } = useReducedMotion();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-xl tracking-[0.3em] text-parchment" onClick={() => setOpen(false)}>
          VESPERA<span className="text-gold"> · </span>AETERNUM
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="label-archive text-rose transition-colors hover:text-parchment"
              activeProps={{ className: "text-gold" }}
            >
              {n.label}
            </Link>
          ))}
          <button onClick={toggle} className="label-archive text-sage hover:text-rose" aria-pressed={reduced}>
            {reduced ? "Animações: off" : "Reduzir animações"}
          </button>
        </nav>
        <button className="text-parchment lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border px-5 pb-8 pt-4 lg:hidden" aria-label="Principal móvel">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block border-b border-border py-4 font-display text-2xl text-parchment">
              {n.label}
            </Link>
          ))}
          <button onClick={toggle} className="label-archive mt-6 text-sage" aria-pressed={reduced}>
            {reduced ? "Animações desligadas" : "Reduzir animações"}
          </button>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border px-5 py-16 text-center">
      <Ornament />
      <p className="mt-8 font-display text-3xl italic text-rose">Vespera Aeternum</p>
      <p className="label-archive mt-4 text-sage">Arquivo de manuscritos · memórias · mitologias</p>
      <p className="mt-6 text-sm italic text-sage">
        Os textos pertencem ao arquivo original de Vespera e são lidos diretamente dele.
      </p>
    </footer>
  );
}
