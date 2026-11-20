import { describe, it, expect } from "vitest";
import { MAPS, ROOT_MAP, findPlace } from "@/data/atlas";
import { atlasPlaceLocation, enrichAtlasPlace } from "@/lib/atlas-canon";
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
    expect(pasaje.image?.src).toBe("https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/assets/atlas/pasaje-calandria.svg");
    expect(pasaje.image?.alt).toContain("corredor");
    expect(pasaje.image?.caption).toContain("Reconstituição ilustrativa");
    expect(pasaje.references?.map((item) => item.route)).toContain(
      "conto:2026-11-09-a-rua-que-cabia-na-margem",
    );
    expect(pasaje.laws).toContain(
      "A porta do fundo deve permanecer fechada até que outro manuscrito estabeleça as condições de acesso.",
    );

    const otaru = enrichAtlasPlace("mortais", findPlace("mortais", "otaru")!);
    expect(otaru.image?.src).toBe("https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/assets/atlas/otaru-porto-1921.svg");
    expect(otaru.image?.alt).toContain("barcaça");
    expect(otaru.history?.some((item) => item.includes("novembro de 1921"))).toBe(true);

    const oficina = enrichAtlasPlace("mortais", findPlace("mortais", "oficina-calado")!);
    expect(oficina.image?.src).toBe("https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/assets/atlas/oficina-augusto-calado.svg");
    expect(oficina.image?.caption).toContain("Reconstituição ilustrativa");
    expect(oficina.image?.caption).toContain("Alcântara, Lisboa");
    expect(oficina.history).toContain("Em janeiro de 1944, a oficina de Augusto Calado ocupava o rés do chão de um prédio em Alcântara. A rua e o número não são informados.");
    expect(oficina.laws).toContain("A oficina e a sapataria de Palmira Sequeira são estabelecimentos distintos; a tabuleta foi pintada na oficina e instalada na fachada da sapataria.");
    expect(oficina.references?.map((item) => item.route)).toEqual(
      expect.arrayContaining([
        "conto:2026-10-31-a-tinta-do-lado-de-fora",
        "conto:2026-11-15-o-endereco-no-verso",
      ]),
    );
    expect(atlasPlaceLocation("oficina-augusto-calado")).toEqual({ mapa: "mortais", local: "oficina-calado" });
  });

  it("apresenta as onze pranchas canônicas, incluindo Otaru, Hakodate, o Pasaje e a oficina de Alcântara", () => {
    const illustrated = [
      ["mortais", "lago"],
      ["mortais", "aldeia"],
      ["firmamentos", "setimo"],
      ["firmamentos", "jardins-manha"],
      ["firmamentos", "terceiro"],
      ["infernos", "taberna"],
      ["infernos", "corte-cinzas"],
      ["mortais", "pasaje-calandria"],
      ["mortais", "otaru"],
      ["mortais", "oficina-calado"],
      ["mortais", "hakodate"],
    ] as const;
    for (const [mapId, placeId] of illustrated) {
      expect(enrichAtlasPlace(mapId, findPlace(mapId, placeId)!).image?.src)
        .toMatch(/^https:\/\/raw\.githubusercontent\.com\//);
    }
    expect(enrichAtlasPlace("mortais", findPlace("mortais", "pasaje-calandria")!).image?.caption)
      .toContain("Reconstituição ilustrativa");
  });

  it("mantém as referências de contos ligadas a manuscritos existentes", () => {
    const ids = new Set(entries.map((entry) => entry.id));
    const references = canonicalAtlas.places
      .flatMap((place) => place.connections)
      .map((connection) => connection.route)
      .filter((route) => route.startsWith("conto:"))
      .map((route) => route.slice("conto:".length));
    expect(references.every((id) => ids.has(id))).toBe(true);
    expect(canonicalAtlas.places.filter((place) => place.image)).toHaveLength(10);
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