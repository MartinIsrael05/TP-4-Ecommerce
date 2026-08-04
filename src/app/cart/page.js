"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

function formatCustomizations(c) {
  if (!c || Object.keys(c).length === 0) return null;
  const parts = [];
  if (c.volume?.name) parts.push(c.volume.name);
  if (c.concentration?.name) parts.push(c.concentration.name);
  if (c.fragranceName) parts.push(`"${c.fragranceName}"`);
  if (c.bottleDesign?.name) parts.push(c.bottleDesign.name);
  if (c.packaging?.name) parts.push(c.packaging.name);
  if (c.notes?.length > 0) parts.push(c.notes.map((n) => n.name).join(", "));
  return parts.length > 0 ? parts.join(" · ") : null;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useAppContext();

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">◻</div>
          <h1 className="text-2xl font-bold text-primary font-sora">Tu carrito está vacío</h1>
          <p className="mt-2 text-gray-500 text-sm">Agregá perfumes desde el catálogo para continuar.</p>
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
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">Revisá tu selección</p>
          <h1 className="text-3xl font-bold text-primary font-sora mt-1">Tu carrito</h1>
          <p className="text-sm text-gray-500 mt-1">{cart.length} {cart.length === 1 ? "producto" : "productos"}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Lista de items */}
          <section className="space-y-4">
            {cart.map((item) => {
              const custom = formatCustomizations(item.customizations);
              return (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={`/images/products/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-200">◈</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-primary truncate">{item.name}</h2>
                    {custom && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{custom}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-accent">${item.price} c/u</p>

                    {/* Cantidad */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        disabled={item.stock != null && item.quantity >= item.stock}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {item.stock != null && item.quantity >= item.stock && (
                      <p className="mt-1 text-[10px] text-red-400 font-medium">Stock máximo alcanzado</p>
                    )}
                  </div>

                  {/* Subtotal y eliminar */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                    <p className="text-lg font-bold text-primary">${item.subtotal}</p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Resumen */}
          <aside className="h-fit rounded-2xl bg-primary p-6 text-secondary sticky top-6">
            <h2 className="text-sm uppercase tracking-wider text-secondary/60 font-semibold">Resumen de compra</h2>

            <div className="mt-4 space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-secondary/70">
                  <span className="truncate flex-1 pr-2">{item.name} ×{item.quantity}</span>
                  <span className="flex-shrink-0">${item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-secondary/20 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-accent">${total}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-accent text-white py-3.5 rounded-xl font-semibold text-center hover:brightness-110 transition-all"
            >
              Ir al checkout →
            </Link>

            <Link
              href="/"
              className="mt-3 block text-center text-sm text-secondary/50 hover:text-secondary/80 transition-colors"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
