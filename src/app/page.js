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

  return (
    <main className="min-h-screen bg-background">
      <Hero />

      {/* Franja de categorías */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Link
              href="/categories"
              className="flex-shrink-0 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-secondary"
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat._id}`}
                className="flex-shrink-0 rounded-full border-2 border-gray-200 px-4 py-1.5 text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary font-sora">Nuestras fragancias</h2>
            <p className="mt-1 text-sm text-gray-500">Colección actual · {products.length} perfumes</p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}
