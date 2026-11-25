import { describe, expect, it } from "vitest";
import { atlasPlaceLocation, enrichAtlasPlace } from "./atlas-canon";
import { MAPS } from "@/data/atlas";

describe("atlasPlaceLocation", () => {
  it.each([
    ["casa-de-pedra-do-lago", { mapa: "mortais", local: "lago" }],
    ["aldeia-de-padre-tomas", { mapa: "mortais", local: "aldeia" }],
    ["biblioteca-dos-registros-velados", { mapa: "firmamentos", local: "setimo" }],
    ["jardins-da-primeira-manha", { mapa: "firmamentos", local: "jardins-manha" }],
    ["palacio-das-setecentas-janelas", { mapa: "firmamentos", local: "terceiro" }],
    ["taberna-infernal", { mapa: "infernos", local: "taberna" }],
    ["corte-das-cinzas", { mapa: "infernos", local: "corte-cinzas" }],
    ["pasaje-de-la-calandria", { mapa: "mortais", local: "pasaje-calandria" }],
    ["otaru-porto-de-otaru", { mapa: "mortais", local: "otaru" }],
    ["jardim-das-coisas-esquecidas", { mapa: "entre", local: "jardim" }],
    ["cidade-velha-de-lamu", { mapa: "mortais", local: "lamu" }],
  ])("resolve %s para o marcador correto", (id, expected) => {
    expect(atlasPlaceLocation(id)).toEqual(expected);
  });

  it("enriquece o jardim existente com a ficha e as fontes históricas", () => {
    const marker = MAPS.entre.places.find((place) => place.id === "jardim")!;
    const place = enrichAtlasPlace("entre", marker);
    expect(place.works).toContain("2026-11-23-a-feira-nao-perguntou-meu-nome");
    expect(place.historicalSources?.some((source) => source.url.includes("ba.gov.br"))).toBe(true);
  });

  it("enriquece a Cidade Velha de Lamu sem inventar coordenadas ou um edifício", () => {
    const marker = MAPS.mortais.places.find((place) => place.id === "lamu")!;
    const place = enrichAtlasPlace("mortais", marker);
    expect(place.works).toEqual(["2026-11-25-a-sala-dos-onze-minutos", "2026-11-25-caderno-de-marcha"]);
    expect(place.historicalSources?.some((source) => source.url === "https://whc.unesco.org/en/list/1055/")).toBe(true);
    expect(place.laws?.some((law) => law.includes("não representa coordenadas geográficas"))).toBe(true);
    expect(atlasPlaceLocation("cidade-velha-de-lamu")).toEqual({ mapa: "mortais", local: "lamu" });
  });

  it("não inventa um marcador para lugares sem mapeamento", () => {
    expect(atlasPlaceLocation("lugar-ainda-nao-cartografado")).toBeUndefined();
  });
});
