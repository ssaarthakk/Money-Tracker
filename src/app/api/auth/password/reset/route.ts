import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return Response.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return Response.json({ success: false, message: 'No account found for this email' }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return Response.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error', error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
