import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return Response.json({ success: false, message: 'Token and password are required' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return Response.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() as any },
    });

    if (!user) {
      return Response.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined as any;
    await user.save();

    return Response.json({ success: true, message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error', error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
