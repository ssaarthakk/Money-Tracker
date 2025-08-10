'use client';
import { api } from '@/lib/http'
import React, { useEffect, useState } from 'react'
import useRes from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'

function Balance() {

    const [balance, setBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const resp = useRes((state: any) => state.res)

    const getBalance = async () => {
        try {
            const balance = await api.get('/api/get-balance')
            setBalance(balance.data.balance)
        } catch (error) {
            // toast is shown by interceptor
            return 0;
        } finally { setLoading(false) }
    }

    useEffect(() => {
        getBalance()
    }, [resp])

    return (
        <div className='flex flex-col gap-1 items-center pt-4 pb-2'>
            <h4 className='text-start text-base font-semibold'>YOUR BALANCE</h4>
            {loading ? (
                <Skeleton className='h-10 w-40' />
            ) : (
                <h1 className='text-4xl font-bold'>
                    Rs. {balance}
                </h1>
            )}
        </div>
    )
}

export default Balance