import mongoose from "mongoose";

const concentrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Concentration =
  mongoose.models.Concentration || mongoose.model("Concentration", concentrationSchema);
export default Concentration;
