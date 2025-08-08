'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
import { useEffect, useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useRes from "@/lib/store";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function CheckMark() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )
}

function LoadingArrows() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    )
}

function DeleteButton() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    )
}

function TransactionList() {

    const resp = useRes((state: any) => state.res)
    const changeRess: any = useRes((state: any) => state.changeRess)

    useEffect(() => {
        getTransactions()
    }, [resp])

    const [transactions, setTransactions] = useState<Array<{ _id: string, text: string, amount: number, tags: string, user: string, createdAt?: string }>>([])
    const [loading, setLoading] = useState(true)

    const getTransactions = async () => {
    const res = await axios.get('/api/get-transactions')
    setTransactions(res.data.transactions);
    setLoading(false)
    }

    const { toast } = useToast();

    return (
        <ScrollArea className="h-[calc(88vh-152px)] w-full rounded-md py-2 px-4 border border-white/10 bg-white/[0.02]">
            <h1 className="text-lg font-semibold py-2">Recent Transactions</h1>
            {loading ? (
                <div className="flex h-32 items-center justify-center">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-white/60 border border-dashed border-white/10 rounded-md">No transactions yet</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>For</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Tag</TableHead>
                            <TableHead className="text-right">Delete?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction._id}>
                                <TableCell className="w-2/5">
                                    <div className="flex flex-col">
                                        <span>{transaction.text}</span>
                                        {transaction.createdAt && (
                                            <span className="text-xs text-white/50">
                                                {new Date(transaction.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className={cn('w-1/5 font-mono', transaction.amount >= 0 ? 'text-green-400' : 'text-red-400')}>
                                    {transaction.amount}
                                </TableCell>
                                <TableCell className="w-1/5">
                                    {transaction.tags ? (
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs">
                                            {transaction.tags.charAt(0).toUpperCase() + transaction.tags.slice(1)}
                                        </span>
                                    ) : (
                                        <span className="text-white/40 text-xs">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right w-1/5">
                                    <AlertDialog>
                                        <AlertDialogTrigger className="border border-white/10 py-1 rounded-md px-2 hover:bg-white/[0.06]">
                                            <DeleteButton />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => { return }}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={async () => {
                                                    await axios.post('/api/delete-transaction', { id: transaction._id })
                                                    changeRess(Math.random().toString())
                                                    toast({ title: 'Transaction Deleted', description: 'Transaction has been deleted successfully' })
                                                }}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </ScrollArea>
    )
}

export default TransactionList