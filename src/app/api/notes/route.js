import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { getNotes } from "@/lib/notes";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type) {
      await connectDB();
      const notes = await Note.find({ type }).sort({ name: 1 }).lean();
      return Response.json(notes.map(n => ({
        _id: n._id.toString(),
        name: n.name,
        type: n.type,
        image: n.image,
      })));
    }

    const notes = await getNotes();
    return Response.json(notes);
  } catch (error) {
    return Response.json({ error: "Error al obtener notas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const note = await Note.create({ name: body.name, type: body.type, image: body.image || "" });
    return Response.json(note);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await connectDB();
    await Note.findByIdAndDelete(id);
    return Response.json({ message: "Nota eliminada" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
