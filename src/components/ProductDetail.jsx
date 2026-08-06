"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";

const concentrationInfo = {
  EDT: "Eau de Toilette — Ligera, ideal para el dia",
  EDP: "Eau de Parfum — Mayor duracion e intensidad",
  Parfum: "Parfum — Maxima concentracion y persistencia",
};

export default function ProductDetail({ product, isCustomizable, options, relatedProducts = [] }) {
  const { addToCart, addFavorite, removeFavorite, isFavorite } = useAppContext();

  const [selectedVolume, setSelectedVolume] = useState(null);
  const [selectedConcentration, setSelectedConcentration] = useState(null);
  const [selectedBottleDesign, setSelectedBottleDesign] = useState(null);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [fragranceName, setFragranceName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const isFav = isFavorite(product._id);

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(product._id);
    } else {
      addFavorite({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      });
    }
  };

  const topNotes = (options.notes || []).filter((n) => n.type === "salida");
  const heartNotes = (options.notes || []).filter((n) => n.type === "corazon");
  const baseNotes = (options.notes || []).filter((n) => n.type === "base");

  const handleNoteToggle = (note) => {
    const exists = selectedNotes.some((n) => n._id === note._id);
    if (exists) {
      setSelectedNotes(selectedNotes.filter((n) => n._id !== note._id));
    } else {
      if (selectedNotes.filter((n) => n.type === note.type).length >= 3) return;
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const notesOfType = (type) => selectedNotes.filter((n) => n.type === type);

  const basePrice = selectedVolume
    ? isCustomizable
      ? selectedVolume.price
      : Math.round(product.price * (selectedVolume.priceMultiplier ?? 1))
    : 0;
  const concentrationExtra = selectedConcentration?.priceModifier || 0;
  const totalPrice = (basePrice + concentrationExtra) * quantity;

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

    const price = basePrice + concentrationExtra;
    addToCart({ ...product, price }, customizations, quantity);
  };

  if (!isCustomizable) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-accent transition-colors mb-8">
          ← Volver al catálogo
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Imagen */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-primary/5 sticky top-6">
            {product.image ? (
              <img
                src={`/images/products/${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-7xl font-bold font-sora text-primary/20 leading-none">
                  {product.name[0]}
                </span>
                <span className="text-xs tracking-[0.4em] uppercase text-primary/20">FRAGMENTE</span>
              </div>
            )}
          </div>

          {/* Información */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary font-sora">{product.name}</h1>
                {product.categories?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.categories.map((cat) =>
                      typeof cat === "object" ? (
                        <span
                          key={cat._id}
                          className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium"
                        >
                          {cat.name}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleToggleFavorite}
                title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                className={`p-2.5 rounded-full border-2 transition-colors flex-shrink-0 ${
                  isFav
                    ? "border-accent text-accent bg-accent/10"
                    : "border-gray-200 text-gray-400 hover:border-accent hover:text-accent"
                }`}
              >
                <HeartIcon filled={isFav} />
              </button>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
            <p className="mt-3 text-2xl font-bold text-accent">desde ${product.price}</p>
            <p className={`mt-1 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock"}
            </p>

            <div className="mt-6">
              <h2 className="font-semibold text-lg">Volumen</h2>
              <div className="flex gap-3 mt-2 flex-wrap">
                {options.volumes?.map((volume) => (
                  <button
                    key={volume._id}
                    onClick={() => setSelectedVolume(volume)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedVolume?._id === volume._id
                        ? "border-accent bg-accent/10 text-primary font-semibold"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {volume.name} — ${Math.round(product.price * (volume.priceMultiplier ?? 1))}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <h2 className="font-semibold text-lg">Cantidad</h2>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= product.stock}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
              {quantity >= product.stock && (
                <span className="text-xs text-red-400 font-medium">Máximo disponible</span>
              )}
            </div>

            {selectedVolume && (
              <div className="mt-6 rounded-xl bg-primary/5 p-4">
                <p className="text-2xl font-bold text-primary">${basePrice * quantity}</p>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!selectedVolume}
              className="mt-6 w-full bg-primary text-secondary py-3 rounded-lg font-semibold disabled:opacity-40 hover:bg-primary-hover transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <RelatedProductsSection products={relatedProducts} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-accent transition-colors mb-8">
        ← Volver al catálogo
      </Link>

      {/* Encabezado */}
      <div className="text-center mb-10 relative">
        <button
          onClick={handleToggleFavorite}
          title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={`absolute top-0 right-0 p-2.5 rounded-full border-2 transition-colors ${
            isFav
              ? "border-accent text-accent bg-accent/10"
              : "border-gray-200 text-gray-400 hover:border-accent hover:text-accent"
          }`}
        >
          <HeartIcon filled={isFav} />
        </button>

        {product.image && (
          <div className="w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-accent/20">
            <img
              src={`/images/products/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">Experiencia exclusiva</p>
        <h1 className="text-4xl font-bold text-primary font-sora mt-2">{product.name}</h1>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{product.description}</p>

        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          {product.categories?.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center">
              {product.categories.map((cat) =>
                typeof cat === "object" ? (
                  <span
                    key={cat._id}
                    className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium"
                  >
                    {cat.name}
                  </span>
                ) : null
              )}
            </div>
          )}
          <span className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </span>
        </div>
      </div>

      {/* Paso 1: Volumen */}
      <Section step="1" title="Elegí el volumen" icon={<DropletIcon />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.volumes?.map((volume) => (
            <button
              key={volume._id}
              onClick={() => setSelectedVolume(volume)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                selectedVolume?._id === volume._id
                  ? "border-accent bg-accent-light"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="text-2xl font-bold text-primary">{volume.name}</span>
              <span className="text-sm text-accent font-semibold">${volume.price}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Paso 2: Concentracion */}
      <Section step="2" title="Elegí la concentración" icon={<FlaskIcon />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {options.concentrations?.map((concentration) => (
            <button
              key={concentration._id}
              onClick={() => setSelectedConcentration(concentration)}
              className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all ${
                selectedConcentration?._id === concentration._id
                  ? "border-accent bg-accent-light"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-primary text-lg">{concentration.name}</span>
                {concentration.priceModifier > 0 && (
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    +${concentration.priceModifier}
                  </span>
                )}
                {concentration.priceModifier === 0 && (
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Base
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {concentrationInfo[concentration.name] || ""}
              </p>
            </button>
          ))}
        </div>
      </Section>

      {/* Paso 3: Notas olfativas */}
      <Section step="3" title="Seleccioná tus notas" icon={<SparklesIcon />}>
        <NoteSelector
          label="Notas de salida"
          subtitle="Las primeras que se perciben"
          notes={topNotes}
          selected={selectedNotes}
          max={3}
          count={notesOfType("salida").length}
          color="amber"
          onToggle={handleNoteToggle}
        />
        <NoteSelector
          label="Notas de corazon"
          subtitle="El caracter principal de la fragancia"
          notes={heartNotes}
          selected={selectedNotes}
          max={3}
          count={notesOfType("corazon").length}
          color="rose"
          onToggle={handleNoteToggle}
        />
        <NoteSelector
          label="Notas de base"
          subtitle="La persistencia y profundidad"
          notes={baseNotes}
          selected={selectedNotes}
          max={3}
          count={notesOfType("base").length}
          color="stone"
          onToggle={handleNoteToggle}
        />
      </Section>

      {/* Paso 4: Frasco y embalaje */}
      <Section step="4" title="Personalizá tu frasco" icon={<BoxIcon />}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Diseño de frasco</h3>
            <div className="flex gap-3 flex-wrap">
              {options.bottleDesigns?.map((design) => (
                <button
                  key={design._id}
                  onClick={() => setSelectedBottleDesign(design)}
                  className={`flex-1 min-w-[100px] rounded-xl border-2 p-4 text-center transition-all ${
                    selectedBottleDesign?._id === design._id
                      ? "border-accent bg-accent-light"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="font-semibold text-primary">{design.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Embalaje</h3>
            <div className="flex gap-3 flex-wrap">
              {options.packagings?.map((packaging) => (
                <button
                  key={packaging._id}
                  onClick={() => setSelectedPackaging(packaging)}
                  className={`flex-1 min-w-[100px] rounded-xl border-2 p-4 text-center transition-all ${
                    selectedPackaging?._id === packaging._id
                      ? "border-accent bg-accent-light"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="font-semibold text-primary">{packaging.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Paso 5: Nombre */}
      <Section step="5" title="Dale un nombre a tu fragancia" icon={<PenIcon />}>
        <input
          type="text"
          maxLength={30}
          placeholder="Ej: Mi Esencia, Noche de Luna..."
          value={fragranceName}
          onChange={(e) => setFragranceName(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 text-lg outline-none focus:border-accent transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">{fragranceName.length}/30 caracteres</p>
      </Section>

      {/* Resumen de precio + carrito */}
      <div className="mt-10 rounded-2xl bg-primary p-6 text-secondary">
        <h3 className="text-sm uppercase tracking-wider text-secondary/60 font-semibold">Resumen de tu fragancia</h3>

        <div className="mt-4 space-y-2 text-sm">
          <PriceLine label="Volumen" value={selectedVolume ? `${selectedVolume.name} — $${selectedVolume.price}` : "Sin seleccionar"} />
          <PriceLine
            label="Concentracion"
            value={
              selectedConcentration
                ? `${selectedConcentration.name}${concentrationExtra > 0 ? ` (+$${concentrationExtra})` : " (incluido)"}`
                : "Sin seleccionar"
            }
          />
          <PriceLine label="Notas" value={selectedNotes.length > 0 ? selectedNotes.map((n) => n.name).join(", ") : "Sin seleccionar"} />
          <PriceLine label="Frasco" value={selectedBottleDesign?.name || "Sin seleccionar"} />
          <PriceLine label="Embalaje" value={selectedPackaging?.name || "Sin seleccionar"} />
          {fragranceName && <PriceLine label="Nombre" value={`"${fragranceName}"`} />}
        </div>

        <div className="mt-4 pt-4 border-t border-secondary/20 flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary/60">Precio unitario</p>
            <p className="text-3xl font-bold">
              {selectedVolume ? `$${basePrice + concentrationExtra}` : "—"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20"
              >
                -
              </button>
              <span className="text-lg font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {quantity >= product.stock && (
              <span className="text-[10px] text-red-300 font-medium">Stock máximo</span>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm text-secondary/60">Total</p>
            <p className="text-3xl font-bold text-accent">
              {totalPrice > 0 ? `$${totalPrice}` : "—"}
            </p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedVolume || !selectedConcentration}
          className="mt-4 w-full bg-accent text-white py-3.5 rounded-xl font-semibold text-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Agregar al carrito
        </button>
      </div>

      <RelatedProductsSection products={relatedProducts} />
    </div>
  );
}

function Section({ step, title, icon, children }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
          {step}
        </div>
        <div className="w-5 h-5 text-accent">{icon}</div>
        <h2 className="text-xl font-bold text-primary font-sora">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function NoteSelector({ label, subtitle, notes, selected, max, count, color, onToggle }) {
  const colorMap = {
    amber: { active: "border-amber-500 bg-amber-50 text-amber-900", badge: "bg-amber-100 text-amber-800" },
    rose: { active: "border-rose-500 bg-rose-50 text-rose-900", badge: "bg-rose-100 text-rose-800" },
    stone: { active: "border-stone-500 bg-stone-100 text-stone-900", badge: "bg-stone-200 text-stone-800" },
  };
  const colors = colorMap[color] || colorMap.amber;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-primary">{label}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.badge}`}>
          {count}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {notes.map((note) => {
          const isSelected = selected.some((n) => n._id === note._id);
          return (
            <button
              key={note._id}
              onClick={() => onToggle(note)}
              className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                isSelected ? colors.active : "border-gray-200 hover:border-gray-400 text-gray-600"
              }`}
            >
              {note.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceLine({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-secondary/60">{label}</span>
      <span className="text-secondary font-medium">{value}</span>
    </div>
  );
}

function RelatedProductsSection({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-14 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-primary font-sora mb-6">Productos relacionados</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p._id}`}
            className="group block rounded-xl border border-gray-200 overflow-hidden hover:border-accent transition-colors duration-300"
          >
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img
                  src={`/images/products/${p.image}`}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <span className="text-4xl text-gray-300">◈</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-primary text-sm line-clamp-2">{p.name}</h3>
              <p className="text-accent font-bold text-sm mt-1">desde ${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c0 0-6.75 8.25-6.75 12.75a6.75 6.75 0 0 0 13.5 0C18.75 10.5 12 2.25 12 2.25Z" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5l-.938 2.813A2.25 2.25 0 0 0 6.2 20.25h11.6a2.25 2.25 0 0 0 2.138-2.937L19 14.5m-14 0h14" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  );
}
