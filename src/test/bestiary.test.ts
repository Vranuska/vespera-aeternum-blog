import { describe, expect, it } from "vitest";
import { bestiaryAsset, bestiaryRecordById } from "@/lib/bestiary";
import canonical from "@/data/bestiary-fallback.json";

describe("Dossiês canônicos do Bestiário", () => {
  it("abre a ficha completa de Eithne a partir do registro canônico", () => {
    const eithne = bestiaryRecordById("eithne");
    expect(eithne).toBeDefined();
    expect(eithne?.status).toBe("canon");
    expect(eithne?.main_image.src).toBe("assets/bestiario/eithne-retrato.svg");
    expect(eithne?.biography).toHaveLength(5);
    expect(eithne?.abilities).toHaveLength(3);
    expect(eithne?.known_limits.length).toBeGreaterThan(0);
    expect(eithne?.chronology).toHaveLength(6);
    expect(eithne?.gallery).toHaveLength(2);
    expect(eithne?.quotations).toHaveLength(4);
    expect(eithne?.connections).toHaveLength(3);
  });

  it("abre o dossiê de Azrakhel com aparições documentadas e sem poderes presumidos", () => {
    const azrakhel = bestiaryRecordById("azrakhel");
    expect(azrakhel).toBeDefined();
    expect(azrakhel?.status).toBe("canon");
    expect(azrakhel?.main_image.src).toBe("assets/bestiario/azrakhel-retrato.svg");
    expect(azrakhel?.gallery.map((item) => item.src)).toEqual([
      "assets/bestiario/azrakhel-entrada.svg",
      "assets/bestiario/azrakhel-eva-prova.svg",
    ]);
    expect(azrakhel?.abilities.map((item) => item.title)).toEqual(["Empunhadura e uso de arma branca"]);
    expect(azrakhel?.known_limits.some((item) => item.includes("Nenhum manuscrito estabelece controle do fogo"))).toBe(true);
    expect(azrakhel?.connections.find((item) => item.name === "Eva")?.detail).toContain("reflexo de Vespera");
    expect(canonical.mentions.some((item) => item.name === "Azrakhel")).toBe(false);
  });

  it("não transforma personagens apenas mencionados em fichas completas", () => {
    expect(bestiaryRecordById("ithariel")).toBeUndefined();
    expect(canonical.mentions.find((item) => item.name === "Ithariel")?.status)
      .toContain("ficha própria ainda não aberta");
  });

  it("resolve imagens exclusivamente do arquivo literário canônico", () => {
    expect(bestiaryAsset("assets/bestiario/eithne-lamento.svg")).toBe(
      "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/assets/bestiario/eithne-lamento.svg",
    );
  });
});
