import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Footer, Header } from "@/components/shell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lineage — provenance as a graph",
  description:
    "A CognoDB-backed explorer for artwork ownership, loans, restorers, and dispute contagion.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="grain flex min-h-full flex-col" suppressHydrationWarning>
        <Header />
        <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-5 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
