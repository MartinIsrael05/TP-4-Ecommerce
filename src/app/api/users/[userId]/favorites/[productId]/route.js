import mongoose from "mongoose";
import { removeFavorite } from "@/lib/users/favorites/removeFavorite";

export async function DELETE(_request, { params }) {
  const { userId, productId } = await params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return Response.json({ success: false, message: "ID inválido" }, { status: 400 });
  }

  try {
    const favorites = await removeFavorite({ userId, productId });
    return Response.json({ success: true, favorites });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 400 });
  }
}
