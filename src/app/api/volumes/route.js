import { connectDB } from "@/lib/mongodb";
import Volume from "@/models/Volume";
import { getVolumes } from "@/lib/volumes";

export async function GET() {
  try {
    const volumes = await getVolumes();
    return Response.json(volumes);
  } catch (error) {
    return Response.json({ error: "Error al obtener volumenes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Volume.create({ name: body.name, price: body.price, image: body.image || "" });
    return Response.json(item);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Volume.findByIdAndDelete(id);
    return Response.json({ message: "Volumen eliminado" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
