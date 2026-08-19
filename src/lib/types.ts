export type NodeKind =
  | "Artwork"
  | "Artist"
  | "Institution"
  | "Person"
  | "Exhibition";

export type GraphNode = {
  id: string;
  kind: NodeKind;
  label: string;
  hops?: number;
  disputed?: boolean;
  props: Record<string, unknown>;
};

export type GraphEdge = {
  id: string;
  type: string;
  from: string;
  to: string;
  props: Record<string, unknown>;
};

export type ArtworkCard = {
  id: string;
  title: string;
  year: number;
  medium: string;
  palette: string;
  imageUrl?: string;
  disputed: boolean;
  artistId: string;
  artistName: string;
};

export type ProvenanceEvent = {
  kind: "created" | "owned" | "loaned" | "exhibited" | "restored" | "dealt";
  year: number | null;
  until: number | null;
  title: string;
  subtitle: string;
  href?: string;
};

export type ArtworkDetail = {
  artwork: ArtworkCard & {
    notes: string;
    movement: string;
  };
  artist: {
    id: string;
    name: string;
    lifespan: string;
    nationality: string;
    movement: string;
  };
  provenance: ProvenanceEvent[];
};

export type ContagionHit = {
  artwork: ArtworkCard;
  hops: number;
  via: string;
};

export type RestorerHit = {
  id: string;
  name: string;
  city: string;
  hops: number;
  worksRestored: number;
  disputedHandled: number;
  viaMentor: string;
};

export type Stats = {
  artworks: number;
  artists: number;
  institutions: number;
  people: number;
  exhibitions: number;
  relationships: number;
  disputed: number;
};

export type SearchHit = {
  id: string;
  kind: NodeKind;
  label: string;
  detail: string;
  href: string;
};
