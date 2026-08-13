import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"

export function MonthlyCashFlow() {
  // Dati di esempio
  const income = 2850.00
  const expenses = 1320.00
  const netSavings = income - expenses
  const vsLastMonth = "+12%" 

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cash Flow Mensile
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Entrate */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Entrate</span>
          </div>
          <span className="font-semibold text-emerald-500">
            +€ {income.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Uscite */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-500">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">Uscite</span>
          </div>
          <span className="font-semibold text-red-500">
            -€ {expenses.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Divisore e Risparmio Netto */}
        <div className="pt-3 border-t flex justify-between items-end">
          <span className="text-sm font-medium">Risparmio Netto</span>
          <div className="text-right">
            <span className="font-bold text-xl">
              € {netSavings.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center justify-end text-xs text-muted-foreground mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium mr-1">{vsLastMonth}</span> 
              vs mese scorso
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}