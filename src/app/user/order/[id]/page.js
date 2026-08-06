"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import OrderDetail from "@/components/OrderDetail";

export default function UserOrderPage() {
  const { id } = useParams();
  const { activeUser, contextReady } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contextReady) return;

    if (!activeUser) {
      setLoading(false);
      return;
    }

    fetch(`/api/users/${activeUser._id}/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.order);
        else setError(data.message || "No se pudo cargar la orden.");
      })
      .catch(() => setError("Error de conexión."))
      .finally(() => setLoading(false));
  }, [contextReady, activeUser, id]);

  if (!contextReady || loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </main>
    );
  }

  if (!activeUser) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-primary font-sora">Sesión requerida</h1>
          <Link href="/login" className="mt-4 inline-block bg-primary text-secondary px-6 py-3 rounded-xl font-semibold">
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-3xl mb-3">✕</p>
          <h1 className="text-xl font-bold text-primary font-sora">{error}</h1>
          <Link href="/user" className="mt-4 inline-block text-accent font-semibold hover:underline">
            ← Volver a mis órdenes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link
          href="/user"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors"
        >
          ← Mis órdenes
        </Link>
      </div>
      <OrderDetail order={order} />
    </main>
  );
}
