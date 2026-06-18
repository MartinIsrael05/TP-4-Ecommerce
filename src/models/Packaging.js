import mongoose from "mongoose";

const packagingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Packaging =
  mongoose.models.Packaging || mongoose.model("Packaging", packagingSchema);
export default Packaging;
