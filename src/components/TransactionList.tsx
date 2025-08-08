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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
    // Controls
    const [query, setQuery] = useState("")
    const [range, setRange] = useState<"all" | "week" | "month" | "custom">("all")
    const [fromDate, setFromDate] = useState<string>("")
    const [toDate, setToDate] = useState<string>("")
    const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc")

    const getTransactions = async () => {
        setLoading(true)
        const res = await axios.get('/api/get-transactions')
        setTransactions(res.data.transactions);
        setLoading(false)
    }

    const { toast } = useToast();

    const filtered = useMemo(() => {
        let rows = [...transactions]

        // Date range
        const now = new Date()
        let start: Date | null = null
        let end: Date | null = null
        if (range === 'week') {
            end = now
            start = new Date()
            start.setDate(now.getDate() - 7)
            start.setHours(0,0,0,0)
        } else if (range === 'month') {
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            end = now
        } else if (range === 'custom') {
            if (fromDate) start = new Date(fromDate + 'T00:00:00')
            if (toDate) end = new Date(toDate + 'T23:59:59')
        }
        if (start || end) {
            rows = rows.filter(t => {
                if (!t.createdAt) return false
                const d = new Date(t.createdAt)
                if (start && d < start) return false
                if (end && d > end) return false
                return true
            })
        }

        // Search by text or tag
        const q = query.trim().toLowerCase()
        if (q) {
            rows = rows.filter(t =>
                (t.text && t.text.toLowerCase().includes(q)) ||
                (t.tags && t.tags.toLowerCase().includes(q))
            )
        }

        // Sort
        rows.sort((a,b) => {
            if (sortBy.startsWith('date')) {
                const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return sortBy === 'date-desc' ? db - da : da - db
            } else {
                return sortBy === 'amount-desc' ? b.amount - a.amount : a.amount - b.amount
            }
        })

        return rows
    }, [transactions, range, fromDate, toDate, query, sortBy])

    const exportCSV = () => {
        const header = ['Date','Description','Amount','Tag']
        const lines = filtered.map(t => [
            t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '',
            t.text ?? '',
            String(t.amount),
            t.tags ?? ''
        ])
        const csv = [header, ...lines]
            .map(row => row.map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(','))
            .join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const exportPDF = () => {
        const win = window.open('', '_blank')
        if (!win) return
        const styles = `
            <style>
              body { font-family: Arial, sans-serif; padding: 16px; }
              h1 { font-size: 18px; margin-bottom: 12px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
              th { background: #f3f3f3; text-align: left; }
            </style>
        `
        const rows = filtered.map(t => `
            <tr>
              <td>${t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</td>
              <td>${(t.text ?? '').toString().replace(/</g,'&lt;')}</td>
              <td>${t.amount}</td>
              <td>${(t.tags ?? '').toString().replace(/</g,'&lt;')}</td>
            </tr>
        `).join('')
        const html = `
          <html><head><title>Transactions Export</title>${styles}</head>
          <body>
            <h1>Transactions Export</h1>
            <table>
              <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Tag</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </body></html>
        `
        win.document.open();
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
    }

    return (
        <ScrollArea className="h-[calc(88vh-152px)] w-full rounded-md py-2 px-4 border border-white/10 bg-white/[0.02]">
                        <div className="flex items-center justify-between py-2 gap-3 flex-wrap min-w-0">
                <h1 className="text-lg font-semibold">Recent Transactions</h1>
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by description or tag"
                                                className="w-full sm:w-56 md:w-64 max-w-full shrink-0 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                                        {/* Time filter dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="border-white/20 text-white">
                                                    {range === 'all' ? 'All' : range === 'week' ? 'This week' : range === 'month' ? 'This month' : 'Custom'}
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="border-white/20 dark:bg-neutral-950">
                                                <DropdownMenuLabel>Filter by time</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={range} onValueChange={(v) => setRange(v as any)}>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="all">All</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="week">This week</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="month">This month</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="custom">Custom</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                    {range === 'custom' && (
                        <div className="flex items-center gap-2">
                                                        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-10 w-40 bg-white/10 border-white/20 text-white" />
                            <span className="text-white/60">to</span>
                                                        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-10 w-40 bg-white/10 border-white/20 text-white" />
                        </div>
                    )}
                                        {/* Sort dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="border-white/20 text-white">
                                                    Sort
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="border-white/20 dark:bg-neutral-950">
                                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="date-desc">Date ↓</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="date-asc">Date ↑</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="amount-desc">Amount ↓</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem className="text-white data-[state=checked]:bg-white/10" value="amount-asc">Amount ↑</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* Export dropdown next to sort */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="border-white/20 text-white">
                                                    Export
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="border-white/20 dark:bg-neutral-950">
                                                <DropdownMenuItem className="text-white hover:bg-white/10" onClick={exportCSV}>CSV</DropdownMenuItem>
                                                <DropdownMenuItem className="text-white hover:bg-white/10" onClick={exportPDF}>PDF</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                </div>
            </div>
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
                        {filtered.map((transaction) => (
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