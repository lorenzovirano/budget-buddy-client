import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { useTransactions } from "@/features/transactions/api/useTransactions"

export function MonthlyCashFlow() {
  const { data: transactions, isLoading } = useTransactions()
  const { income, expenses, netSavings, percentChange, isPositiveTrend, isNeutral } = useMemo(() => {
    if (!transactions) {
      return { income: 0, expenses: 0, netSavings: 0, percentChange: 0, isPositiveTrend: true, isNeutral: true }
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let currentIncome = 0
    let currentExpenses = 0
    let lastIncome = 0
    let lastExpenses = 0

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      const txMonth = txDate.getMonth()
      const txYear = txDate.getFullYear()
      const amount = Number(tx.amount)

      if (txMonth === currentMonth && txYear === currentYear) {
        if (tx.type === 'income') currentIncome += amount
        if (tx.type === 'expense') currentExpenses += Math.abs(amount) 
      }

      if (txMonth === lastMonth && txYear === lastMonthYear) {
        if (tx.type === 'income') lastIncome += amount
        if (tx.type === 'expense') lastExpenses += Math.abs(amount)
      }
    })

    const currentNet = currentIncome - currentExpenses
    const lastNet = lastIncome - lastExpenses

    let change = 0
    if (lastNet !== 0) {
       change = ((currentNet - lastNet) / Math.abs(lastNet)) * 100
    } else if (currentNet > 0) {
       change = 100
    } else if (currentNet < 0) {
       change = -100
    }

    return {
      income: currentIncome,
      expenses: currentExpenses,
      netSavings: currentNet,
      percentChange: Math.abs(change).toFixed(0),
      isPositiveTrend: change > 0,
      isNeutral: change === 0
    }
  }, [transactions])

  if (isLoading) {
    return (
      <Card className="w-full h-full flex flex-col justify-between">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center"><Skeleton className="h-4 w-20" /><Skeleton className="h-5 w-24" /></div>
          <div className="flex justify-between items-center"><Skeleton className="h-4 w-20" /><Skeleton className="h-5 w-24" /></div>
          <div className="pt-3 border-t flex justify-between items-end">
            <Skeleton className="h-4 w-24" />
            <div className="text-right space-y-2">
              <Skeleton className="h-7 w-28 ml-auto" />
              <Skeleton className="h-3 w-32 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Colori dinamici in base al trend del risparmio
  const trendColor = isNeutral ? "text-muted-foreground" : (isPositiveTrend ? "text-emerald-500" : "text-red-500")
  const TrendIcon = isNeutral ? Minus : (isPositiveTrend ? ArrowUpRight : ArrowDownRight)
  const trendSign = isNeutral ? "" : (isPositiveTrend ? "+" : "-")

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cash Flow Mensile
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Entrate</span>
          </div>
          <span className="font-semibold text-emerald-500">
            +€ {income.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">Uscite</span>
          </div>
          <span className="font-semibold text-red-500">
            -€ {expenses.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="pt-3 border-t flex justify-between items-end">
          <span className="text-sm font-medium">Risparmio Netto</span>
          <div className="text-right">
            <span className={`font-bold text-xl ${netSavings < 0 ? 'text-red-500' : ''}`}>
              € {netSavings.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-end text-xs text-muted-foreground mt-1">
              <TrendIcon className={`w-3 h-3 mr-1 ${trendColor}`} />
              <span className={`font-medium mr-1 ${trendColor}`}>
                {trendSign}{percentChange}%
              </span> 
              vs mese scorso
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}