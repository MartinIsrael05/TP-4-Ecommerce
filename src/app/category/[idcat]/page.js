import Link from "next/link";
import { notFound } from "next/navigation";

import ProductFilterGrid from "@/components/ProductFilterGrid";
import { getCategoryById } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { idcat } = await params;
  const category = await getCategoryById(idcat);
  if (!category) return { title: "Categoría no encontrada | FRAGMENTE" };

  return {
    title: `${category.name} | FRAGMENTE`,
    description:
      category.description ||
      `Explorá los perfumes de la categoría ${category.name} en FRAGMENTE.`,
  };
}

export default async function CategoryProductsPage({ params }) {
  const { idcat } = await params;
  const category = await getCategoryById(idcat);

  if (!category) {
    notFound();
  }

  const allProducts = await getProductsByCategory(category._id);
  // Excluir el producto personalizable. Tiene su propio banner en la home
  const products = allProducts.filter(
    (p) => !Array.isArray(p.customizableOptions) || p.customizableOptions.length <= 1
  );

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          className="text-sm font-medium text-primary hover:underline"
          href="/"
        >
          Volver al catalogo
        </Link>

        <section className="mb-8 mt-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/60">
            Categoria
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              {category.description}
            </p>
          ) : null}
        </section>

        <ProductFilterGrid products={products} />
      </div>
    </main>
  );
}
