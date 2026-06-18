import mongoose from "mongoose";

const bottleDesignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const BottleDesign =
  mongoose.models.BottleDesign || mongoose.model("BottleDesign", bottleDesignSchema);
export default BottleDesign;
