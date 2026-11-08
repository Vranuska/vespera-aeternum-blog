import { describe, it, expect } from "vitest";
import { MAPS, ROOT_MAP, findPlace } from "@/data/atlas";

describe("Atlas — cosmologia do Entre", () => {
  it("registra Umbra e Sonhar como domínios confirmados e selecionáveis na raiz", () => {
    const root = MAPS[ROOT_MAP];
    expect(root).toBeDefined();
    const umbra = findPlace(ROOT_MAP, "umbra");
    const sonhar = findPlace(ROOT_MAP, "sonhar");
    expect(umbra?.status).toBe("confirmado");
    expect(sonhar?.status).toBe("confirmado");
    // Selecionáveis: presentes na lista de lugares do mapa raiz.
    expect(root!.places.map((p) => p.id)).toEqual(expect.arrayContaining(["umbra", "sonhar"]));
  });

  it("não aponta Umbra nem Sonhar para mapas internos inventados", () => {
    expect(findPlace(ROOT_MAP, "umbra")?.map).toBeUndefined();
    expect(findPlace(ROOT_MAP, "sonhar")?.map).toBeUndefined();
    expect(MAPS["umbra"]).toBeUndefined();
    expect(MAPS["sonhar"]).toBeUndefined();
  });

  it("não cartografa Mage: The Ascension como plano ou território", () => {
    const allPlaces = Object.values(MAPS).flatMap((m) => m.places);
    expect(allPlaces.some((p) => /mage|ascension/i.test(p.id) || /mage|ascension/i.test(p.name))).toBe(false);
    expect(Object.keys(MAPS).some((k) => /mage|ascension/i.test(k))).toBe(false);
  });

  it("mantém o Entre como plano confirmado com mapa de detalhe próprio", () => {
    const entre = findPlace(ROOT_MAP, "entre");
    expect(entre?.status).toBe("confirmado");
    expect(entre?.map).toBe("entre");
    expect(MAPS["entre"]).toBeDefined();
  });
});