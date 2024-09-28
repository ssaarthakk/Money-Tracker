import dbConnect from "@/lib/dbConnect";
import { auth } from "@/auth";
import Transaction from "@/models/transaction.model";

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
        const income = balance.filter( bal => (bal.amount > 0 )).reduce((acc, curr) => acc + curr.amount, 0);
        const expense = balance.filter( bal => (bal.amount < 0 )).reduce((acc, curr) => acc + curr.amount, 0);

        if (balance.length === 0) {
            return Response.json(
                { message: 'Error Calculating balance', success: true },
                { status: 500 }
            ); 
        }

        return Response.json(
            { message: 'Income Expense fetched', success: true, data: { income, expense } },
            { status: 200 }
        );

    } catch (error) {
        return Response.json(
            { success: false, message: 'Error getting income expense' },
            { status: 500 }
        );
    }
}