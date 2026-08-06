import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Producto personalizable: el que tiene más opciones que solo "volume"
  const customProduct = products.find(
    (p) => Array.isArray(p.customizableOptions) && p.customizableOptions.length > 1
  );

  // El producto personalizable solo aparece en el banner, no en la grilla regular
  const regularProducts = customProduct
    ? products.filter((p) => p._id !== customProduct._id)
    : products;

  return (
    <main className="min-h-screen bg-secondary">
      <Hero customProductId={customProduct?._id ?? null} />

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/categories"
              className="flex-shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-secondary tracking-wide"
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat._id}`}
                className="flex-shrink-0 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">
              Colección
            </p>
            <h2 className="mt-1 text-2xl font-bold text-primary font-sora">
              Nuestras fragancias
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {regularProducts.length} perfumes disponibles
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <ProductGrid products={regularProducts} />
      </section>

      {customProduct && (
        <section id="personalizado" className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-3xl bg-primary px-8 py-12 text-center relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #b8860b 0%, transparent 65%)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-5"
              style={{ background: "radial-gradient(circle, #FFF8F0 0%, transparent 65%)" }}
            />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.5em] text-accent font-semibold">
                Experiencia exclusiva
              </p>
              <h2 className="mt-3 font-sora font-bold text-secondary text-3xl sm:text-4xl">
                Diseñá tu fragancia
              </h2>
              <p className="mt-4 text-secondary/50 max-w-sm mx-auto text-sm leading-relaxed">
                Elegí el volumen, la concentración, las notas olfativas, el frasco
                y el embalaje. Tu perfume, tu firma personal.
              </p>
              <Link
                href={`/product/${customProduct._id}`}
                className="mt-8 inline-block bg-accent text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:brightness-110 transition-all"
              >
                Empezar ahora →
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
