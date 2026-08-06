import Link from "next/link";

function PlaceholderImage({ name }) {
  const initial = name ? name[0].toUpperCase() : "◈";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <span className="text-4xl font-bold font-sora text-primary/20 leading-none select-none">
        {initial}
      </span>
      <span className="mt-2 text-[10px] tracking-[0.3em] uppercase text-primary/20 font-medium">
        FRAGMENTE
      </span>
    </div>
  );
}

export default function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 text-sm">
        No hay productos disponibles.
      </p>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/product/${product._id}`}
          className="group block"
        >
          <article className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-accent hover:shadow-md transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              {product.image ? (
                <img
                  src={`/images/products/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <PlaceholderImage name={product.name} />
              )}
            </div>

            <div className="px-4 py-3.5">
              <h2 className="font-semibold text-primary text-sm leading-tight line-clamp-2">
                {product.name}
              </h2>

              {product.description && (
                <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                  {product.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-accent text-sm">
                  desde ${product.price}
                </span>
                <span className="text-xs text-gray-300 group-hover:text-accent transition-colors duration-200">
                  →
                </span>
              </div>

              {product.categories?.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {product.categories.slice(0, 2).map((cat) =>
                    typeof cat === "object" && cat?.name ? (
                      <span
                        key={cat._id}
                        className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary/60"
                      >
                        {cat.name}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
