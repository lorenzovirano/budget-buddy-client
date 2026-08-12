import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight01Icon, ShoppingCart01Icon, Coffee01Icon, LaptopIcon, Briefcase01Icon } from "hugeicons-react"

const recentTransactions = [
  {
    id: "1",
    title: "Stipendio",
    category: "Lavoro",
    amount: 2500.00,
    type: "income",
    date: "Oggi",
    icon: Briefcase01Icon,
  },
  {
    id: "2",
    title: "Spesa Esselunga",
    category: "Alimentari",
    amount: -85.50,
    type: "expense",
    date: "Ieri",
    icon: ShoppingCart01Icon,
  },
  {
    id: "3",
    title: "Abbonamento Software",
    category: "Lavoro",
    amount: -15.99,
    type: "expense",
    date: "10 Ago 2026",
    icon: Coffee01Icon,
  },
  {
    id: "4",
    title: "Bar",
    category: "Svago",
    amount: -4.50,
    type: "expense",
    date: "09 Ago 2026",
    icon: LaptopIcon,
  },
]

export function RecentTransactions() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">Ultimi Movimenti</CardTitle>
        {/* Il bottone che porta alla rotta completa */}
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <Link to="/transactions">
            Vedi tutti <ArrowRight01Icon className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="grid gap-6">
        {recentTransactions.map((transaction) => {
          const Icon = transaction.icon
          const isIncome = transaction.type === "income"

          return (
            <div key={transaction.id} className="flex items-center justify-between">
              
              {/* Parte Sinistra: Icona e Testo */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary rounded-full">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>

              {/* Parte Destra: Importo */}
              <div className={`font-semibold ${isIncome ? "text-emerald-500" : ""}`}>
                {isIncome ? "+" : "-"} €{Math.abs(transaction.amount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
              </div>

            </div>
          )
        })}

        {/* Bottone visibile solo su mobile per risparmiare spazio nell'header */}
        <Button variant="outline" className="w-full sm:hidden mt-2" asChild>
          <Link to="/transactions">Vedi tutti i movimenti</Link>
        </Button>
      </CardContent>
    </Card>
  )
}