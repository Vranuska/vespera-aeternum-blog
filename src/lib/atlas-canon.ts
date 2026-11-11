import canonicalAtlas from "@/data/atlas-fallback.json";
import type { Place } from "@/data/atlas";

const RAW_ARCHIVE = "https://raw.githubusercontent.com/Vranuska/vespera-aeternum/main/";

const CANONICAL_IDS: Record<string, string> = {
  "mortais:lago": "casa-de-pedra-do-lago",
  "mortais:aldeia": "aldeia-de-padre-tomas",
  "firmamentos:setimo": "biblioteca-dos-registros-velados",
  "firmamentos:jardins-manha": "jardins-da-primeira-manha",
  "firmamentos:terceiro": "palacio-das-setecentas-janelas",
  "infernos:taberna": "taberna-infernal",
  "infernos:corte-cinzas": "corte-das-cinzas",
  "mortais:pasaje-calandria": "pasaje-de-la-calandria",
};

const assetUrl = (path: string) => RAW_ARCHIVE + path.replace(/^\/+/, "");

function mergeUnique(first?: string[], second?: string[]) {
  const values = [...(first ?? [])];
  for (const value of second ?? []) if (!values.includes(value)) values.push(value);
  return values.length ? values : undefined;
}

/**
 * Keeps the app's interactive map geometry while enriching each matched place
 * with the author's canonical image, history, laws, inhabitants and references.
 * No map, route or location is inferred from a mention alone.
 */
export function enrichAtlasPlace(mapId: string, place: Place): Place {
  const canonicalId = CANONICAL_IDS[mapId + ":" + place.id];
  const source = canonicalAtlas.places.find((item) => item.id === canonicalId);
  if (!source) return place;

  const image = place.image ?? (source.image
    ? {
        src: assetUrl(source.image),
        alt: source.image_alt ?? source.name,
        caption: [source.status_label, source.subregion].filter(Boolean).join(" · "),
      }
    : undefined);

  return {
    ...place,
    ...(image ? { image } : {}),
    history: mergeUnique(place.history, source.history),
    laws: mergeUnique(place.laws, source.laws),
    inhabitants: mergeUnique(place.inhabitants, source.inhabitants),
    works: mergeUnique(place.works, source.source_entry_ids),
    references: source.connections.map((connection) => ({
      label: connection.label,
      route: connection.route,
    })),
  };
}
