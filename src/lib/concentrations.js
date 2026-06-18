import { connectDB } from "@/lib/mongodb";
import Concentration from "@/models/Concentration";

function serializeConcentration(concentration) {
  return {
    _id: concentration._id.toString(),
    name: concentration.name,
    image: concentration.image,
    createdAt: concentration.createdAt?.toISOString(),
    updatedAt: concentration.updatedAt?.toISOString(),
  };
}

export async function getConcentrations() {
  await connectDB();
  const concentrations = await Concentration.find().sort({ createdAt: -1 }).lean();
  return concentrations.map(serializeConcentration);
}
