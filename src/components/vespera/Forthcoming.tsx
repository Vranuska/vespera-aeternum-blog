import { Link } from "@tanstack/react-router";
import { StarSigil } from "./Ornament";

export function Forthcoming({ kicker, title, accent, text }: { kicker: string; title: string; accent: string; text: string }) {
  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden px-5 py-32 text-center">
      <StarSigil className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 text-gold/10 animate-spin-slow" />
      <p className="label-archive relative text-gold">{kicker}</p>
      <h1 className="relative mt-4 font-display text-6xl font-light text-parchment md:text-8xl">
        {title} <em className="text-rose">{accent}</em>
      </h1>
      <p className="relative mx-auto mt-8 max-w-lg text-xl italic text-parchment/80">{text}</p>
      <p className="label-archive relative mt-10 text-sage">Em preparação · próxima etapa</p>
      <Link to="/biblioteca" className="label-archive relative mt-8 inline-block border border-gold px-6 py-3 text-parchment hover:bg-wine">
        Enquanto isso, ler o arquivo
      </Link>
    </div>
  );
}
