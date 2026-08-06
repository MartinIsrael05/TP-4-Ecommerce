import Link from "next/link";
import { getAllOrders } from "@/lib/orders";
import OrderStatusChanger from "@/components/OrderStatusChanger";

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

export default async function DashboardOrdersPage() {
  const orders = await getAllOrders();

  return (
    <main className="px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-slate-900 px-8 py-8 text-white shadow-xl mb-8">
          <h1 className="text-3xl font-semibold font-sora">Órdenes de compra</h1>
          <p className="mt-1 text-slate-400 text-sm">
            {orders.length} {orders.length === 1 ? "orden" : "órdenes"} en total.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-slate-400 text-sm">Todavía no se generaron órdenes.</p>
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
            {/* Header de tabla */}
            <div className="hidden lg:grid grid-cols-[80px_1fr_60px_80px_180px_40px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <span>#Orden</span>
              <span>Cliente</span>
              <span>Items</span>
              <span>Total</span>
              <span>Estado</span>
              <span></span>
            </div>

            {/* Filas */}
            <div className="divide-y divide-slate-100">
              {orders.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, classes: "bg-gray-100 text-gray-600" };
                return (
                  <div
                    key={order._id}
                    className="grid grid-cols-1 lg:grid-cols-[80px_1fr_60px_80px_180px_40px] gap-2 lg:gap-4 items-center px-5 py-4"
                  >
                    <span className="font-bold text-slate-900">#{order.orderNumber}</span>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">
                        {order.customerInfo?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {order.customerInfo?.email} · {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span className="text-sm text-slate-500 hidden lg:block">
                      {order.items.length}
                    </span>

                    <span className="font-semibold text-slate-800 text-sm">${order.total}</span>

                    {/* Selector de estado inline */}
                    <OrderStatusChanger orderId={order._id} currentStatus={order.status} />

                    <Link
                      href={`/dashboard/order/${order._id}`}
                      className="text-slate-300 hover:text-slate-700 transition-colors text-lg text-center"
                      title="Ver detalle"
                    >
                      →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
