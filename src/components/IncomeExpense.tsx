'use client';
import { api } from '@/lib/http'
import React, { useEffect, useState } from 'react'
import { Separator } from './ui/separator'
import useRes from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton'

function IncomeExpense() {

  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [loading, setLoading] = useState(true)

  const getBalance = async () => {
    try {
      const balance = await api.get('/api/get-income-expense')
      setIncome(balance.data.data.income)
      setExpense(balance.data.data.expense)
    } catch (error) {
      // toast already shown by interceptor
      return 0;
    } finally { setLoading(false) }
  }

  const resp = useRes((state: any) => state.res)

  useEffect(() => {
    getBalance()
  }, [resp])

  return (
    <div className='flex gap-3 text-xl font-semibold justify-center pt-4'>
      <div className='p-4'>
        <h1 className='text-sm tracking-wide'>INCOME</h1>
        {loading ? <Skeleton className='h-6 w-28' /> : <p className='text-green-500'>Rs. {income}</p>}
      </div>
      <Separator orientation='vertical' />
      <div className='p-4'>
        <h1 className='text-sm tracking-wide'>EXPENSE</h1>
        {loading ? <Skeleton className='h-6 w-28' /> : <p className='text-red-500'>Rs. {expense}</p>}
      </div>
    </div>
  )
}

export default IncomeExpense