import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

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

function MetricCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5">
      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const {
    recentOrders,
    monthlyTotal,
    monthlyOrderCount,
    totalOrders,
    recentUsers,
    totalUsers,
    lowStockProducts,
  } = await getDashboardStats();

  return (
    <main className="px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="rounded-lg bg-slate-900 px-8 py-8 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
            Panel de control
          </p>
          <h1 className="text-3xl font-bold font-sora mt-1">Resumen</h1>
          <p className="mt-1 text-slate-400 text-sm">
            Visión general del ecommerce FRAGMENTE.
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Ventas del mes"
            value={`$${monthlyTotal.toLocaleString("es-AR")}`}
            sub={`${monthlyOrderCount} órdenes`}
          />
          <MetricCard
            label="Órdenes totales"
            value={totalOrders}
          />
          <MetricCard
            label="Usuarios"
            value={totalUsers}
          />
          <MetricCard
            label="Stock bajo"
            value={lowStockProducts.length}
            sub="productos en 0 o 1 unidad"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Últimas órdenes */}
          <section className="rounded-xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Últimas órdenes</h2>
              <Link
                href="/dashboard/orders"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                Ver todas →
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">Todavía no hay órdenes.</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, classes: "bg-gray-100 text-gray-600" };
                  return (
                    <Link
                      key={order._id}
                      href={`/dashboard/order/${order._id}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-slate-900">#{order.orderNumber}</span>
                        <span className="text-slate-400 text-xs ml-2 truncate">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                        <span className="font-semibold text-sm text-slate-700">${order.total}</span>
                        <span className="text-slate-200 group-hover:text-slate-400 text-sm">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Stock bajo */}
          <section className="rounded-xl bg-white border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Stock bajo</h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">Todos los productos tienen stock suficiente.</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-red-50"
                  >
                    <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.stock === 0
                          ? "bg-red-200 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock === 0 ? "Sin stock" : `${p.stock} ud.`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Últimos usuarios */}
          <section className="rounded-xl bg-white border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Últimos usuarios registrados</h2>
            {recentUsers.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">Todavía no hay usuarios.</p>
            ) : (
              <div className="space-y-2">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {u.role === "admin" && (
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                          admin
                        </span>
                      )}
                      <span className="text-xs text-slate-300">{formatDate(u.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Accesos rápidos */}
          <section className="rounded-xl bg-white border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Accesos rápidos</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/products", label: "Gestionar productos", icon: "◈" },
                { href: "/dashboard/orders",   label: "Ver órdenes",          icon: "◻" },
                { href: "/",                   label: "Ver tienda",            icon: "↗" },
                { href: "/dashboard/products", label: "Agregar producto",      icon: "+" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                >
                  <span className="text-slate-400">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
