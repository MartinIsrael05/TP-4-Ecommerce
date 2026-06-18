import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["salida", "corazon", "base"] },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;
