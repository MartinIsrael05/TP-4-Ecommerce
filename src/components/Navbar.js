"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { favoritesQty, cart, activeUser, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const close = () => setMenuOpen(false);

  return (
    <header className="border-b border-white/10 bg-primary text-secondary relative z-40">

      {/* Barra principal */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">

        <Link href="/" onClick={close} className="text-xl font-bold font-sora tracking-widest hover:text-accent transition-colors">
          FRAGMENTE
        </Link>

        {/* Nav links — solo desktop */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/categories">Categorías</NavLink>
          {activeUser?.role === "admin" && (
            <NavLink href="/dashboard">Dashboard</NavLink>
          )}
        </div>

        {/* SearchBar — solo desktop */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* Acciones usuario — solo desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/favorites" className="relative text-sm font-medium hover:text-accent transition-colors">
            Favoritos
            {favoritesQty() > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesQty()}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative text-sm font-medium hover:text-accent transition-colors">
            Carrito
            {cartQty > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </Link>

          {activeUser ? (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Link href="/user" className="text-sm font-medium hover:text-accent transition-colors">
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

        {/* Mobile: íconos rápidos + botón hamburguesa */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/favorites" onClick={close} className="relative text-sm font-medium hover:text-accent transition-colors">
            Fav
            {favoritesQty() > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesQty()}
              </span>
            )}
          </Link>

          <Link href="/cart" onClick={close} className="relative text-sm font-medium hover:text-accent transition-colors">
            Carrito
            {cartQty > 0 && (
              <span className="absolute -top-2 -right-5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary px-6 py-5 space-y-1">

          <div className="mb-4">
            <SearchBar />
          </div>

          <MobileLink href="/" onClick={close}>Home</MobileLink>
          <MobileLink href="/categories" onClick={close}>Categorías</MobileLink>
          {activeUser?.role === "admin" && (
            <MobileLink href="/dashboard" onClick={close}>Dashboard</MobileLink>
          )}

          <div className="pt-3 mt-3 border-t border-white/10">
            {activeUser ? (
              <div className="space-y-1">
                <MobileLink href="/user" onClick={close}>
                  Mi cuenta — {activeUser.name.split(" ")[0]}
                </MobileLink>
                <button
                  onClick={() => { logout(); close(); }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-secondary/60 hover:text-secondary hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <MobileLink href="/login" onClick={close}>Iniciar sesión</MobileLink>
                <MobileLink href="/register" onClick={close}>Registrarse</MobileLink>
              </div>
            )}
          </div>
        </div>
      )}
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

function MobileLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
