import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const { password } = await request.json();
    if (typeof password !== 'string' || password.length < 6) {
      return Response.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!user) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return Response.json({ success: true, message: 'Password set successfully' }, { status: 200 });
  } catch (error) {
    console.error('Set password error', error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
