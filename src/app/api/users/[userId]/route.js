import mongoose from "mongoose";
import { getUserById } from "@/lib/users/getUserById";

export async function GET(_request, { params }) {
  const { userId } = await params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ error: "ID de usuario inválido" }, { status: 400 });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
