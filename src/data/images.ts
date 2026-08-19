const u = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=80`;

/** Unsplash stills chosen to match each fictional work's subject. */
export const ARTWORK_IMAGES: Record<string, string> = {
  "w-azure": u("photo-1541701494587-cb58502866ab"), // blue colour-field
  "w-oriel": u("photo-1718550849266-affb20320942"), // sunset through a window
  "w-winter": u("photo-1511497584788-876760111969"), // winter trees
  "w-interval": u("photo-1579783902614-a3fb3927b6a5"), // red painting
  "w-harbor": u("photo-1514565131-fce0801e5785"), // harbour lights
  "w-drift": u("photo-1507525428034-b723cf961d3e"), // cape / shore
  "w-mine": u("photo-1513828583688-c52646db9b56"), // night industry
  "w-ink": u("photo-1455390582262-044cdead277a"), // ink on paper
  "w-kites": u("photo-1507608869274-d28d1d2ec0d7"), // kites in sky
  "w-fjord": u("photo-1464822759023-fed622ff2c3b"), // fjord
  "w-aurora": u("photo-1531366936337-7c912a4589a7"), // aurora
  "w-lattice": u("photo-1509316785289-025f5b846b35"), // dry desert lattice
  "w-choir": u("photo-1487956382158-bb926046304a"), // architectural angles
  "w-cedar": u("photo-1441974231531-c6227db76b6e"), // cedar forest
  "w-port": u("photo-1641081295676-3fbfbd7db0c3"), // cargo ship in harbour
  "w-dune": u("photo-1473580044384-7ba9967e16a0"), // dunes
  "w-net": u("photo-1559827260-dc66d52bef19"), // sea / nets weather
  "w-ash": u("photo-1418065460487-3e41a6c84dc5"), // ashen forest / grey season
  "w-veil": u("photo-1550684848-fac1c5b4e853"), // dark veil / fabric
  "w-tide": u("photo-1439066615861-d1af74d74000"), // folded tide
  "w-room": u("photo-1615529182904-14819c35db37"), // copper interior
  "w-signal": u("photo-1480714378408-0cf381d0c9eb"), // night city signal
  "w-quarry": u("photo-1518709268805-4e9042af9f23"), // quarry rock
  "w-salt": u("photo-1473496169904-658ba7c44d8a"), // salt / pale earth
};

export function artworkImageUrl(id: string, stored?: string | null): string {
  return ARTWORK_IMAGES[id] ?? stored ?? u("photo-1577083552431-6e5fd01988ec");
}
