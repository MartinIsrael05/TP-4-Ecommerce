"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

export default function FavoritesPage() {
  const { favorites, removeFavorite, activeUser } = useAppContext();

  if (favorites.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">♡</div>
          <h1 className="text-2xl font-bold text-primary font-sora">Sin favoritos todavía</h1>
          <p className="mt-2 text-gray-500 text-sm">
            {activeUser
              ? "Marcá perfumes con el corazón para guardarlos acá."
              : "Podés guardar favoritos aunque no estés registrado. Si iniciás sesión, se sincronizan automáticamente."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-primary text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            Ver fragancias
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">Tu selección</p>
          <h1 className="text-3xl font-bold text-primary font-sora mt-1">Mis favoritos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} {favorites.length === 1 ? "fragancia guardada" : "fragancias guardadas"}
            {!activeUser && (
              <span className="ml-2 text-xs text-amber-600">
                · <Link href="/login" className="underline">Iniciá sesión</Link> para sincronizarlos
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-accent transition-colors duration-300"
            >
              {/* Botón quitar favorito */}
              <button
                onClick={() => removeFavorite(product._id)}
                title="Quitar de favoritos"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-accent hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
              >
                ♥
              </button>

              {/* Imagen */}
              <div className="aspect-square bg-gray-50 overflow-hidden">
                {product.image ? (
                  <img
                    src={`/images/products/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl text-gray-200">◈</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h2 className="font-semibold text-primary line-clamp-1">{product.name}</h2>
                {product.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
                )}
                <p className="mt-2 text-sm font-bold text-accent">desde ${product.price}</p>

                <Link
                  href={`/product/${product._id}`}
                  className="mt-3 block w-full text-center bg-primary text-secondary py-2 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  Ver producto
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
