"use client";

import { useState, useEffect } from "react";
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

export default function CheckoutPage() {
  const { cart, activeUser, clearCart } = useAppContext();

  const [form, setForm] = useState({ name: "", email: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Prellenar con datos del usuario cuando el context carga
  useEffect(() => {
    if (activeUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || activeUser.name || "",
        email: prev.email || activeUser.email || "",
      }));
    }
  }, [activeUser]);

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const items = cart.map((item) => ({
      productId: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      customizations: item.customizations ?? {},
      subtotal: item.subtotal,
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser?._id ?? null,
          customerInfo: {
            name: form.name.trim(),
            email: form.email.trim(),
            address: form.address.trim(),
            notes: form.notes.trim(),
          },
          items,
          total,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Error al procesar la compra.");
        return;
      }

      clearCart();
      setConfirmedOrder(data.order);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // Confirmación
  if (confirmedOrder) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <div className="text-5xl mb-4">✦</div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">
            Compra confirmada
          </p>
          <h1 className="text-3xl font-bold text-primary font-sora mt-2">
            ¡Gracias por tu pedido!
          </h1>
          <p className="mt-3 text-gray-500 text-sm">
            Tu fragancia está en camino. Te contactaremos pronto con los detalles.
          </p>

          <div className="mt-8 rounded-2xl bg-primary text-secondary py-6 px-8">
            <p className="text-xs uppercase tracking-wider text-secondary/50">
              Número de orden
            </p>
            <p className="text-5xl font-bold text-accent mt-2">
              #{confirmedOrder.orderNumber}
            </p>
            <p className="text-xs text-secondary/40 mt-3">
              {confirmedOrder.customerInfo.email}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {activeUser && (
              <Link
                href="/user"
                className="bg-primary text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors text-sm"
              >
                Ver mis órdenes
              </Link>
            )}
            <Link
              href="/"
              className="border border-gray-200 text-primary px-6 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors text-sm"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Carrito vacío
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">◻</div>
          <h1 className="text-2xl font-bold text-primary font-sora">
            Nada para confirmar
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Agregá perfumes al carrito antes de continuar al checkout.
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

  // Formulario
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">
            Último paso
          </p>
          <h1 className="text-3xl font-bold text-primary font-sora mt-1">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Formulario de datos */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
              <h2 className="font-semibold text-lg text-primary">Datos de contacto</h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre completo
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Dirección de entrega
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Calle 123, Ciudad, Provincia"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Observaciones{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Instrucciones de entrega, referencias, horarios, etc."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>
          </form>

          {/* Resumen del pedido */}
          <aside className="h-fit rounded-2xl bg-primary p-6 text-secondary sticky top-6">
            <h2 className="text-sm uppercase tracking-wider text-secondary/60 font-semibold">
              Tu pedido
            </h2>

            <div className="mt-4 space-y-3">
              {cart.map((item) => {
                const custom = formatCustomizations(item.customizations);
                return (
                  <div key={item.cartItemId} className="text-sm border-b border-secondary/10 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary truncate">{item.name}</p>
                        {custom && (
                          <p className="text-xs text-secondary/50 mt-0.5 line-clamp-2">{custom}</p>
                        )}
                        <p className="text-secondary/50 text-xs mt-1">
                          {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p className="text-secondary/80 font-semibold flex-shrink-0">
                        ${item.subtotal}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-secondary/20 flex justify-between items-center">
              <span className="font-semibold text-secondary">Total</span>
              <span className="text-2xl font-bold text-accent">${total}</span>
            </div>

            <Link
              href="/cart"
              className="mt-4 block text-center text-xs text-secondary/40 hover:text-secondary/70 transition-colors"
            >
              ← Volver al carrito
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
