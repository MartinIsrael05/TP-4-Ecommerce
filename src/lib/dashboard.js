import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import "@/models/Category";

export async function getDashboardStats() {
  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [recentOrders, monthlyOrders, totalOrders, recentUsers, totalUsers, lowStockProducts] =
    await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.find({ createdAt: { $gte: startOfMonth } }).select("total").lean(),
      Order.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password").lean(),
      User.countDocuments(),
      Product.find({ stock: { $lte: 1 } }).populate("categories").limit(10).lean(),
    ]);

  const monthlyTotal = monthlyOrders.reduce((sum, o) => sum + o.total, 0);

  return {
    recentOrders: recentOrders.map((o) => ({
      _id: o._id.toString(),
      orderNumber: o.orderNumber,
      customerName: o.customerInfo?.name ?? "—",
      itemCount: o.items?.length ?? 0,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    })),
    monthlyTotal,
    monthlyOrderCount: monthlyOrders.length,
    totalOrders,
    recentUsers: recentUsers.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    })),
    totalUsers,
    lowStockProducts: lowStockProducts.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      stock: p.stock,
      image: p.image,
    })),
  };
}
