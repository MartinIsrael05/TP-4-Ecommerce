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

  const opts = product.customizableOptions ?? ["volume"];
  const isCustomizable = opts.some((opt) => opt !== "volume");

  const categoryIds = product.categories.map((cat) => cat._id);

  const [volumes, concentrations, notes, bottleDesigns, packagings, relatedProducts] =
    await Promise.all([
      getVolumes(),
      opts.includes("concentration") ? getConcentrations() : Promise.resolve([]),
      opts.includes("notes") ? getNotes() : Promise.resolve([]),
      opts.includes("bottleDesign") ? getBottleDesigns() : Promise.resolve([]),
      opts.includes("packaging") ? getPackagings() : Promise.resolve([]),
      getRelatedProducts(id, categoryIds),
    ]);

  const options = { volumes, concentrations, notes, bottleDesigns, packagings };

  return (
    <ProductDetail
      product={product}
      isCustomizable={isCustomizable}
      options={options}
      relatedProducts={relatedProducts}
    />
  );
}
