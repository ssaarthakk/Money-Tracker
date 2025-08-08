"use client"
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import useRes from '@/lib/store'
import { cn } from '@/lib/utils'

const formSchema = z
    .object({
        transactionfor: z.string().min(2, 'Please enter at least 2 characters').max(50),
        amount: z
            .preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number())
            .refine((v) => !Number.isNaN(v), { message: 'Amount must be a number' })
            .refine((v) => v !== 0, { message: 'Amount cannot be zero' }),
        tags: z.string().optional().transform((v) => (v ?? '').trim()),
    })
    .superRefine((vals, ctx) => {
        if (typeof vals.amount === 'number' && vals.amount < 0 && (!vals.tags || vals.tags.length === 0)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please add a tag for expenses', path: ['tags'] })
        }
    })

const TAG_SUGGESTIONS = ['Food', 'Rent', 'Travel', 'Utilities', 'Shopping', 'Transport', 'Health']

function AddTransactions() {
    const { toast } = useToast()
    const resp: any = useRes((state: any) => state.changeRess)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { transactionfor: '', amount: 0 as unknown as any, tags: '' },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { transactionfor, amount, tags } = values
        const response = await axios.post('/api/add-transaction', { transactionfor, amount, tags })

        resp(Math.random().toString())
        if (response.status === 200) {
            form.reset({ transactionfor: '', amount: 0 as unknown as any, tags: '' })
            toast({ title: 'Transaction Added', description: 'Transaction has been added successfully' })
        } else {
            toast({ title: 'Error', description: 'Error adding transaction', variant: 'destructive' })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="font-medium">Add Transaction</h1>
                </div>
                <Separator />
                <FormField
                    control={form.control}
                    name="transactionfor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction For</FormLabel>
                            <FormControl>
                                <Input placeholder="Transaction For" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount (Negative for Expense)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="Amount" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                        const amountVal = form.watch('amount') as unknown as number
                        const isExpense = typeof amountVal === 'number' && amountVal < 0
                        return (
                            <FormItem>
                                <FormLabel>
                                    Tag {isExpense && <span className="text-white/60">(required for expenses)</span>}
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        <Input placeholder="e.g. Food, Rent, Travel" {...field} />
                                        <div className="flex flex-wrap gap-2">
                                            {TAG_SUGGESTIONS.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => field.onChange(t)}
                                                    className={cn(
                                                        'rounded-full border px-3 py-1 text-xs',
                                                        field.value?.toLowerCase() === t.toLowerCase()
                                                            ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                                                            : 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]'
                                                    )}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <Button type="submit">Add Transaction</Button>
            </form>
        </Form>
    )
}

export default AddTransactions