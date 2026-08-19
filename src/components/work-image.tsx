"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { artworkImageUrl } from "@/data/images";

export function WorkImage({
  id,
  title,
  palette,
  imageUrl,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: {
  id: string;
  title: string;
  palette: string;
  imageUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = useMemo(() => artworkImageUrl(id, imageUrl), [id, imageUrl]);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative h-full min-h-0 w-full overflow-hidden ${className}`}
      style={{ backgroundColor: palette }}
    >
      {!failed && (
        <Image
          key={src}
          src={src}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
    </div>
  );
}
