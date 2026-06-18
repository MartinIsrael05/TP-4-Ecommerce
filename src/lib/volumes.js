import { connectDB } from "@/lib/mongodb";
import Volume from "@/models/Volume";

function serializeVolume(volume) {
  return {
    _id: volume._id.toString(),
    name: volume.name,
    price: volume.price,
    image: volume.image,
    createdAt: volume.createdAt?.toISOString(),
    updatedAt: volume.updatedAt?.toISOString(),
  };
}

export async function getVolumes() {
  await connectDB();
  const volumes = await Volume.find().sort({ price: 1 }).lean();
  return volumes.map(serializeVolume);
}
