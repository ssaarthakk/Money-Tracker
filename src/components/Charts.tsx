"use client"

import * as React from 'react'
import axios from 'axios'
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Tx = { _id: string; text: string; amount: number; tags?: string; createdAt?: string }

const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#f59e0b', '#a78bfa', '#f87171', '#22d3ee']

function aggregateMonthly(transactions: Tx[]) {
  const byMonth: Record<string, { month: string; income: number; expense: number }> = {}
  for (const t of transactions) {
    const d = t.createdAt ? new Date(t.createdAt) : new Date()
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth[key]) {
      byMonth[key] = { month: key, income: 0, expense: 0 }
    }
    if (t.amount >= 0) byMonth[key].income += t.amount
    else byMonth[key].expense += Math.abs(t.amount)
  }
  // sort and keep last 6 months
  return Object.values(byMonth)
    .sort((a, b) => (a.month < b.month ? -1 : 1))
    .slice(-6)
    .map((m) => ({ ...m, label: m.month }))
}

function aggregateCategories(transactions: Tx[]) {
  const cats: Record<string, number> = {}
  for (const t of transactions) {
    if (t.amount < 0 && t.tags) {
      const key = t.tags.trim().toLowerCase()
      cats[key] = (cats[key] || 0) + Math.abs(t.amount)
    }
  }
  return Object.entries(cats).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
}

const barConfig = { income: { label: 'Income' }, expense: { label: 'Expense' } } satisfies ChartConfig

function Charts() {
  const [transactions, setTransactions] = React.useState<Tx[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    axios
      .get('/api/get-transactions')
      .then((res) => mounted && setTransactions(res.data.transactions || []))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const monthly = React.useMemo(() => aggregateMonthly(transactions), [transactions])
  const categories = React.useMemo(() => aggregateCategories(transactions), [transactions])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-medium mb-2">Monthly Trends</h3>
          <ChartContainer config={barConfig} className="h-[260px] w-full">
            <BarChart data={monthly} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <Tooltip content={<ChartTooltipContent className="w-[180px]" nameKey="views" />} />
              <Bar dataKey="income" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-medium mb-2">Spending by Category</h3>
          <div className="h-[260px] w-full flex items-center justify-center">
            {categories.length === 0 ? (
              <div className="text-white/60 text-sm">No expense categories yet</div>
            ) : (
              <PieChart width={300} height={260}>
                <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent className="w-[180px]" nameKey="views" />} />
              </PieChart>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Charts