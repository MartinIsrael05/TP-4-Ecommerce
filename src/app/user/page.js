"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

const STATUS_CONFIG = {
  Active:   { label: "Activa",      classes: "bg-emerald-100 text-emerald-800" },
  Shipped:  { label: "Enviada",     classes: "bg-blue-100 text-blue-800" },
  Closed:   { label: "Finalizada",  classes: "bg-gray-100 text-gray-600" },
  Canceled: { label: "Cancelada",   classes: "bg-red-100 text-red-700" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UserPage() {
  const { activeUser, contextReady, logout } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!contextReady || !activeUser) return;

    setOrdersLoading(true);
    fetch(`/api/users/${activeUser._id}/orders`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrders(data.orders);
        else setOrdersError(data.message || "Error al cargar las órdenes.");
      })
      .catch(() => setOrdersError("Error de conexión."))
      .finally(() => setOrdersLoading(false));
  }, [contextReady, activeUser]);

  // Mientras el context hidrata desde localStorage
  if (!contextReady) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </main>
    );
  }

  // Usuario no logueado
  if (!activeUser) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">◈</div>
          <h1 className="text-2xl font-bold text-primary font-sora">Sesión requerida</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Iniciá sesión para ver tu perfil y el historial de órdenes.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block bg-primary text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>
    );
  }

  const initials = activeUser.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Perfil */}
        <div className="rounded-2xl bg-primary text-secondary p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary/50 font-semibold">
              Mi cuenta
            </p>
            <h1 className="text-2xl font-bold font-sora mt-0.5 truncate">
              {activeUser.name}
            </h1>
            <p className="text-sm text-secondary/60 truncate">{activeUser.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 text-xs text-secondary/40 hover:text-secondary/80 border border-secondary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>

        {/* Órdenes */}
        <section>
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">
              Historial
            </p>
            <h2 className="text-2xl font-bold text-primary font-sora mt-1">Mis órdenes</h2>
          </div>

          {ordersLoading && (
            <p className="text-gray-400 text-sm py-4">Cargando órdenes...</p>
          )}

          {ordersError && (
            <p className="text-red-500 text-sm py-4">{ordersError}</p>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-3xl mb-2">◻</p>
              <p className="font-semibold text-primary">Todavía no realizaste compras</p>
              <p className="text-gray-400 text-sm mt-1">
                Tus órdenes aparecerán acá después de confirmar tu primer pedido.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block bg-primary text-secondary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
              >
                Ver fragancias
              </Link>
            </div>
          )}

          {!ordersLoading && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, classes: "bg-gray-100 text-gray-600" };
                return (
                  <Link
                    key={order._id}
                    href={`/user/order/${order._id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 hover:border-accent transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-primary text-lg">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(order.createdAt)} · {order.items.length}{" "}
                        {order.items.length === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                      <p className="font-bold text-primary">${order.total}</p>
                      <span className="text-gray-300 group-hover:text-accent transition-colors text-lg">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
