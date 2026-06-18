import { connectDB } from "@/lib/mongodb";
import Packaging from "@/models/Packaging";

function serializePackaging(packaging) {
  return {
    _id: packaging._id.toString(),
    name: packaging.name,
    image: packaging.image,
    createdAt: packaging.createdAt?.toISOString(),
    updatedAt: packaging.updatedAt?.toISOString(),
  };
}

export async function getPackagings() {
  await connectDB();
  const packagings = await Packaging.find().sort({ createdAt: -1 }).lean();
  return packagings.map(serializePackaging);
}
