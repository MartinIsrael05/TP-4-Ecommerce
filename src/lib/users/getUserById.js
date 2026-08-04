import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getUserById(userId) {
  await connectDB();

  const user = await User.findById(userId).select("-password").lean();
  if (!user) return null;

  return {
    ...user,
    _id: user._id.toString(),
    favorites: (user.favorites || []).map((id) => id.toString()),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}
