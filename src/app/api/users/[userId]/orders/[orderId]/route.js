import mongoose from "mongoose";
import { getOrderById } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { userId, orderId } = await params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    return Response.json({ success: false, message: "ID inválido." }, { status: 400 });
  }

  try {
    const order = await getOrderById(orderId);

    if (!order) {
      return Response.json({ success: false, message: "Orden no encontrada." }, { status: 404 });
    }

    if (order.user !== userId) {
      return Response.json({ success: false, message: "No tenés acceso a esta orden." }, { status: 403 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
