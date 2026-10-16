import { createFileRoute } from "@tanstack/react-router";
import { Forthcoming } from "@/components/vespera/Forthcoming";

export const Route = createFileRoute("/bestiario")({
  head: () => ({
    meta: [
      { title: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { name: "description", content: "Fichas dos personagens do universo de Vespera." },
      { property: "og:title", content: "O Bestiário dos Conhecidos — Vespera Aeternum" },
      { property: "og:description", content: "Fichas dos personagens do universo de Vespera." },
    ],
  }),
  component: () => (
    <Forthcoming kicker="Fichas e retratos" title="O Bestiário" accent="dos Conhecidos" text="Vespera, seu irmão, a menina do sapato vermelho, o reflexo, o anjo — cada um terá sua ficha, escrita a partir dos textos originais." />
  ),
});
