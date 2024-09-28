"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios';
import { Separator } from "@/components/ui/separator"
import useRes from '@/lib/store'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    transactionfor: z.string().min(2).max(50),
    amount: z.string().min(1).max(1000000),
    tags: z.string()
})

const tags = [
    {
        value: "fixed",
        label: "Fixed",
    },
    {
        value: "variable",
        label: "Variable",
    },
    {
        value: "periodic",
        label: "Periodic",
    }
]

function AddTransactions() {


    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<any>("")

    const { toast } = useToast();
    const resp: any = useRes((state: any) => state.changeRess)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            transactionfor: "",
            amount: '',
            tags: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { transactionfor, amount } = values;

        const response = await axios.post('/api/add-transaction', { transactionfor, amount, tags: value });
        // console.log(values, value);



        resp(Math.random().toString());
        if (response.status === 200) {
            form.reset({ transactionfor: '', amount: '', tags: '' });
            setValue("");
            toast({
                title: "Transaction Added",
                description: "Transaction has been added successfully",
            })
        } else {
            toast({
                title: "Error",
                description: "Error adding transaction",
                variant: "destructive",
            })
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:w-3/4 w-full mx-auto pt-6 px-6">
                <h1 className='font-medium'>Add Transaction</h1>
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
                                <Input type='number' placeholder="Amount" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='pr-8'>Tags (For Expense)</FormLabel>
                            <FormControl>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-[200px] justify-between"
                                        >
                                            {value
                                                ? tags.find((framework) => framework.value === value)?.label
                                                : "Select tag..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandEmpty>No Tags Founds</CommandEmpty>
                                                <CommandGroup>
                                                    {tags.map((framework) => (
                                                        <CommandItem
                                                            key={framework.value}
                                                            value={framework.value}
                                                            onSelect={(currentValue) => {
                                                                setValue(currentValue === value ? "" : currentValue)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    value === framework.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {framework.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* <FormField
                    control={form.control}
                    name="isPending"
                    render={({ field }) => (
                        <FormItem className='items-center flex gap-2'>
                            <FormLabel>Is the transaction Completed?</FormLabel>
                            <FormControl className='flex w-full items-center'>
                                <ToggleGroup type="single" value={field.value} defaultValue='pending' onValueChange={field.onChange} className='flex flex-col md:flex-row'>
                                    <ToggleGroupItem value='completed' className='w-full md:w-1/2'>Completed</ToggleGroupItem>
                                    <ToggleGroupItem value='pending' className='w-full md:w-1/2'>Pending</ToggleGroupItem>
                                </ToggleGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <Button type="submit" className='w-full'>Add Transaction</Button>
            </form>
        </Form>
    )
}

export default AddTransactions