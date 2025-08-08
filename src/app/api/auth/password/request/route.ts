import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ success: false, message: 'Email is required' }, { status: 400 });

    await dbConnect();
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  const exists = !!user;
  return Response.json({ success: true, exists }, { status: 200 });
  } catch (error) {
    console.error('Password reset request error', error);
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
