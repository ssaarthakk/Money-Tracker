import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import Transaction from "@/models/transaction.model";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { transactionfor, amount, tags } = await request.json();
    const numericAmount = Number(amount);
    await dbConnect();

    const session = await auth();
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        await Transaction.create({
            text: transactionfor,
            amount: numericAmount,
            tags: (tags || 'others').toString().trim().toLowerCase(),
            user: session.user.email,
        })

        return Response.json(
            { message: 'Transaction Added successfully', success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error adding transactions: ', error);
        return Response.json(
            { success: false, message: 'Error adding transactions' },
            { status: 500 }
        );
    }
}