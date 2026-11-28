import { describe, expect, it } from "vitest";
import { atlasDiaryEntryId, atlasPlaceLocation, enrichAtlasPlace } from "./atlas-canon";
import { MAPS } from "@/data/atlas";

describe("atlasDiaryEntryId", () => {
  it.each([
    ["conto:2026-11-28-a-letra-de-hideo", "2026-11-28-a-letra-de-hideo"],
    ["documento:2026-11-28-folha-de-treino-de-hideo", "2026-11-28-folha-de-treino-de-hideo"],
  ])("resolve %s para o leitor de manuscritos", (route, id) => {
    expect(atlasDiaryEntryId(route)).toBe(id);
  });

  it("não reinterpreta referências de outras seções", () => {
    expect(atlasDiaryEntryId("bestiario/eithne")).toBeUndefined();
    expect(atlasDiaryEntryId("atlas/entre")).toBeUndefined();
  });
});

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
    expect(place.laws?.some((law) => /não representa coordenadas geográficas/i.test(law))).toBe(true);
    expect(atlasPlaceLocation("cidade-velha-de-lamu")).toEqual({ mapa: "mortais", local: "lamu" });
  });

  it("documenta Otaru com fontes públicas e mantém os limites da ficha", () => {
    const marker = MAPS.mortais.places.find((place) => place.id === "otaru")!;
    const place = enrichAtlasPlace("mortais", marker);
    expect(place.works).toEqual([
      "2026-11-10-a-mare-nao-assina-recibos",
      "2026-11-28-a-letra-de-hideo",
      "2026-11-28-folha-de-treino-de-hideo",
    ]);
    expect(place.historicalSources?.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://www.city.otaru.lg.jp/docs/2020120700886/",
        "https://www.mlit.go.jp/tagengo-db/en/R5-00045.html",
      ]),
    );
    expect(place.history?.some((item) => /1914/.test(item) && /1923/.test(item))).toBe(true);
    expect(place.laws?.some((law) => /posição no mapa permanece simbólica/i.test(law))).toBe(true);
  });

  it("não inventa um marcador para lugares sem mapeamento", () => {
    expect(atlasPlaceLocation("lugar-ainda-nao-cartografado")).toBeUndefined();
  });
});
