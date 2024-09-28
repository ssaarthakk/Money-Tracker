import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/transaction.model";

export async function POST(request: Request) {
    const { id }: { id: string } = await request.json();

    try {
        await dbConnect();
        await Transaction.deleteOne({ _id: id })

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