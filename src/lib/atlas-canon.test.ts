import { describe, expect, it } from "vitest";
import { atlasPlaceLocation } from "./atlas-canon";

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
  ])("resolve %s para o marcador correto", (id, expected) => {
    expect(atlasPlaceLocation(id)).toEqual(expected);
  });

  it("não inventa um marcador para lugares sem mapeamento", () => {
    expect(atlasPlaceLocation("lugar-ainda-nao-cartografado")).toBeUndefined();
  });
});
