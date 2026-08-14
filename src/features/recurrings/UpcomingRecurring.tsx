import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarClock, AlertCircle, Repeat } from "lucide-react"
import { differenceInDays, format } from "date-fns"
import { it } from "date-fns/locale"
import { useRecurring } from "./api/useRecurring"

export function UpcomingRecurring() {
  const { data: recurring, isLoading } = useRecurring()

  const upcomingExpenses = useMemo(() => {
    if (!recurring) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0) 

    return recurring
      .filter(sub => sub.active && sub.type === 'expense')
      .map(sub => {
        const nextDateObj = new Date(sub.nextDate)
        nextDateObj.setHours(0, 0, 0, 0)
        
        return {
          ...sub,
          dateObj: nextDateObj,
          daysLeft: differenceInDays(nextDateObj, today)
        }
      })
      .filter(sub => sub.daysLeft >= 0 && sub.daysLeft <= 14)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 4)
  }, [recurring])

  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-4"><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent className="grid gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" />
          Spese ricorrenti in arrivo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-4 flex-1">
        {upcomingExpenses.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-6 flex flex-col items-center justify-center h-full border-2 border-dashed rounded-xl">
            <Repeat className="w-8 h-8 mb-2 opacity-20" />
            Nessun addebito previsto nei prossimi 14 giorni.
          </div>
        ) : (
          upcomingExpenses.map((expense) => {
            const isUrgent = expense.daysLeft <= 2
            
            return (
              <div 
                key={expense._id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isUrgent ? 'bg-orange-500/10 text-orange-500' : 'bg-secondary text-muted-foreground'}`}>
                    {isUrgent ? <AlertCircle className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium leading-none">{expense.title}</p>
                    <p className={`text-xs mt-1 ${isUrgent ? 'text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                      {expense.daysLeft === 0 ? "Oggi" : expense.daysLeft === 1 ? "Domani" : `Tra ${expense.daysLeft} giorni`} • {format(expense.dateObj, "d MMM", { locale: it })}
                    </p>
                  </div>
                </div>

                <div className="font-semibold text-sm">
                  -€{expense.amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}