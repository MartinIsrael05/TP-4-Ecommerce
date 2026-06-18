import { connectDB } from "@/lib/mongodb";
import BottleDesign from "@/models/BottleDesign";

function serializeBottleDesign(bottleDesign) {
  return {
    _id: bottleDesign._id.toString(),
    name: bottleDesign.name,
    image: bottleDesign.image,
    createdAt: bottleDesign.createdAt?.toISOString(),
    updatedAt: bottleDesign.updatedAt?.toISOString(),
  };
}

export async function getBottleDesigns() {
  await connectDB();
  const bottleDesigns = await BottleDesign.find().sort({ createdAt: -1 }).lean();
  return bottleDesigns.map(serializeBottleDesign);
}
