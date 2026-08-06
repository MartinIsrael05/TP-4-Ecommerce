import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Counter from "@/models/Counter";
import Order from "@/models/Order";

function serializeOrder(order) {
  return {
    _id: order._id.toString(),
    orderNumber: order.orderNumber,
    user: order.user ? order.user.toString() : null,
    customerInfo: order.customerInfo,
    items: order.items.map((item) => ({
      ...item,
      productId: item.productId ? item.productId.toString() : null,
    })),
    total: order.total,
    status: order.status,
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  };
}

async function nextOrderNumber() {
  const counter = await Counter.findByIdAndUpdate(
    "orders",
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return 1000 + counter.seq;
}

export async function createOrder({ userId, customerInfo, items, total }) {
  await connectDB();

  const orderNumber = await nextOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null,
    customerInfo,
    items,
    total,
  });

  return serializeOrder(order.toObject());
}

export async function getOrdersByUser(userId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(userId)) return [];

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(serializeOrder);
}

export async function getOrderById(orderId) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(orderId)) return null;

  const order = await Order.findById(orderId).lean();
  return order ? serializeOrder(order) : null;
}

export async function getAllOrders() {
  await connectDB();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(serializeOrder);
}

export async function updateOrderStatus(orderId, status) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(orderId)) return null;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  ).lean();

  return order ? serializeOrder(order) : null;
}
