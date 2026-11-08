import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { readerNavigation } from "@/lib/works";

export function BookNavigation({ navigation, location }: {
  navigation: ReturnType<typeof readerNavigation>;
  location: "início" | "fim";
}) {
  const { previous, next, position, total } = navigation;
  return (
    <nav aria-label={`Navegação do livro — ${location}`} className="w-full border-y border-border py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="link" className="h-auto px-0 text-gold">
          <Link to="/diarios" search={{ modo: "livro" }}><List /> Índice do livro</Link>
        </Button>
        <span className="label-archive text-rose" aria-live="polite">Obra {position + 1} de {total}</span>
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6">
        {previous ? (
          <Button asChild variant="outline" className="group h-auto min-h-24 min-w-0 items-start justify-start whitespace-normal px-3 py-4 sm:px-5">
            <Link to="/diarios/$id" params={{ id: previous.id }} search={{ modo: "livro" }} rel="prev" aria-label={`Obra anterior: ${previous.title}`}>
              <ArrowLeft className="mt-1" />
              <span className="min-w-0 text-left"><span className="label-archive block text-gold">Obra anterior</span><span className="mt-2 block break-words font-display text-lg leading-snug text-parchment sm:text-xl">{previous.title}</span></span>
            </Link>
          </Button>
        ) : <Button variant="outline" disabled className="h-auto min-h-24 whitespace-normal px-3 py-4"><ArrowLeft /> Início do livro</Button>}
        {next ? (
          <Button asChild variant="outline" className="group h-auto min-h-24 min-w-0 items-start justify-end whitespace-normal px-3 py-4 sm:px-5">
            <Link to="/diarios/$id" params={{ id: next.id }} search={{ modo: "livro" }} rel="next" aria-label={`Próxima obra: ${next.title}`}>
              <span className="min-w-0 text-right"><span className="label-archive block text-gold">Próxima obra</span><span className="mt-2 block break-words font-display text-lg leading-snug text-parchment sm:text-xl">{next.title}</span></span>
              <ArrowRight className="mt-1" />
            </Link>
          </Button>
        ) : <Button variant="outline" disabled className="h-auto min-h-24 whitespace-normal px-3 py-4">Fim do livro <ArrowRight /></Button>}
      </div>
    </nav>
  );
}