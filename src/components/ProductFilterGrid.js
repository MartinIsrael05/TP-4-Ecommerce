"use client";

import { useState, useMemo } from "react";
import ProductGrid from "@/components/ProductGrid";

export default function ProductFilterGrid({ products = [] }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      return true;
    });

    if (sort === "asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [products, minPrice, maxPrice, sort]);

  const hasFilters = minPrice !== "" || maxPrice !== "" || sort !== "default";

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSort("default");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Precio mín.</label>
          <input
            type="number"
            min="0"
            placeholder="$ 0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Precio máx.</label>
          <input
            type="number"
            min="0"
            placeholder="$ máx."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 font-medium">Ordenar por</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent transition-colors bg-white"
          >
            <option value="default">Relevancia</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="self-end text-xs text-gray-400 hover:text-accent transition-colors underline"
          >
            Limpiar filtros
          </button>
        )}

        <p className="self-end ml-auto text-sm text-gray-400">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 text-sm">
          No hay productos que coincidan con los filtros.
        </p>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}
