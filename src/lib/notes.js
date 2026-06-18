import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

function serializeNote(note) {
  return {
    _id: note._id.toString(),
    name: note.name,
    type: note.type,
    image: note.image,
    createdAt: note.createdAt?.toISOString(),
    updatedAt: note.updatedAt?.toISOString(),
  };
}

export async function getNotes() {
  await connectDB();
  const notes = await Note.find().sort({ type: 1, name: 1 }).lean();
  return notes.map(serializeNote);
}
