import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function createUser({ name, email, password }) {
  await connectDB();

  if (!name || name.trim() === "") throw new Error("El nombre es obligatorio");
  if (!email || email.trim() === "") throw new Error("El email es obligatorio");
  if (!password || password === "") throw new Error("La contraseña es obligatoria");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("El email ya está registrado");

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    favorites: [],
  });

  // Devuelve el usuario sin contraseña
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}
