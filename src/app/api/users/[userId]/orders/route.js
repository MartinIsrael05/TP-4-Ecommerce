import mongoose from "mongoose";
import { getOrdersByUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { userId } = await params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Response.json({ success: false, message: "ID de usuario inválido." }, { status: 400 });
  }

  try {
    const orders = await getOrdersByUser(userId);
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
