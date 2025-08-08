import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/transaction.model";
import { auth } from "@/auth";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { id }: { id: string } = await request.json();

    try {
        const session = await auth();
        if (!session || !session.user) {
            return Response.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }
        await dbConnect();
        await Transaction.deleteOne({ _id: id, user: session.user.email as string })

        return Response.json(
            { message: 'Transaction Deleted successfully', success: true },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error Deleting transactions: ', error);
        return Response.json(
            { success: false, message: 'Error Deleting transactions' },
            { status: 500 }
        );
    }
}