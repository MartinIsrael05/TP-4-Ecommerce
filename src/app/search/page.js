import { Suspense } from "react";
import SearchView from "@/components/SearchView";

export async function generateMetadata({ searchParams }) {
  const q = (await searchParams).q?.trim() || "";
  return {
    title: q ? `"${q}" — Búsqueda | FRAGMENTE` : "Búsqueda | FRAGMENTE",
    description: q
      ? `Resultados de búsqueda para "${q}" en FRAGMENTE.`
      : "Buscá perfumes en FRAGMENTE.",
  };
}

export default async function SearchPage({ searchParams }) {
  const q = (await searchParams).q?.trim() || "";

  return (
    <Suspense>
      <SearchView initialQuery={q} />
    </Suspense>
  );
}
