import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (typeof password !== 'string' || password.length < 6) {
      return Response.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return Response.json({ success: false, message: "Email is already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email: normalizedEmail, password: hashed });

    return Response.json({ success: true, message: "Account created" }, { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    return Response.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
