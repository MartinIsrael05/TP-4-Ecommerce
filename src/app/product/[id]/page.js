import { getProductById } from "@/lib/products";
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
    return <p>Producto no encontrado</p>;
  }

  const isCustomizable = product.categories.some(
    (cat) => cat.name?.toLowerCase() === "creá tu perfume" ||
             cat.name?.toLowerCase() === "crea tu perfume"
  );

  let options = {};

  if (isCustomizable) {
    const [volumes, concentrations, notes, bottleDesigns, packagings] = await Promise.all([
      getVolumes(),
      getConcentrations(),
      getNotes(),
      getBottleDesigns(),
      getPackagings(),
    ]);

    options = { volumes, concentrations, notes, bottleDesigns, packagings };
  } else {
    const volumes = await getVolumes();
    options = { volumes };
  }

  return (
    <ProductDetail
      product={product}
      isCustomizable={isCustomizable}
      options={options}
    />
  );
}
