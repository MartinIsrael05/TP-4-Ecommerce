"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        const filtered = (Array.isArray(data) ? data : [])
          .filter((p) => !p.customizableOptions || p.customizableOptions.length <= 1)
          .slice(0, 6);
        setResults(filtered);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSelect = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar perfumes..."
          className="bg-white/10 text-secondary placeholder-secondary/40 text-sm rounded-full px-4 py-1.5 w-36 lg:w-48 outline-none focus:bg-white/20 transition-all"
        />
      </form>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {loading && (
            <p className="px-4 py-3 text-sm text-gray-400">Buscando...</p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">
              Sin resultados para &quot;{query}&quot;
            </p>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={`/images/products/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary/30 text-base font-bold">
                        {product.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">desde ${product.price}</p>
                  </div>
                </Link>
              ))}

              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="block px-4 py-2.5 text-xs font-semibold text-accent border-t border-gray-100 hover:bg-gray-50 transition-colors text-center"
              >
                Ver todos los resultados →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
