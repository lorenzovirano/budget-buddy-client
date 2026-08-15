import { useMemo } from "react"
import { useTransactions } from "@/features/transactions/api/useTransactions"
import { useBanks } from "@/features/banks/api/useBanks"
import { useGetPortfolio } from "@/features/investments/api/useInvestments"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type MonthData = {
  label: string;
  monthIndex: number;
  year: number;
  netChange: number;
  value: number;
};

export function NetWorthChart() {
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { data: banks, isLoading: banksLoading } = useBanks()
  const { data: portfolio, isLoading: portfolioLoading } = useGetPortfolio()

  const isLoading = txLoading || banksLoading || portfolioLoading

  const chartData = useMemo(() => {
    if (!transactions || !banks) return []

    const balances: Record<string, number> = {}
    banks.forEach(b => (balances[b._id] = 0))

    transactions.forEach(tx => {
      const accountId = typeof tx.account === 'object' ? tx.account?._id : tx.account
      const toAccountId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount
      const amount = Number(tx.amount)
      
      if (!accountId) return

      if (tx.type === 'income') balances[accountId] += amount
      else if (tx.type === 'expense') balances[accountId] -= amount
      else if (tx.type === 'transfer') {
        balances[accountId] -= amount
        if (toAccountId) balances[toAccountId] += amount
      }
    })

    const totalBankBalances = banks.reduce((acc, bank) => acc + (balances[bank._id] || 0), 0)
    const investmentsTotal = portfolio?.summary?.totalValue || 0
    let currentNetWorth = totalBankBalances + investmentsTotal

    const months: MonthData[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }),
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        netChange: 0,
        value: 0
      })
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date || (tx as any).createdAt) 
      const monthBucket = months.find(m => m.monthIndex === txDate.getMonth() && m.year === txDate.getFullYear())
      
      if (monthBucket) {
        const amount = Number(tx.amount)
        if (tx.type === 'income') monthBucket.netChange += amount
        else if (tx.type === 'expense') monthBucket.netChange -= amount
      }
    })

    let runningTotal = currentNetWorth
    for (let i = 5; i >= 0; i--) {
      months[i].value = runningTotal
      runningTotal -= months[i].netChange 
    }

    return months
  }, [transactions, banks, portfolio])

  const formatYAxis = (val: number) => {
    if (Math.abs(val) >= 1000000) return `€${(val / 1000000).toFixed(1)}M`
    if (Math.abs(val) >= 1000) return `€${(val / 1000).toFixed(0)}k`
    return `€${val}`
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[350px] rounded-xl" />
  }

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-[#3f3f46] p-3 rounded-lg shadow-xl">
          <p className="text-sm text-[#a1a1aa] mb-1 font-medium capitalize">{label}</p>
          <p className="text-lg font-bold text-[#3b82f6]">
            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.5} />
          
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#a1a1aa', fontSize: 13 }} 
            tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            dy={15} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#a1a1aa', fontSize: 13 }}
            tickFormatter={formatYAxis} 
            width={60}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, strokeWidth: 2, fill: "#18181b", stroke: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}