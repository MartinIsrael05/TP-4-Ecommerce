import { createOrder, getAllOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, customerInfo, items, total } = body;

    if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.address) {
      return Response.json(
        { success: false, message: "Faltan datos del comprador." },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return Response.json(
        { success: false, message: "El carrito está vacío." },
        { status: 400 }
      );
    }

    const order = await createOrder({ userId, customerInfo, items, total });
    return Response.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message || "Error al crear la orden." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
