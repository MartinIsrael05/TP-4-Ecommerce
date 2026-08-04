import { createUser } from "@/lib/users/createUser";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return Response.json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 400 });
  }
}
