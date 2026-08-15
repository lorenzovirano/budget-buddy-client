import { useMemo } from "react"
import { useTransactions } from "@/features/transactions/api/useTransactions"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

const COLORS = [
  "#3b82f6", // Blu
  "#10b981", // Smeraldo
  "#f59e0b", // Ambra
  "#ef4444", // Rosso
  "#8b5cf6", // Viola
  "#ec4899", // Rosa
  "#06b6d4", // Ciano
  "#f97316", // Arancione
]

export function ExpensesPieChart() {
  const { data: transactions, isLoading } = useTransactions()

  const chartData = useMemo(() => {
    if (!transactions) return []

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const expensesThisMonth = transactions.filter(tx => {
      const txDate = new Date(tx.date || (tx as any).createdAt)
      return (
        tx.type === 'expense' &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      )
    })

    const categoryTotals: Record<string, number> = {}
    
    expensesThisMonth.forEach(tx => {
      let categoryName = 'Altro';
      if (tx.category) {
        if (typeof tx.category === 'object' && 'name' in tx.category) {
          categoryName = (tx.category as any).name;
        } else if (typeof tx.category === 'string') {
          categoryName = tx.category;
        }
      }
      
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0
      }
      categoryTotals[categoryName] += Math.abs(Number(tx.amount))
    })

    const data = Object.keys(categoryTotals).map(key => ({
      name: key,
      value: categoryTotals[key]
    }))
    return data.sort((a, b) => b.value - a.value)
  }, [transactions])

  if (isLoading) {
    return <Skeleton className="w-full h-[350px] rounded-xl" />
  }
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[350px] mt-4 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
        Nessuna spesa registrata questo mese.
      </div>
    )
  }

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)

  // Custom Tooltip per mostrare i valori formattati
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-[#18181b] border border-[#3f3f46] p-3 rounded-lg shadow-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <div>
            <p className="text-sm text-[#a1a1aa] font-medium capitalize">{data.name}</p>
            <p className="text-lg font-bold" style={{ color: payload[0].color }}>
              {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(data.value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const renderLegendText = (value: string) => {
    return <span className="text-[#a1a1aa] capitalize ml-1">{value}</span>;
  };

  return (
    <div className="w-full h-[350px] mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={80}  
            outerRadius={120}
            paddingAngle={3}
            dataKey="value"
            stroke="none"  
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={renderLegendText} wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Totale</p>
        <p className="text-xl font-bold text-foreground">
          {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(totalExpenses)}
        </p>
      </div>
    </div>
  )
}