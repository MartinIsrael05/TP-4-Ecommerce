import mongoose from "mongoose";
import { syncFavorites } from "@/lib/users/favorites/syncFavorites";

export async function PUT(request, { params }) {
  const { userId } = await params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ success: false, message: "ID inválido" }, { status: 400 });
  }

  try {
    const { favoriteIds } = await request.json();
    const favorites = await syncFavorites({ userId, favoriteIds });
    return Response.json({ success: true, favorites });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 400 });
  }
}
