const STATUS_CONFIG = {
  Active:   { label: "Activa",      classes: "bg-emerald-100 text-emerald-800" },
  Shipped:  { label: "Enviada",     classes: "bg-blue-100 text-blue-800" },
  Closed:   { label: "Finalizada",  classes: "bg-gray-100 text-gray-600" },
  Canceled: { label: "Cancelada",   classes: "bg-red-100 text-red-700" },
};

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export default function OrderDetail({ order, actions = null }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="rounded-2xl bg-primary text-secondary p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary/50 font-semibold">
              Orden de compra
            </p>
            <p className="text-4xl font-bold text-accent mt-1">#{order.orderNumber}</p>
            <p className="text-sm text-secondary/60 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={order.status} />
            <p className="text-2xl font-bold text-secondary">${order.total}</p>
          </div>
        </div>

        {actions && <div className="mt-5 pt-5 border-t border-secondary/20">{actions}</div>}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-primary mb-4">Datos de entrega</h2>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wider">Nombre</dt>
            <dd className="mt-0.5 font-medium text-primary">{order.customerInfo.name}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase tracking-wider">Email</dt>
            <dd className="mt-0.5 font-medium text-primary">{order.customerInfo.email}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-400 text-xs uppercase tracking-wider">Dirección</dt>
            <dd className="mt-0.5 font-medium text-primary">{order.customerInfo.address}</dd>
          </div>
          {order.customerInfo.notes && (
            <div className="sm:col-span-2">
              <dt className="text-gray-400 text-xs uppercase tracking-wider">Observaciones</dt>
              <dd className="mt-0.5 text-gray-600">{order.customerInfo.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-primary mb-4">
          Productos ({order.items.length})
        </h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const custom = formatCustomizations(item.customizations);
            return (
              <div
                key={idx}
                className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
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

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-sm">{item.name}</p>
                  {custom && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{custom}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {item.quantity} × ${item.price}
                  </p>
                </div>

                <p className="font-semibold text-primary text-sm flex-shrink-0">
                  ${item.subtotal}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-primary">Total</span>
          <span className="text-2xl font-bold text-accent">${order.total}</span>
        </div>
      </div>
    </div>
  );
}

export { StatusBadge };
