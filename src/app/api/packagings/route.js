import { connectDB } from "@/lib/mongodb";
import Packaging from "@/models/Packaging";
import { getPackagings } from "@/lib/packagings";

export async function GET() {
  try {
    const packagings = await getPackagings();
    return Response.json(packagings);
  } catch (error) {
    return Response.json({ error: "Error al obtener embalajes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Packaging.create({ name: body.name, image: body.image || "" });
    return Response.json(item);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Packaging.findByIdAndDelete(id);
    return Response.json({ message: "Embalaje eliminado" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
