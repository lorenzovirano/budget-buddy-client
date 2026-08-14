import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight01Icon, ArrowDownRight01Icon, ArrowUpRight01Icon } from "hugeicons-react"
import { Loader2 } from "lucide-react"
import { useTransactions } from "../../transactions/api/useTransactions"

export function RecentTransactions() {
  const { data: transactions, isLoading } = useTransactions()

  const recentTransactions = transactions
    ? [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : []

  // Helper per formattare la data come "Oggi", "Ieri" o "10 Ago 2026"
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Oggi"
    if (date.toDateString() === yesterday.toDateString()) return "Ieri"
    
    return date.toLocaleDateString("it-IT", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric" 
    })
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">Ultimi Movimenti</CardTitle>
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <Link to="/transactions">
            Vedi tutti <ArrowRight01Icon className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="grid gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Caricamento...
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Nessun movimento registrato.
          </div>
        ) : (
          recentTransactions.map((tx) => {
            const isIncome = tx.amount > 0;
            const Icon = isIncome  ?ArrowUpRight01Icon : ArrowDownRight01Icon;
            
            const categoryName = typeof tx.category === 'object' && tx.category !== null 
              ? (tx.category as any).name 
              : "Categoria";

            const title = tx.description || categoryName;

            return (
              <div key={tx._id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {categoryName} • {formatRelativeDate(tx.date)}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${isIncome ? "text-emerald-500" : ""}`}>
                  {isIncome ? "+" : "-"} €{Math.abs(tx.amount).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            )
          })
        )}
        <Button variant="outline" className="w-full sm:hidden mt-2" asChild>
          <Link to="/transactions">Vedi tutti i movimenti</Link>
        </Button>
      </CardContent>
    </Card>
  )
}