import { connectDB } from "@/lib/mongodb";
import Concentration from "@/models/Concentration";
import { getConcentrations } from "@/lib/concentrations";

export async function GET() {
  try {
    const concentrations = await getConcentrations();
    return Response.json(concentrations);
  } catch (error) {
    return Response.json({ error: "Error al obtener concentraciones" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const item = await Concentration.create({ name: body.name, priceModifier: body.priceModifier || 0, image: body.image || "" });
    return Response.json(item);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Concentration.findByIdAndDelete(id);
    return Response.json({ message: "Concentracion eliminada" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
