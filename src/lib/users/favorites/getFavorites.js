import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import "@/models/Product";

function serializeFavorite(p) {
  return {
    _id: p._id.toString(),
    name: p.name,
    description: p.description || "",
    price: p.price,
    stock: p.stock,
    image: p.image || "",
  };
}

export async function getFavorites({ userId }) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("ID de usuario inválido");

  const user = await User.findById(userId).populate("favorites").lean();
  if (!user) throw new Error("Usuario no encontrado");

  return (user.favorites || []).map(serializeFavorite);
}
