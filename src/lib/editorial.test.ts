import { describe, expect, it } from "vitest";
import { buildEras, OUTSIDE, type EditorialIndex } from "./editorial";

const sampleIndex: EditorialIndex = {
  chapters: [],
  chronology: [
    { entry_id: "a", title: "A", time: "1891-11-02", label: "2 de novembro de 1891", precision: "day" },
    { entry_id: "b", title: "B", time: "1891-11", label: "Novembro de 1891", precision: "month" },
    { entry_id: "c", title: "C", time: "1943-12", label: "Primeira semana de dezembro de 1943", precision: "week" },
  ],
  unplaced: [{ entry_id: "d", title: "D", publication_label: "Sem data" }],
  source: "fallback",
};

describe("buildEras", () => {
  it("preserves year, month, day and the precision of each record", () => {
    const { eras, missing } = buildEras(sampleIndex, new Set(["a", "b", "c", "d"]));

    expect(missing).toEqual([]);
    expect(eras.map((era) => era.key)).toEqual(["1891", "1943", OUTSIDE]);
    expect(eras[0]?.months[0]?.entries[0]).toMatchObject({
      id: "a",
      time: "1891-11-02",
      precision: "day",
    });
    expect(eras[0]?.months[0]?.entries[1]).toMatchObject({
      id: "b",
      time: "1891-11",
      precision: "month",
    });
    expect(eras[1]?.months[0]?.entries[0]).toMatchObject({
      id: "c",
      precision: "week",
    });
  });

  it("keeps unplaced works separate and reports missing IDs", () => {
    const { eras, missing } = buildEras(sampleIndex, new Set(["a", "b", "d"]));

    expect(missing).toEqual(["c"]);
    expect(eras.at(-1)?.key).toBe(OUTSIDE);
    expect(eras.at(-1)?.months[0]?.entries[0]?.id).toBe("d");
  });
});
