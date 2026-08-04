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

export async function removeFavorite({ userId, productId }) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("ID de usuario inválido");
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error("ID de producto inválido");

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  await user.save();

  await user.populate("favorites");
  return user.favorites.map(serializeFavorite);
}
