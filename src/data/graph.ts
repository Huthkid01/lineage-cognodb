/**
 * Fictional but realistic 20th-century modernist provenance graph.
 * Names and works are invented so the seed is copyright-clean while
 * still modelling the kinds of paths collections teams actually walk:
 * ownership, loans, exhibitions, dealers, restorers, and workshops.
 */

export type SeedArtist = {
  id: string;
  name: string;
  born: number;
  died: number | null;
  nationality: string;
  movement: string;
};

export type SeedArtwork = {
  id: string;
  title: string;
  year: number;
  medium: string;
  palette: string;
  artistId: string;
  disputed: boolean;
  notes: string;
};

export type SeedInstitution = {
  id: string;
  name: string;
  city: string;
  country: string;
  kind: "museum" | "gallery" | "foundation";
};

export type SeedPerson = {
  id: string;
  name: string;
  role: "dealer" | "restorer" | "collector" | "curator";
  city: string;
};

export type SeedExhibition = {
  id: string;
  name: string;
  year: number;
  city: string;
};

export const artists: SeedArtist[] = [
  { id: "a-voss", name: "Lina Voss", born: 1899, died: 1974, nationality: "German", movement: "Constructed colour" },
  { id: "a-mbeki", name: "Thandi Mbeki", born: 1912, died: 1988, nationality: "South African", movement: "Constructed colour" },
  { id: "a-okada", name: "Hiroshi Okada", born: 1904, died: 1981, nationality: "Japanese", movement: "Ink modernism" },
  { id: "a-berg", name: "Sigrid Berg", born: 1908, died: 1996, nationality: "Norwegian", movement: "Nordic lyric" },
  { id: "a-duran", name: "Mateo Durán", born: 1915, died: 2001, nationality: "Spanish", movement: "Iberian geometry" },
  { id: "a-kline", name: "Ruth Kline", born: 1921, died: 2009, nationality: "American", movement: "Hard-edge" },
  { id: "a-nassar", name: "Yusuf Nassar", born: 1901, died: 1967, nationality: "Lebanese", movement: "Levantine modern" },
  { id: "a-holm", name: "Erik Holm", born: 1894, died: 1962, nationality: "Danish", movement: "Nordic lyric" },
  { id: "a-adele", name: "Adèle Marchand", born: 1918, died: 2010, nationality: "French", movement: "Tachisme" },
  { id: "a-ito", name: "Keiko Ito", born: 1926, died: 2018, nationality: "Japanese", movement: "Ink modernism" },
];

export const artworks: SeedArtwork[] = [
  { id: "w-azure", title: "The Azure Recital", year: 1931, medium: "Oil on linen", palette: "#2c4f7c", artistId: "a-voss", disputed: true, notes: "Last documented in Hamburg 1938; reappeared via Helm Gallery in 1952 without a complete chain of title. Flagged as disputed." },
  { id: "w-oriel", title: "Oriel Window at Dusk", year: 1934, medium: "Oil on linen", palette: "#6b3a2a", artistId: "a-voss", disputed: false, notes: "Studio mate to The Azure Recital. Clean title after 1961 gift." },
  { id: "w-winter", title: "Winter Orchard", year: 1936, medium: "Oil on board", palette: "#c9b48b", artistId: "a-voss", disputed: false, notes: "Sold by the same dealer who handled the disputed Recital." },
  { id: "w-interval", title: "Red Interval", year: 1958, medium: "Acrylic on canvas", palette: "#9b2c2c", artistId: "a-kline", disputed: false, notes: "Shared a loan gallery with Winter Orchard in 1977." },
  { id: "w-harbor", title: "Harbor Light", year: 1964, medium: "Acrylic on canvas", palette: "#d9c27a", artistId: "a-kline", disputed: false, notes: "Restored by a workshop cousin of the Recital's restorer." },
  { id: "w-drift", title: "Cape Drift", year: 1947, medium: "Oil and sand", palette: "#b5834a", artistId: "a-mbeki", disputed: false, notes: "Key work of Mbeki's Cape Town years." },
  { id: "w-mine", title: "Mine Head at Night", year: 1951, medium: "Oil on canvas", palette: "#2f2a28", artistId: "a-mbeki", disputed: false, notes: "Exhibited alongside Okada in Rotterdam 1959." },
  { id: "w-ink", title: "Sixteen Bridges", year: 1955, medium: "Ink on paper", palette: "#1a1c18", artistId: "a-okada", disputed: false, notes: "Part of the 'harbour inks' series." },
  { id: "w-kites", title: "Kites over Nagasaki", year: 1961, medium: "Ink and gold", palette: "#8a6a22", artistId: "a-okada", disputed: false, notes: "Later inspired Ito's Folded Tide." },
  { id: "w-fjord", title: "Fjord Grammar", year: 1949, medium: "Oil on canvas", palette: "#3e5a4c", artistId: "a-berg", disputed: false, notes: "Oslo municipal purchase, 1953." },
  { id: "w-aurora", title: "Aurora Inventory", year: 1956, medium: "Oil on linen", palette: "#5b4a8a", artistId: "a-berg", disputed: false, notes: "Shown in the North Sea Circuit, 1962." },
  { id: "w-lattice", title: "Lattice for a Dry River", year: 1968, medium: "Enamel on aluminium", palette: "#c45c26", artistId: "a-duran", disputed: false, notes: "Geometry period; restored after a 1984 warehouse flood." },
  { id: "w-choir", title: "Choir of Angles", year: 1972, medium: "Enamel on aluminium", palette: "#e6d7b8", artistId: "a-duran", disputed: false, notes: "Gift of collector I. Pell to Musée Nord." },
  { id: "w-cedar", title: "Cedar and Radio", year: 1942, medium: "Oil on canvas", palette: "#4a5c3a", artistId: "a-nassar", disputed: false, notes: "Beirut studio; later in Edinburgh." },
  { id: "w-port", title: "Port of Letters", year: 1946, medium: "Oil on canvas", palette: "#7a4e3a", artistId: "a-nassar", disputed: true, notes: "Wartime gap in paperwork, 1943–1948. Partial restitution claim pending." },
  { id: "w-dune", title: "Dune Register", year: 1939, medium: "Oil on board", palette: "#d8c39a", artistId: "a-holm", disputed: false, notes: "Danish coast series." },
  { id: "w-net", title: "Net and Weather", year: 1948, medium: "Oil on canvas", palette: "#4d6a7c", artistId: "a-holm", disputed: false, notes: "Shown with Berg in the North Sea Circuit." },
  { id: "w-ash", title: "Ash Season", year: 1959, medium: "Oil on canvas", palette: "#6e6258", artistId: "a-adele", disputed: false, notes: "Paris years; dealer Helm's last major placement." },
  { id: "w-veil", title: "The Second Veil", year: 1966, medium: "Oil and charcoal", palette: "#3a2f3e", artistId: "a-adele", disputed: false, notes: "Restored by Marta Keene, 1991." },
  { id: "w-tide", title: "Folded Tide", year: 1978, medium: "Ink on washi", palette: "#8fa3a8", artistId: "a-ito", disputed: false, notes: "Explicit dialogue with Okada's Kites." },
  { id: "w-room", title: "A Room of Copper", year: 1983, medium: "Ink and mineral", palette: "#8c4a32", artistId: "a-ito", disputed: false, notes: "Foundation purchase, 1990." },
  { id: "w-signal", title: "Night Signal", year: 1969, medium: "Acrylic on canvas", palette: "#1e2a44", artistId: "a-kline", disputed: false, notes: "Hard-edge nocturnal series." },
  { id: "w-quarry", title: "Quarry Score", year: 1975, medium: "Enamel on aluminium", palette: "#7d7a6e", artistId: "a-duran", disputed: false, notes: "Loaned through three museums in one decade." },
  { id: "w-salt", title: "Salt Table", year: 1953, medium: "Oil and sand", palette: "#cfc4a8", artistId: "a-mbeki", disputed: false, notes: "Materials match Cape Drift; different dealer path." },
];

export const institutions: SeedInstitution[] = [
  { id: "i-nord", name: "Musée Nord", city: "Antwerp", country: "Belgium", kind: "museum" },
  { id: "i-harbor", name: "Harbor Kunsthalle", city: "Hamburg", country: "Germany", kind: "museum" },
  { id: "i-fjord", name: "Fjordmuseet", city: "Oslo", country: "Norway", kind: "museum" },
  { id: "i-leith", name: "Leith Modern", city: "Edinburgh", country: "United Kingdom", kind: "museum" },
  { id: "i-rot", name: "Havenhuis Collection", city: "Rotterdam", country: "Netherlands", kind: "museum" },
  { id: "i-helm", name: "Helm Gallery", city: "Zurich", country: "Switzerland", kind: "gallery" },
  { id: "i-sato", name: "Sato Rooms", city: "Kyoto", country: "Japan", kind: "gallery" },
  { id: "i-cape", name: "Atlantic Rooms", city: "Cape Town", country: "South Africa", kind: "gallery" },
  { id: "i-pell", name: "Pell Foundation", city: "Lisbon", country: "Portugal", kind: "foundation" },
  { id: "i-beirut", name: "Sursock Study Collection", city: "Beirut", country: "Lebanon", kind: "museum" },
  { id: "i-paris", name: "Atelier Marchand Trust", city: "Paris", country: "France", kind: "foundation" },
  { id: "i-cph", name: "Øresund Gallery", city: "Copenhagen", country: "Denmark", kind: "gallery" },
];

export const people: SeedPerson[] = [
  { id: "p-helm", name: "Klaus Helm", role: "dealer", city: "Zurich" },
  { id: "p-keene", name: "Marta Keene", role: "restorer", city: "Hamburg" },
  { id: "p-lang", name: "Josef Lang", role: "restorer", city: "Vienna" },
  { id: "p-crowe", name: "Elias Crowe", role: "restorer", city: "Edinburgh" },
  { id: "p-pell", name: "Inès Pell", role: "collector", city: "Lisbon" },
  { id: "p-nabil", name: "Nabil Faris", role: "dealer", city: "Beirut" },
  { id: "p-sato", name: "Aiko Sato", role: "dealer", city: "Kyoto" },
  { id: "p-brink", name: "Joanna Brink", role: "curator", city: "Rotterdam" },
  { id: "p-holm", name: "Søren Holm", role: "collector", city: "Copenhagen" },
  { id: "p-rada", name: "Rada Mikhailov", role: "restorer", city: "Antwerp" },
  { id: "p-owusu", name: "Kwame Owusu", role: "curator", city: "Cape Town" },
  { id: "p-vale", name: "Clara Vale", role: "dealer", city: "London" },
];

export const exhibitions: SeedExhibition[] = [
  { id: "e-north", name: "North Sea Circuit", year: 1962, city: "Oslo / Hamburg / Antwerp" },
  { id: "e-harbour", name: "Harbour Inks", year: 1959, city: "Rotterdam" },
  { id: "e-geometry", name: "Geometry after Drought", year: 1979, city: "Lisbon" },
  { id: "e-night", name: "Nocturnes", year: 1977, city: "Hamburg" },
  { id: "e-cape", name: "Atlantic Modern", year: 1968, city: "Cape Town" },
  { id: "e-fold", name: "Fold and Tide", year: 1986, city: "Kyoto" },
  { id: "e-restitution", name: "Gaps in the Record", year: 2014, city: "Edinburgh" },
];

export type SeedRel = {
  type: string;
  from: string;
  to: string;
  props?: Record<string, string | number | boolean>;
};

export const relationships: SeedRel[] = [
  // Created
  { type: "CREATED", from: "a-voss", to: "w-azure", props: { year: 1931 } },
  { type: "CREATED", from: "a-voss", to: "w-oriel", props: { year: 1934 } },
  { type: "CREATED", from: "a-voss", to: "w-winter", props: { year: 1936 } },
  { type: "CREATED", from: "a-kline", to: "w-interval", props: { year: 1958 } },
  { type: "CREATED", from: "a-kline", to: "w-harbor", props: { year: 1964 } },
  { type: "CREATED", from: "a-kline", to: "w-signal", props: { year: 1969 } },
  { type: "CREATED", from: "a-mbeki", to: "w-drift", props: { year: 1947 } },
  { type: "CREATED", from: "a-mbeki", to: "w-mine", props: { year: 1951 } },
  { type: "CREATED", from: "a-mbeki", to: "w-salt", props: { year: 1953 } },
  { type: "CREATED", from: "a-okada", to: "w-ink", props: { year: 1955 } },
  { type: "CREATED", from: "a-okada", to: "w-kites", props: { year: 1961 } },
  { type: "CREATED", from: "a-berg", to: "w-fjord", props: { year: 1949 } },
  { type: "CREATED", from: "a-berg", to: "w-aurora", props: { year: 1956 } },
  { type: "CREATED", from: "a-duran", to: "w-lattice", props: { year: 1968 } },
  { type: "CREATED", from: "a-duran", to: "w-choir", props: { year: 1972 } },
  { type: "CREATED", from: "a-duran", to: "w-quarry", props: { year: 1975 } },
  { type: "CREATED", from: "a-nassar", to: "w-cedar", props: { year: 1942 } },
  { type: "CREATED", from: "a-nassar", to: "w-port", props: { year: 1946 } },
  { type: "CREATED", from: "a-holm", to: "w-dune", props: { year: 1939 } },
  { type: "CREATED", from: "a-holm", to: "w-net", props: { year: 1948 } },
  { type: "CREATED", from: "a-adele", to: "w-ash", props: { year: 1959 } },
  { type: "CREATED", from: "a-adele", to: "w-veil", props: { year: 1966 } },
  { type: "CREATED", from: "a-ito", to: "w-tide", props: { year: 1978 } },
  { type: "CREATED", from: "a-ito", to: "w-room", props: { year: 1983 } },

  // Artist mentorship
  { type: "STUDIED_WITH", from: "a-ito", to: "a-okada", props: { year: 1958 } },
  { type: "STUDIED_WITH", from: "a-berg", to: "a-holm", props: { year: 1932 } },
  { type: "STUDIED_WITH", from: "a-kline", to: "a-voss", props: { year: 1949 } },
  { type: "STUDIED_WITH", from: "a-duran", to: "a-adele", props: { year: 1961 } },
  { type: "INSPIRED_BY", from: "w-tide", to: "w-kites" },
  { type: "INSPIRED_BY", from: "w-interval", to: "w-oriel" },
  { type: "INSPIRED_BY", from: "w-harbor", to: "w-net" },

  // Ownership chains — Azure Recital (disputed)
  { type: "OWNED_BY", from: "w-azure", to: "i-harbor", props: { from: 1932, to: 1938, mode: "purchase" } },
  { type: "DEALT", from: "p-helm", to: "w-azure", props: { year: 1952 } },
  { type: "OWNED_BY", from: "w-azure", to: "p-pell", props: { from: 1952, to: 1988, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-azure", to: "i-pell", props: { from: 1988, to: 2014, mode: "gift" } },
  { type: "OWNED_BY", from: "w-azure", to: "i-leith", props: { from: 2014, to: 2026, mode: "transfer" } },

  { type: "OWNED_BY", from: "w-oriel", to: "i-harbor", props: { from: 1935, to: 1961, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-oriel", to: "i-nord", props: { from: 1961, to: 2026, mode: "gift" } },

  { type: "DEALT", from: "p-helm", to: "w-winter", props: { year: 1954 } },
  { type: "OWNED_BY", from: "w-winter", to: "i-nord", props: { from: 1954, to: 2026, mode: "purchase" } },
  { type: "LOANED_TO", from: "w-winter", to: "i-harbor", props: { year: 1977 } },

  { type: "OWNED_BY", from: "w-interval", to: "i-harbor", props: { from: 1960, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-harbor", to: "i-leith", props: { from: 1966, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-signal", to: "i-nord", props: { from: 1971, to: 2026, mode: "purchase" } },

  { type: "OWNED_BY", from: "w-drift", to: "i-cape", props: { from: 1948, to: 1968, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-drift", to: "i-rot", props: { from: 1968, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-mine", to: "i-rot", props: { from: 1959, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-salt", to: "i-cape", props: { from: 1954, to: 2026, mode: "purchase" } },

  { type: "OWNED_BY", from: "w-ink", to: "i-rot", props: { from: 1959, to: 2026, mode: "purchase" } },
  { type: "DEALT", from: "p-sato", to: "w-kites", props: { year: 1963 } },
  { type: "OWNED_BY", from: "w-kites", to: "i-sato", props: { from: 1963, to: 1986, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-kites", to: "i-rot", props: { from: 1986, to: 2026, mode: "purchase" } },

  { type: "OWNED_BY", from: "w-fjord", to: "i-fjord", props: { from: 1953, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-aurora", to: "i-fjord", props: { from: 1958, to: 2026, mode: "purchase" } },
  { type: "LOANED_TO", from: "w-aurora", to: "i-harbor", props: { year: 1962 } },

  { type: "DEALT", from: "p-vale", to: "w-lattice", props: { year: 1970 } },
  { type: "OWNED_BY", from: "w-lattice", to: "i-pell", props: { from: 1970, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-choir", to: "p-pell", props: { from: 1974, to: 1992, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-choir", to: "i-nord", props: { from: 1992, to: 2026, mode: "gift" } },
  { type: "OWNED_BY", from: "w-quarry", to: "i-pell", props: { from: 1976, to: 1988, mode: "purchase" } },
  { type: "LOANED_TO", from: "w-quarry", to: "i-nord", props: { year: 1981 } },
  { type: "LOANED_TO", from: "w-quarry", to: "i-leith", props: { year: 1985 } },
  { type: "OWNED_BY", from: "w-quarry", to: "i-leith", props: { from: 1988, to: 2026, mode: "purchase" } },

  { type: "DEALT", from: "p-nabil", to: "w-cedar", props: { year: 1950 } },
  { type: "OWNED_BY", from: "w-cedar", to: "i-beirut", props: { from: 1942, to: 1975, mode: "studio" } },
  { type: "OWNED_BY", from: "w-cedar", to: "i-leith", props: { from: 1975, to: 2026, mode: "purchase" } },
  { type: "DEALT", from: "p-nabil", to: "w-port", props: { year: 1948 } },
  { type: "OWNED_BY", from: "w-port", to: "i-beirut", props: { from: 1948, to: 1999, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-port", to: "i-leith", props: { from: 1999, to: 2026, mode: "bequest" } },

  { type: "OWNED_BY", from: "w-dune", to: "i-cph", props: { from: 1940, to: 1962, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-dune", to: "i-fjord", props: { from: 1962, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-net", to: "i-cph", props: { from: 1949, to: 2026, mode: "purchase" } },
  { type: "LOANED_TO", from: "w-net", to: "i-fjord", props: { year: 1962 } },

  { type: "DEALT", from: "p-helm", to: "w-ash", props: { year: 1960 } },
  { type: "OWNED_BY", from: "w-ash", to: "i-paris", props: { from: 1960, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-veil", to: "i-paris", props: { from: 1967, to: 2026, mode: "studio" } },

  { type: "DEALT", from: "p-sato", to: "w-tide", props: { year: 1980 } },
  { type: "OWNED_BY", from: "w-tide", to: "i-sato", props: { from: 1980, to: 2026, mode: "purchase" } },
  { type: "OWNED_BY", from: "w-room", to: "i-pell", props: { from: 1990, to: 2026, mode: "purchase" } },

  // Restorers + workshop
  { type: "TRAINED_UNDER", from: "p-keene", to: "p-lang", props: { year: 1968 } },
  { type: "TRAINED_UNDER", from: "p-crowe", to: "p-lang", props: { year: 1971 } },
  { type: "TRAINED_UNDER", from: "p-rada", to: "p-keene", props: { year: 1989 } },
  { type: "RESTORED", from: "p-keene", to: "w-azure", props: { year: 1953, treatment: "lining" } },
  { type: "RESTORED", from: "p-keene", to: "w-veil", props: { year: 1991, treatment: "surface clean" } },
  { type: "RESTORED", from: "p-lang", to: "w-oriel", props: { year: 1958, treatment: "varnish" } },
  { type: "RESTORED", from: "p-crowe", to: "w-harbor", props: { year: 1982, treatment: "tear repair" } },
  { type: "RESTORED", from: "p-crowe", to: "w-cedar", props: { year: 1976, treatment: "relining" } },
  { type: "RESTORED", from: "p-rada", to: "w-lattice", props: { year: 1985, treatment: "flood recovery" } },
  { type: "RESTORED", from: "p-rada", to: "w-choir", props: { year: 1994, treatment: "panel stable" } },

  // Exhibitions
  { type: "HOSTED_BY", from: "e-north", to: "i-fjord" },
  { type: "HOSTED_BY", from: "e-north", to: "i-harbor" },
  { type: "HOSTED_BY", from: "e-north", to: "i-nord" },
  { type: "EXHIBITED_IN", from: "w-aurora", to: "e-north", props: { year: 1962 } },
  { type: "EXHIBITED_IN", from: "w-net", to: "e-north", props: { year: 1962 } },
  { type: "EXHIBITED_IN", from: "w-winter", to: "e-north", props: { year: 1962 } },
  { type: "EXHIBITED_IN", from: "w-dune", to: "e-north", props: { year: 1962 } },

  { type: "HOSTED_BY", from: "e-harbour", to: "i-rot" },
  { type: "EXHIBITED_IN", from: "w-ink", to: "e-harbour", props: { year: 1959 } },
  { type: "EXHIBITED_IN", from: "w-mine", to: "e-harbour", props: { year: 1959 } },
  { type: "EXHIBITED_IN", from: "w-drift", to: "e-harbour", props: { year: 1959 } },

  { type: "HOSTED_BY", from: "e-geometry", to: "i-pell" },
  { type: "EXHIBITED_IN", from: "w-lattice", to: "e-geometry", props: { year: 1979 } },
  { type: "EXHIBITED_IN", from: "w-choir", to: "e-geometry", props: { year: 1979 } },
  { type: "EXHIBITED_IN", from: "w-signal", to: "e-geometry", props: { year: 1979 } },

  { type: "HOSTED_BY", from: "e-night", to: "i-harbor" },
  { type: "EXHIBITED_IN", from: "w-interval", to: "e-night", props: { year: 1977 } },
  { type: "EXHIBITED_IN", from: "w-winter", to: "e-night", props: { year: 1977 } },
  { type: "EXHIBITED_IN", from: "w-signal", to: "e-night", props: { year: 1977 } },

  { type: "HOSTED_BY", from: "e-cape", to: "i-cape" },
  { type: "EXHIBITED_IN", from: "w-drift", to: "e-cape", props: { year: 1968 } },
  { type: "EXHIBITED_IN", from: "w-salt", to: "e-cape", props: { year: 1968 } },
  { type: "EXHIBITED_IN", from: "w-mine", to: "e-cape", props: { year: 1968 } },

  { type: "HOSTED_BY", from: "e-fold", to: "i-sato" },
  { type: "EXHIBITED_IN", from: "w-tide", to: "e-fold", props: { year: 1986 } },
  { type: "EXHIBITED_IN", from: "w-kites", to: "e-fold", props: { year: 1986 } },
  { type: "EXHIBITED_IN", from: "w-room", to: "e-fold", props: { year: 1986 } },

  { type: "HOSTED_BY", from: "e-restitution", to: "i-leith" },
  { type: "EXHIBITED_IN", from: "w-azure", to: "e-restitution", props: { year: 2014 } },
  { type: "EXHIBITED_IN", from: "w-port", to: "e-restitution", props: { year: 2014 } },
  { type: "EXHIBITED_IN", from: "w-cedar", to: "e-restitution", props: { year: 2014 } },

  // Curators (thin edges so the graph has people besides dealers/restorers)
  { type: "CURATED", from: "p-brink", to: "e-harbour", props: { year: 1959 } },
  { type: "CURATED", from: "p-owusu", to: "e-cape", props: { year: 1968 } },
  { type: "CURATED", from: "p-brink", to: "e-geometry", props: { year: 1979 } },
];
