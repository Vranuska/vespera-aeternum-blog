import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery, bookWorks } from "@/lib/works";
import { EDITORIAL_ORDER } from "@/data/reading-order";
import { ArchiveStatus } from "@/components/vespera/ArchiveStatus";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import { WorkRow } from "@/components/vespera/WorkCard";
import { Ornament } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/diarios/")({
  validateSearch: (s: Record<string, unknown>): { modo?: "livro" | undefined } => ({ modo: s["modo"] === "livro" ? "livro" : undefined }),
  head: () => ({
    meta: [
      { title: "Os Diários — Vespera Aeternum" },
      { name: "description", content: "As entradas de diário de Vespera, em ordem de publicação." },
      { property: "og:title", content: "Os Diários — Vespera Aeternum" },
      { property: "og:description", content: "As entradas de diário de Vespera, em ordem de publicação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Diaries,
});

function Diaries() {
  const { data } = useSuspenseQuery(worksQuery);
  const { modo } = Route.useSearch();
  const book = modo === "livro";
  const sequence = book ? bookWorks(data) : data;
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <ArchiveStatus works={data} />
      <p className="label-archive text-gold">Leitor literário</p>
      <h1 className="mt-3 font-display text-6xl font-light text-parchment md:text-8xl">Os <em className="text-rose">Diários</em></h1>
      <Ornament className="mt-10" />
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Ordem de leitura">
        <Button asChild variant={book ? "outline" : "secondary"}><Link to="/diarios" search={{ modo: undefined }} aria-current={!book ? "page" : undefined}><Clock /> Cronologia</Link></Button>
        <Button asChild variant={book ? "secondary" : "outline"}><Link to="/diarios" search={{ modo: "livro" }} aria-current={book ? "page" : undefined}><BookOpen /> Ler como livro</Link></Button>
      </div>
      {book && EDITORIAL_ORDER.length === 0 && <p className="mt-5 text-sm italic text-rose">Ordem editorial ainda não definida pela autora. Índice por título; sequências de séries apenas quando declaradas no arquivo.</p>}
      {book && sequence[0] && <Button asChild variant="link" className="mt-3 px-0 text-gold"><Link to="/diarios/$id" params={{ id: sequence[0].id }} search={{ modo: "livro" }}>Abrir primeira obra →</Link></Button>}
      <div className="mt-10">{sequence.map((w) => <WorkRow key={w.id} work={w} book={book} />)}</div>
    </div>
  );
}