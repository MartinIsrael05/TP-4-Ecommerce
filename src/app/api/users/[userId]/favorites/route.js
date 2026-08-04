import mongoose from "mongoose";
import { getFavorites } from "@/lib/users/favorites/getFavorites";
import { addFavorite } from "@/lib/users/favorites/addFavorite";

export async function GET(_request, { params }) {
  const { userId } = await params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ success: false, message: "ID inválido" }, { status: 400 });
  }
  try {
    const favorites = await getFavorites({ userId });
    return Response.json({ success: true, favorites });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { userId } = await params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ success: false, message: "ID inválido" }, { status: 400 });
  }
  try {
    const { productId } = await request.json();
    const favorites = await addFavorite({ userId, productId });
    return Response.json({ success: true, favorites });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 400 });
  }
}
