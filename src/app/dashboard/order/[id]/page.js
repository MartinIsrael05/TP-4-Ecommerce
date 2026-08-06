import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import OrderDetail from "@/components/OrderDetail";
import OrderStatusChanger from "@/components/OrderStatusChanger";

export const dynamic = "force-dynamic";

export default async function DashboardOrderPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          ← Volver a órdenes
        </Link>
      </div>

      <OrderDetail
        order={order}
        actions={
          <div>
            <p className="text-xs uppercase tracking-wider text-secondary/50 font-semibold mb-2">
              Cambiar estado
            </p>
            <OrderStatusChanger orderId={order._id} currentStatus={order.status} />
          </div>
        }
      />
    </main>
  );
}
