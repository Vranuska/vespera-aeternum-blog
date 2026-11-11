import index from "@/data/bestiary-fallback.json";

export type BestiaryRecord = (typeof index.entries)[number];

/** Full dossiers exist only when the canonical archive has opened a record. */
export function bestiaryRecordById(id: string): BestiaryRecord | undefined {
  return index.entries.find((entry) => entry.id === id);
}

/** Images remain in the canonical literary repository; no third-party assets. */
export function bestiaryAsset(src: string): string {
  return "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/" + src.replace(/^\/+/, "");
}
