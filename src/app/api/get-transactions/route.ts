import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import Transaction from "@/models/transaction.model";

export async function GET(_: Request) {
    await dbConnect();

    const session = await auth();
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
    const transactions = await Transaction.find({ user: session.user.email });

    if (!transactions) {
        return Response.json(
            { success: false, message: 'Error getting transactions' },
            { status: 500 }
        );
    }

    return Response.json(
        { message: 'Transaction fetched successfully', success: true, transactions },
        { status: 200 }
    );

    } catch (error) {
        console.error('Error getting transactions: ', error);
        return Response.json(
            { success: false, message: 'Error getting transactions' },
            { status: 500 }
        );
    }
}