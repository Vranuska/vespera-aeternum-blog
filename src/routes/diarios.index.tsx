import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { worksQuery } from "@/lib/works";
import { WorkRow } from "@/components/vespera/WorkCard";
import { Ornament } from "@/components/vespera/Ornament";

export const Route = createFileRoute("/diarios/")({
  head: () => ({
    meta: [
      { title: "Os Diários — Vespera Aeternum" },
      { name: "description", content: "As entradas de diário de Vespera, em ordem de publicação." },
      { property: "og:title", content: "Os Diários — Vespera Aeternum" },
      { property: "og:description", content: "As entradas de diário de Vespera, em ordem de publicação." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(worksQuery),
  component: Diaries,
});

function Diaries() {
  const { data } = useSuspenseQuery(worksQuery);
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="label-archive text-gold">Leitor literário</p>
      <h1 className="mt-3 font-display text-6xl font-light text-parchment md:text-8xl">Os <em className="text-rose">Diários</em></h1>
      <Ornament className="mt-10" />
      <div className="mt-10">{data.map((w) => <WorkRow key={w.id} work={w} />)}</div>
    </div>
  );
}
