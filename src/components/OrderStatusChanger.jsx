"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["Active", "Closed", "Shipped", "Canceled"];

const STATUS_LABELS = {
  Active:   "Activa",
  Closed:   "Finalizada",
  Shipped:  "Enviada",
  Canceled: "Cancelada",
};

export default function OrderStatusChanger({ orderId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleChange(newStatus) {
    if (newStatus === status || loading) return;
    setLoading(true);
    setMessage("");

    const optimisticPrev = status;
    setStatus(newStatus); // actualización optimista inmediata

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        router.refresh(); // refresca datos del server component
      } else {
        setStatus(optimisticPrev); // revertir si falla
        setMessage(data.message || "Error al cambiar el estado.");
      }
    } catch {
      setStatus(optimisticPrev);
      setMessage("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white outline-none focus:border-slate-500 disabled:opacity-60 cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {loading && <span className="text-xs text-slate-400">Guardando...</span>}
      {message && <span className="text-xs text-red-500">{message}</span>}
    </div>
  );
}
