import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import Transaction from "@/models/transaction.model";

export async function POST(request: Request) {
    const { transactionfor, amount, tags } = await request.json();
    await dbConnect();

    const session = await auth();
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        if (+amount < 0) {
            await Transaction.create({
                text: transactionfor,
                amount,
                tags,
                user: session.user.email
            })
        } else {
            await Transaction.create({
                text: transactionfor,
                amount,
                tags: "",
                user: session.user.email
            })
        }

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