import { loginUser } from "@/lib/users/loginUser";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await loginUser({
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
