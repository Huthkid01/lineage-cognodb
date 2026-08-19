"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  initial = "",
  size = "default",
}: {
  initial?: string;
  size?: "default" | "hero";
}) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-2 sm:relative sm:block"
      role="search"
    >
      <label htmlFor="collection-search" className="sr-only">
        Search the collection
      </label>
      <input
        id="collection-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a work, artist, city, or movement"
        className={`field sm:pr-28 ${size === "hero" ? "py-3.5 text-base" : ""}`}
      />
      <button
        type="submit"
        className="w-full rounded-full bg-ink px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-paper transition hover:bg-[#2c241c] sm:absolute sm:right-1.5 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:py-2"
      >
        Search
      </button>
    </form>
  );
}

export function SearchHints() {
  const hints = ["Voss", "Hamburg", "disputed", "restorer"];
  return (
    <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
      Try
      {hints.map((hint) => (
        <a
          key={hint}
          href={`/search?q=${encodeURIComponent(hint)}`}
          className="rounded-full border border-line bg-white/50 px-2.5 py-1 text-ink/80 transition hover:border-ink/20 hover:bg-white"
        >
          {hint}
        </a>
      ))}
    </p>
  );
}
