"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAppContext();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Error al registrarse");
      }

      login(data.user);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">Bienvenido</p>
          <h1 className="text-3xl font-bold text-primary font-sora mt-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-2">Registrate para guardar favoritos y hacer pedidos</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-primary mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-primary mb-1.5">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-primary mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-accent transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-secondary py-3.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
