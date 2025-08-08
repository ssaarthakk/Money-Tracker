import mongoose, { Schema, Document } from "mongoose";

export interface Transaction extends Document {
    text: string;
    amount: number;
    user: string;
    tags: string;
}

const TransactionSchema: Schema<Transaction> = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Text is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    user: {
        type: String,
        required: [true, 'User missing in transaction'],
    },
    tags: {
        type: String,
        required: true,
        default: 'others',
        lowercase: true,
        trim: true,
    },
}, { timestamps: true });

const Transaction = mongoose.models?.Transaction || mongoose.model("Transaction", TransactionSchema)

export default Transaction;