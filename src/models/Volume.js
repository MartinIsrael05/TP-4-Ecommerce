import mongoose from "mongoose";

const volumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Volume = mongoose.models.Volume || mongoose.model("Volume", volumeSchema);
export default Volume;
