import { connectDB } from "@/lib/mongodb";
import { getProducts, searchProducts } from "@/lib/products";
import "@/models/Category";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    const products = q ? await searchProducts(q) : await getProducts();

    return Response.json(products);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener los productos", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      image: body.image,
      categories: body.categories,
    });

    return Response.json(product, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error al crear el producto", error: error.message },
      { status: 400 }
    );
  }
}
