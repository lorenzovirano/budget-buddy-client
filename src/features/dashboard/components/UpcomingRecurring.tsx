import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarClock, AlertCircle, CreditCard, Repeat } from "lucide-react"

const upcomingExpenses = [
  {
    id: "rec1",
    title: "Palestra & Boxe",
    amount: 45.00,
    daysLeft: 1,
    date: "14 Ago",
  },
  {
    id: "rec2",
    title: "iCloud+",
    amount: 2.99,
    daysLeft: 3,
    date: "16 Ago",
  },
  {
    id: "rec3",
    title: "Rata Corso Burlington English",
    amount: 75.00,
    daysLeft: 5,
    date: "18 Ago",
  },
  {
    id: "rec4",
    title: "Spotify Premium",
    amount: 10.99,
    daysLeft: 7,
    date: "20 Ago",
  }
]

export function UpcomingRecurring() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" />
          Spese ricorrenti in arrivo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-4">
        {upcomingExpenses.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Nessun addebito previsto nei prossimi 7 giorni.
          </div>
        ) : (
          upcomingExpenses.map((expense) => {
            const isUrgent = expense.daysLeft <= 2
            
            return (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isUrgent ? 'bg-orange-500/10 text-orange-500' : 'bg-secondary text-muted-foreground'}`}>
                    {isUrgent ? <AlertCircle className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium leading-none">{expense.title}</p>
                    <p className={`text-xs mt-1 ${isUrgent ? 'text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                      {expense.daysLeft === 1 ? "Domani" : `Tra ${expense.daysLeft} giorni`} • {expense.date}
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