import mongoose from "mongoose";
import { getOrderById, updateOrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["Active", "Closed", "Shipped", "Canceled"];

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "ID inválido." }, { status: 400 });
  }

  try {
    const order = await getOrderById(id);
    if (!order) {
      return Response.json({ success: false, message: "Orden no encontrada." }, { status: 404 });
    }
    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ success: false, message: "ID inválido." }, { status: 400 });
  }

  try {
    const { status } = await request.json();

    if (!VALID_STATUSES.includes(status)) {
      return Response.json(
        { success: false, message: `Estado inválido. Debe ser uno de: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(id, status);
    if (!order) {
      return Response.json({ success: false, message: "Orden no encontrada." }, { status: 404 });
    }
    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
