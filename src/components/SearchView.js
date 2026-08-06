"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function SearchView({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const regular = (Array.isArray(data) ? data : []).filter(
          (p) => !p.customizableOptions || p.customizableOptions.length <= 1
        );
        setAllProducts(regular);
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query, allProducts]);

  return (
    <main className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">
          Búsqueda
        </p>
        <h1 className="mt-1 text-2xl font-bold text-primary font-sora mb-6">
          Buscá tu perfume
        </h1>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribí el nombre o descripción..."
          autoFocus
          className="w-full max-w-lg rounded-2xl border-2 border-gray-200 px-5 py-3 text-sm outline-none focus:border-accent transition-colors"
        />

        <div className="mt-8">
          {loading && (
            <p className="text-sm text-gray-400">Cargando productos...</p>
          )}

          {!loading && query.trim() === "" && (
            <p className="text-sm text-gray-400">
              Empezá a escribir para ver resultados.
            </p>
          )}

          {!loading && query.trim() !== "" && (
            <p className="text-sm text-gray-400 mb-6">
              {results.length === 0
                ? `Sin resultados para "${query}"`
                : `${results.length} resultado${results.length !== 1 ? "s" : ""}`}
            </p>
          )}

          {results.length > 0 && <ProductGrid products={results} />}

          {!loading && query.trim() !== "" && results.length === 0 && (
            <div className="text-center py-16">
              <Link
                href="/categories"
                className="inline-block text-accent text-sm font-semibold hover:underline"
              >
                Ver todas las fragancias →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
