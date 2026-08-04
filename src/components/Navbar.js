"use client";

import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

export default function Navbar() {
  const { favoritesQty, cart, activeUser, logout } = useAppContext();

  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-white/10 bg-primary text-secondary">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 flex-wrap">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold font-sora tracking-widest hover:text-accent transition-colors">
          FRAGMENTE
        </Link>

        {/* Links de navegación */}
        <div className="flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/categories">Categorías</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </div>

        {/* Acciones: favoritos, carrito y usuario */}
        <div className="flex items-center gap-4">

          {/* Favoritos */}
          <Link href="/favorites" className="relative text-sm font-medium hover:text-accent transition-colors">
            Favoritos
            {favoritesQty() > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesQty()}
              </span>
            )}
          </Link>

          {/* Carrito */}
          <Link href="/cart" className="relative text-sm font-medium hover:text-accent transition-colors">
            Carrito
            {cartQty > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </Link>

          {/* Usuario */}
          {activeUser ? (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Link
                href="/user"
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                Hola, {activeUser.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="text-xs border border-white/30 rounded-lg px-2.5 py-1 hover:bg-white/10 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Link href="/login" className="text-sm font-medium hover:text-accent transition-colors">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-accent text-white rounded-lg px-3 py-1.5 hover:brightness-110 transition-all"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
    >
      {children}
    </Link>
  );
}
