import { describe, it, expect } from "vitest";
import { MAPS, ROOT_MAP, findPlace } from "@/data/atlas";
import { enrichAtlasPlace } from "@/lib/atlas-canon";
import canonicalAtlas from "@/data/atlas-fallback.json";
import entries from "@/data/entries-fallback.json";

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

  it("enriquece lugares com imagens, história e referências do Atlas canônico", () => {
    const lake = enrichAtlasPlace("mortais", findPlace("mortais", "lago")!);
    expect(lake.image?.src).toBe(
      "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/assets/bestiario/eithne-retrato.svg",
    );
    expect(lake.history).toContain(
      "Eithne morava numa casa de pedra à beira de um lago. Do outro lado da água vivia uma família de sete pessoas, acompanhada por ela durante décadas.",
    );
    expect(lake.references?.map((item) => item.route)).toEqual(
      expect.arrayContaining(["bestiario/eithne", "conto:bestiario-eithne-v1"]),
    );

    const pasaje = enrichAtlasPlace("mortais", findPlace("mortais", "pasaje-calandria")!);
    expect(pasaje.image).toBeUndefined();
    expect(pasaje.references?.map((item) => item.route)).toContain(
      "conto:2026-11-09-a-rua-que-cabia-na-margem",
    );
    expect(pasaje.laws).toContain(
      "A porta do fundo deve permanecer fechada até que outro manuscrito estabeleça as condições de acesso.",
    );
  });

  it("apresenta as sete pranchas canônicas sem criar imagem para o Pasaje", () => {
    const illustrated = [
      ["mortais", "lago"],
      ["mortais", "aldeia"],
      ["firmamentos", "setimo"],
      ["firmamentos", "jardins-manha"],
      ["firmamentos", "terceiro"],
      ["infernos", "taberna"],
      ["infernos", "corte-cinzas"],
    ] as const;
    for (const [mapId, placeId] of illustrated) {
      expect(enrichAtlasPlace(mapId, findPlace(mapId, placeId)!).image?.src)
        .toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
    }
    expect(enrichAtlasPlace("mortais", findPlace("mortais", "pasaje-calandria")!).image)
      .toBeUndefined();
  });

  it("mantém as referências de contos ligadas a manuscritos existentes", () => {
    const ids = new Set(entries.map((entry) => entry.id));
    const references = canonicalAtlas.places
      .flatMap((place) => place.connections)
      .map((connection) => connection.route)
      .filter((route) => route.startsWith("conto:"))
      .map((route) => route.slice("conto:".length));
    expect(references.every((id) => ids.has(id))).toBe(true);
    expect(canonicalAtlas.places.filter((place) => place.image)).toHaveLength(7);
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