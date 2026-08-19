import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <p className="font-serif text-2xl">Page not found</p>
      <Link href="/" className="mt-3 inline-block text-sm text-copper">
        Back to the collection
      </Link>
    </div>
  );
}
