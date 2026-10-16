import { createFileRoute } from "@tanstack/react-router";
import { Forthcoming } from "@/components/vespera/Forthcoming";

export const Route = createFileRoute("/atlas")({
  head: () => ({
    meta: [
      { title: "Atlas do Impossível — Vespera Aeternum" },
      { name: "description", content: "Lugares ficcionais e cronologia narrativa do universo de Vespera." },
      { property: "og:title", content: "Atlas do Impossível — Vespera Aeternum" },
      { property: "og:description", content: "Lugares ficcionais e cronologia narrativa do universo de Vespera." },
    ],
  }),
  component: () => (
    <Forthcoming kicker="Lugares e cronologias" title="Atlas do" accent="Impossível" text="O jardim, o Palácio das Setecentas Janelas e os demais cenários — com a cronologia dos acontecimentos separada das datas de publicação." />
  ),
});
