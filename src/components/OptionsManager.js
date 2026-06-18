"use client";

import { useState, useEffect } from "react";

export default function OptionsManager({ title, apiUrl, postUrl, fields, defaultValues = {} }) {
  const writeUrl = postUrl || apiUrl;
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const res = await fetch(apiUrl);
    const data = await res.json();
    setItems(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(writeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...defaultValues, ...form }),
    });

    if (res.ok) {
      setForm({});
      setMessage("Creado correctamente.");
      fetchItems();
    } else {
      setMessage("Error al crear.");
    }
  }

  async function handleDelete(id) {
    const res = await fetch(writeUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setMessage("Eliminado correctamente.");
      fetchItems();
    }
  }

  const visibleFields = fields.filter(f => f.type !== "hidden");

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      <form className="mt-4 flex flex-wrap gap-2" onSubmit={handleSubmit}>
        {visibleFields.map((field) => (
          <input
            key={field.name}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
            placeholder={field.placeholder}
            type={field.type || "text"}
            value={form[field.name] || ""}
            onChange={(e) => setForm({ ...form, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })}
            required={field.required !== false}
          />
        ))}
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Agregar
        </button>
      </form>

      {message && <p className="mt-2 text-xs text-slate-600">{message}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1"
          >
            <span className="text-sm text-slate-800">
              {item.name}
              {item.type && <span className="text-slate-500"> ({item.type})</span>}
              {item.price !== undefined && <span className="text-slate-500"> — ${item.price}</span>}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(item._id)}
              className="text-red-500 hover:text-red-700 text-xs font-bold"
            >
              x
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-400">Sin datos cargados.</p>
        )}
      </div>
    </div>
  );
}
