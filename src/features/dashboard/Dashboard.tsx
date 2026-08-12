import { BankSelector } from "./BanksSelector"
import { NetWorthSummary } from "./NetWorthSummary"
import { RecentTransactions } from "./RecentTransactions"
import { SavingsGoals } from "./SavingsGoals"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Chart01Icon } from "hugeicons-react"

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      {/* HEADER: Titolo e Filtro Globale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Ecco come stanno andando le tue finanze.
          </p>
        </div>
        <BankSelector />
      </div>

      {/* LIVELLO 1: OVERVIEW (Il "Quanto ho?") */}
      <div className="w-full">
        <NetWorthSummary />
      </div>

      {/* LIVELLO 2: ANALYTICS / TRENDS (Il "Come sta andando?") */}

      {/* LIVELLO 3: DETTAGLI & AZIONI (Il "Cosa sto facendo?") */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Widget Obiettivi (A sinistra, leggermente più largo) */}
        <div className="md:col-span-1 lg:col-span-4">
          <SavingsGoals />
        </div>

        {/* Lista Ultimi Movimenti (A destra, agisce da feed) */}
        <div className="md:col-span-1 lg:col-span-3">
          <RecentTransactions />
        </div>
        
      </div>


            <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Chart01Icon className="w-5 h-5 text-primary" />
              Andamento Patrimonio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[350px] border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground bg-muted/10">
              Area Chart Recharts in costruzione...
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}