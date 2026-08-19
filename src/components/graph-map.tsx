"use client";

import { useMemo, useState } from "react";
import type { GraphEdge, GraphNode, NodeKind } from "@/lib/types";

const KIND_COLOR: Record<NodeKind, string> = {
  Artwork: "#8a4428",
  Artist: "#3a5244",
  Institution: "#2a4a74",
  Person: "#a98448",
  Exhibition: "#6a4878",
};

function hrefFor(node: GraphNode): string | null {
  if (node.kind === "Artwork") return `/works/${node.id}`;
  if (node.kind === "Artist") return `/artists/${node.id}`;
  if (node.kind === "Institution") return `/institutions/${node.id}`;
  return null;
}

function shorten(label: string) {
  return label.length > 20 ? `${label.slice(0, 18)}…` : label;
}

export function GraphMap({
  nodes,
  edges,
  centerId,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  centerId: string;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const layout = useMemo(() => {
    const width = 980;
    const height = 640;
    const pad = 64;
    const cx = width / 2;
    const cy = height / 2;
    const byHop = new Map<number, GraphNode[]>();
    for (const node of nodes) {
      const hop = node.id === centerId ? 0 : Math.max(1, node.hops ?? 1);
      const list = byHop.get(hop) ?? [];
      list.push(node);
      byHop.set(hop, list);
    }
    const hops = [...byHop.keys()].sort((a, b) => a - b);
    const maxHop = Math.max(1, ...hops);
    const maxRadius = Math.min(cx, cy) - pad;

    const positions = new Map<
      string,
      { x: number; y: number; angle: number }
    >();
    for (const hop of hops) {
      const ring = byHop.get(hop) ?? [];
      const radius = hop === 0 ? 0 : (hop / maxHop) * maxRadius;
      const start = -Math.PI / 2 + (hop % 2 === 0 ? 0 : Math.PI / ring.length);
      ring.forEach((node, i) => {
        const angle =
          start + (Math.PI * 2 * i) / Math.max(ring.length, 1);
        positions.set(node.id, {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          angle,
        });
      });
    }
    return { width, height, positions };
  }, [nodes, centerId]);

  if (nodes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
        No connected nodes in this window. Open another work or start from The Azure Recital.
      </div>
    );
  }

  const hovered = nodes.find((n) => n.id === hoverId);

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="overflow-hidden rounded-2xl border border-line bg-[#16120e] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="h-auto min-h-[320px] w-full sm:min-h-[460px]"
          role="img"
          aria-label="Neighborhood graph"
        >
          {edges.map((edge) => {
            const from = layout.positions.get(edge.from);
            const to = layout.positions.get(edge.to);
            if (!from || !to) return null;
            const active =
              hoverId && (edge.from === hoverId || edge.to === hoverId);
            return (
              <line
                key={edge.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? "rgba(246,240,228,0.55)" : "rgba(246,240,228,0.16)"}
                strokeWidth={active ? 1.8 : 1.1}
              />
            );
          })}
          {nodes.map((node) => {
            const pos = layout.positions.get(node.id);
            if (!pos) return null;
            const color = KIND_COLOR[node.kind];
            const r = node.id === centerId ? 16 : node.kind === "Artwork" ? 10 : 8;
            const href = hrefFor(node);
            const outward = node.id === centerId ? 0 : 18;
            const lx = pos.x + Math.cos(pos.angle) * (r + outward);
            const ly = pos.y + Math.sin(pos.angle) * (r + outward);
            const cos = Math.cos(pos.angle);
            const sin = Math.sin(pos.angle);
            const anchor =
              node.id === centerId
                ? "middle"
                : cos > 0.45
                  ? "start"
                  : cos < -0.45
                    ? "end"
                    : "middle";
            const baseline =
              node.id === centerId
                ? "hanging"
                : sin > 0.5
                  ? "hanging"
                  : sin < -0.5
                    ? "auto"
                    : "middle";
            const inner = (
              <>
                <title>{`${node.label} · ${node.kind}`}</title>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={hoverId === node.id ? r + 2 : r}
                  fill={node.disputed ? "#9a2f2a" : color}
                  stroke="#f6f0e4"
                  strokeWidth={node.id === centerId ? 2.5 : 1}
                />
                <text
                  x={node.id === centerId ? pos.x : lx}
                  y={node.id === centerId ? pos.y + r + 14 : ly}
                  textAnchor={anchor}
                  dominantBaseline={baseline}
                  fill="#f6f0e4"
                  fontSize={node.id === centerId ? 12.5 : 10}
                  fontFamily="Georgia, serif"
                >
                  {shorten(node.label)}
                </text>
              </>
            );
            return href ? (
              <a
                key={node.id}
                href={href}
                onMouseEnter={() => setHoverId(node.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {inner}
              </a>
            ) : (
              <g
                key={node.id}
                onMouseEnter={() => setHoverId(node.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {inner}
              </g>
            );
          })}
        </svg>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[11px] uppercase tracking-wider text-paper/65">
          <div className="flex flex-wrap gap-4">
            {Object.entries(KIND_COLOR).map(([kind, color]) => (
              <span key={kind} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {kind}
              </span>
            ))}
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-flag" />
              Disputed
            </span>
          </div>
          <p className="normal-case tracking-normal text-paper/50">
            {hovered
              ? `${hovered.label} · ${hovered.kind}`
              : "Hover a node · click artworks, artists, museums"}
          </p>
        </div>
      </div>
    </div>
  );
}
