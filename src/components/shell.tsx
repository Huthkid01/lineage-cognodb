"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/works",
    label: "Collection",
    match: (path: string) => path === "/works" || path.startsWith("/works/"),
  },
  {
    href: "/investigate",
    label: "Investigate",
    match: (path: string) => path.startsWith("/investigate"),
  },
  {
    href: "/model",
    label: "How it works",
    match: (path: string) => path.startsWith("/model"),
  },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:rounded-full focus:bg-ink focus:px-3 focus:py-1 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <Link href="/" className="shrink-0 font-serif text-xl tracking-tight sm:text-[1.35rem]">
          Lineage
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-ink text-paper"
                    : "text-muted hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            className={`rounded-full px-3 py-1.5 transition ${
              pathname.startsWith("/search")
                ? "bg-ink text-paper"
                : "text-muted hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Search
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/50 md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div id={menuId} className="border-t border-line bg-paper md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3" aria-label="Mobile">
            {[...links, { href: "/search", label: "Search", match: (p: string) => p.startsWith("/search") }].map(
              (link) => {
                const active = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-3 py-3 text-base ${
                      active ? "bg-ink text-paper" : "text-ink"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              },
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-[1.2fr_1fr] sm:px-5">
        <div>
          <p className="font-serif text-lg text-ink">Lineage</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Provenance intelligence for collections, backed by CognoDB. Fictional works,
            real graph questions.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm" aria-label="Footer">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="text-muted hover:text-ink">
            Search
          </Link>
        </nav>
      </div>
    </footer>
  );
}
