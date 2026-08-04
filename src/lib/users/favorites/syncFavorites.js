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

// Combina los IDs locales con los ya persistidos en DB, evitando duplicados.
export async function syncFavorites({ userId, favoriteIds }) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("ID de usuario inválido");

  const validIds = (favoriteIds || []).filter((id) => mongoose.Types.ObjectId.isValid(id));

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const existingIds = user.favorites.map((id) => id.toString());
  const merged = [...new Set([...existingIds, ...validIds])];
  user.favorites = merged;
  await user.save();

  await user.populate("favorites");
  return user.favorites.map(serializeFavorite);
}
