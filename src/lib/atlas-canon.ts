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

/** Resolve uma referência canônica de lugar para o marcador navegável no mapa React. */
export function atlasPlaceLocation(canonicalId: string): { mapa: string; local: string } | undefined {
  const match = Object.entries(CANONICAL_IDS).find(([, id]) => id === canonicalId);
  if (!match) return undefined;
  const [mapa, local] = match[0].split(":");
  return mapa && local ? { mapa, local } : undefined;
}

type CanonPlace = {
  id: string; name: string; image?: string; image_alt?: string; status_label?: string; subregion?: string;
  history?: string[]; laws?: string[]; inhabitants?: string[]; source_entry_ids?: string[];
  connections: { label: string; route: string }[];
};

const assetUrl = (path: string) => RAW_ARCHIVE + path.replace(/^\/+/, "");

function mergeUnique(first?: string[], second?: string[]) {
  const values = [...(first ?? [])];
  for (const value of second ?? []) if (!values.includes(value)) values.push(value);
  return values.length ? values : undefined;
}

function optional<K extends string>(key: K, value: string[] | undefined) {
  return (value ? { [key]: value } : {}) as Partial<Record<K, string[]>>;
}

/**
 * Keeps the app's interactive map geometry while enriching each matched place
 * with the author's canonical image, history, laws, inhabitants and references.
 * No map, route or location is inferred from a mention alone.
 */
export function enrichAtlasPlace(mapId: string, place: Place): Place {
  const canonicalId = CANONICAL_IDS[mapId + ":" + place.id];
  const source = (canonicalAtlas.places as unknown as CanonPlace[]).find((item) => item.id === canonicalId);
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
    ...optional("history", mergeUnique(place.history, source.history)),
    ...optional("laws", mergeUnique(place.laws, source.laws)),
    ...optional("inhabitants", mergeUnique(place.inhabitants, source.inhabitants)),
    ...optional("works", mergeUnique(place.works, source.source_entry_ids)),
    references: source.connections.map((connection) => ({
      label: connection.label,
      route: connection.route,
    })),
  };
}