import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import crypto from "crypto";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ success: false, message: 'Email is required' }, { status: 400 });

    await dbConnect();
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return Response.json({ success: true, message: 'If the email exists, a reset link will be sent.' }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires as any;
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const link = `${baseUrl}/reset-password?token=${token}`;

    return Response.json({ success: true, message: 'Reset link generated', link }, { status: 200 });
  } catch (error) {
    console.error('Password reset request error', error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
