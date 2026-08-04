import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function loginUser({ email, password }) {
  await connectDB();

  if (!email || email.trim() === "") throw new Error("El email es obligatorio");
  if (!password || password === "") throw new Error("La contraseña es obligatoria");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Credenciales inválidas");

  if (user.password !== password) throw new Error("Credenciales inválidas");

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}
