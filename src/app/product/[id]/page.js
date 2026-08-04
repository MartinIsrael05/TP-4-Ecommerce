import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/products";
import { getNotes } from "@/lib/notes";
import { getConcentrations } from "@/lib/concentrations";
import { getVolumes } from "@/lib/volumes";
import { getBottleDesigns } from "@/lib/bottleDesigns";
import { getPackagings } from "@/lib/packagings";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isCustomizable = product.categories.some(
    (cat) =>
      cat.name?.toLowerCase() === "creá tu perfume" ||
      cat.name?.toLowerCase() === "crea tu perfume"
  );

  const categoryIds = product.categories.map((cat) => cat._id);

  const [volumes, concentrations, notes, bottleDesigns, packagings, relatedProducts] =
    await Promise.all([
      getVolumes(),
      isCustomizable ? getConcentrations() : Promise.resolve([]),
      isCustomizable ? getNotes() : Promise.resolve([]),
      isCustomizable ? getBottleDesigns() : Promise.resolve([]),
      isCustomizable ? getPackagings() : Promise.resolve([]),
      getRelatedProducts(id, categoryIds),
    ]);

  const options = isCustomizable
    ? { volumes, concentrations, notes, bottleDesigns, packagings }
    : { volumes };

  return (
    <ProductDetail
      product={product}
      isCustomizable={isCustomizable}
      options={options}
      relatedProducts={relatedProducts}
    />
  );
}
