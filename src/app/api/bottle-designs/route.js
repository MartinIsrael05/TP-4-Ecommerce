import { connectDB } from "@/lib/mongodb";
import BottleDesign from "@/models/BottleDesign";
import { getBottleDesigns } from "@/lib/bottleDesigns";

export async function GET() {
  try {
    const bottleDesigns = await getBottleDesigns();
    return Response.json(bottleDesigns);
  } catch (error) {
    return Response.json({ error: "Error al obtener disenos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await BottleDesign.create({ name: body.name, image: body.image || "" });
    return Response.json(item);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await BottleDesign.findByIdAndDelete(id);
    return Response.json({ message: "Diseno eliminado" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
