"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

export default function ProductDetail({ product, isCustomizable, options }) {
  const { addToCart } = useAppContext();

  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedConcentration, setSelectedConcentration] = useState(null);
  const [selectedBottleDesign, setSelectedBottleDesign] = useState(null);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [fragranceName, setFragranceName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const topNotes = (options.notes || []).filter(n => n.type === "salida");
  const heartNotes = (options.notes || []).filter(n => n.type === "corazon");
  const baseNotes = (options.notes || []).filter(n => n.type === "base");

  const handleNoteToggle = (note) => {
    const exists = selectedNotes.some(n => n._id === note._id);
    if (exists) {
      setSelectedNotes(selectedNotes.filter(n => n._id !== note._id));
    } else {
      if (selectedNotes.filter(n => n.type === note.type).length >= 3) return;
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const notesOfType = (type) => selectedNotes.filter(n => n.type === type);

  const handleAddToCart = () => {
    const customizations = isCustomizable
      ? {
          volume: selectedVolume,
          concentration: selectedConcentration,
          bottleDesign: selectedBottleDesign,
          packaging: selectedPackaging,
          notes: selectedNotes,
          fragranceName: fragranceName,
        }
      : { volume: selectedVolume };

    const price = selectedVolume ? selectedVolume.price : product.price;

    addToCart({ ...product, price }, customizations, quantity);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <p className="mt-2 text-xl font-semibold text-primary">
        desde ${product.price}
      </p>

      {/* Volumen — siempre se muestra */}
      <div className="mt-6">
        <h2 className="font-semibold text-lg">Volumen</h2>
        <div className="flex gap-3 mt-2">
          {options.volumes?.map(volume => (
            <button
              key={volume._id}
              onClick={() => setSelectedVolume(volume)}
              className={`px-4 py-2 rounded-lg border ${
                selectedVolume?._id === volume._id
                  ? "bg-primary text-secondary"
                  : "border-gray-300"
              }`}
            >
              {volume.name} — ${volume.price}
            </button>
          ))}
        </div>
      </div>

      {/* Opciones solo para perfume customizable */}
      {isCustomizable && (
        <>
          {/* Concentración */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">Concentración</h2>
            <div className="flex gap-3 mt-2">
              {options.concentrations?.map(concentration => (
                <button
                  key={concentration._id}
                  onClick={() => setSelectedConcentration(concentration)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedConcentration?._id === concentration._id
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {concentration.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notas de salida */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">
              Notas de salida (maximo 3) — {notesOfType("salida").length}/3
            </h2>
            <div className="flex flex-wrap gap-3 mt-2">
              {topNotes.map(note => (
                <button
                  key={note._id}
                  onClick={() => handleNoteToggle(note)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedNotes.some(n => n._id === note._id)
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notas de corazon */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">
              Notas de corazon (maximo 3) — {notesOfType("corazon").length}/3
            </h2>
            <div className="flex flex-wrap gap-3 mt-2">
              {heartNotes.map(note => (
                <button
                  key={note._id}
                  onClick={() => handleNoteToggle(note)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedNotes.some(n => n._id === note._id)
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notas de base */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">
              Notas de base (maximo 3) — {notesOfType("base").length}/3
            </h2>
            <div className="flex flex-wrap gap-3 mt-2">
              {baseNotes.map(note => (
                <button
                  key={note._id}
                  onClick={() => handleNoteToggle(note)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedNotes.some(n => n._id === note._id)
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>
          </div>

          {/* Diseno de frasco */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">Diseno de frasco</h2>
            <div className="flex gap-3 mt-2">
              {options.bottleDesigns?.map(design => (
                <button
                  key={design._id}
                  onClick={() => setSelectedBottleDesign(design)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedBottleDesign?._id === design._id
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {design.name}
                </button>
              ))}
            </div>
          </div>

          {/* Embalaje */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">Embalaje</h2>
            <div className="flex gap-3 mt-2">
              {options.packagings?.map(packaging => (
                <button
                  key={packaging._id}
                  onClick={() => setSelectedPackaging(packaging)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedPackaging?._id === packaging._id
                      ? "bg-primary text-secondary"
                      : "border-gray-300"
                  }`}
                >
                  {packaging.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre de fragancia */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg">Nombre de tu fragancia</h2>
            <input
              type="text"
              maxLength={30}
              placeholder="Ej: Mi Esencia"
              value={fragranceName}
              onChange={(e) => setFragranceName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary"
            />
          </div>
        </>
      )}

      {/* Cantidad */}
      <div className="mt-6 flex items-center gap-4">
        <h2 className="font-semibold text-lg">Cantidad</h2>
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1 border rounded-lg"
        >-</button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1 border rounded-lg"
        >+</button>
      </div>

      {/* Boton agregar al carrito */}
      <button
        onClick={handleAddToCart}
        className="mt-8 w-full bg-primary text-secondary py-3 rounded-lg font-semibold"
      >
        Agregar al carrito
      </button>

    </div>
  );
}
