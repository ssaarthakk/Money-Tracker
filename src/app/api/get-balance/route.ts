import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import Transaction from "@/models/transaction.model";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    
    const session = await auth();
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    
    try {
        await dbConnect();

        const balance = await Transaction.find({ user: session.user.email }, 'amount');
        
        if (!balance) {
            return Response.json(
                { message: 'Error Calculating balance', success: true },
                { status: 501 }
            ); 
        }
        
        const total = balance.reduce((acc, curr) => acc + curr.amount, 0);

        return Response.json(
            { message: 'SuccessFully Fetched Balance', success: true, balance: total },
            { status: 200 }
        );

    } catch (error) {
        return Response.json(
            { success: false, message: 'Error getting balance', error },
            { status: 500 }
        );
    }
}