"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

const NAV_LINKS = [
  { href: "/dashboard",          label: "Resumen" },
  { href: "/dashboard/products", label: "Productos" },
  { href: "/dashboard/orders",   label: "Órdenes" },
];

export default function DashboardLayout({ children }) {
  const { activeUser, contextReady } = useAppContext();
  const pathname = usePathname();

  if (!contextReady) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!activeUser || activeUser.role !== "admin") {
    const isLoggedIn = !!activeUser;
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-3">⊘</p>
          <h1 className="text-2xl font-bold text-slate-900 font-sora">Acceso restringido</h1>
          <p className="mt-2 text-slate-500 text-sm">
            {isLoggedIn
              ? "Tu cuenta no tiene permisos de administrador."
              : "Iniciá sesión con una cuenta administradora para continuar."}
          </p>
          <div className="mt-6 flex flex-col gap-3 items-center">
            {!isLoggedIn && (
              <Link
                href={`/login?redirect=/dashboard`}
                className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors text-sm"
              >
                Iniciar sesión
              </Link>
            )}
            <Link
              href="/"
              className="w-full border border-slate-300 text-slate-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sub-navegación de admin */}
      <nav className="bg-white border-b border-slate-200 px-6">
        <div className="mx-auto max-w-6xl flex items-center gap-1 h-12">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-3">
            Admin
          </span>
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {children}
    </div>
  );
}
