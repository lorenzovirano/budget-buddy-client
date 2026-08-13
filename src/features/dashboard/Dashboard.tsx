import { BankSelector } from "./BanksSelector"
import { NetWorthSummary } from "./NetWorthSummary"
import { MonthlyCashFlow } from "./MonthlyCashFlow"
import { SavingsGoals } from "../goals/SavingsGoals"
import { UpcomingRecurring } from "./UpcomingRecurring"
import { RecentTransactions } from "./RecentTransactions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "lucide-react"

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

      {/* LIVELLO 1: OVERVIEW (Il "Quanto ho?" e "Come sta andando?") */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Il Patrimonio prende 2 colonne su schermi medi in su */}
        <div className="md:col-span-2">
          <NetWorthSummary />
        </div>
        
        {/* Il Cash Flow prende 1 colonna (di fianco su desktop, sotto su mobile) */}
        <div className="md:col-span-1">
          <MonthlyCashFlow />
        </div>
      </div>

      {/* LIVELLO 2: ANALYTICS / TRENDS (Il "Trend nel tempo") */}
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              Andamento Patrimonio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Segnaposto per futuro grafico Recharts */}
            <div className="w-full h-[350px] border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground bg-muted/10">
              Area Chart Recharts in costruzione...
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LIVELLO 3: DETTAGLI & AZIONI (Il "Cosa sto facendo e cosa farò?") */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 items-start">
        
        {/* COLONNA SINISTRA (4 colonne): Macro Obiettivi */}
        <div className="md:col-span-1 lg:col-span-4 h-full">
          <SavingsGoals />
        </div>

        {/* COLONNA DESTRA (3 colonne): Feed Transazioni (Future & Passate) */}
        <div className="md:col-span-1 lg:col-span-3 h-full">
          <Tabs defaultValue="recent" className="w-full">
            
            {/* Il selettore dei Tab (Occupa tutto lo spazio orizzontale) */}
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="recent">Ultimi Movimenti</TabsTrigger>
              <TabsTrigger value="upcoming">In Arrivo</TabsTrigger>
            </TabsList>
            
            {/* Contenuto Tab 1: Il Passato */}
            <TabsContent value="recent" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <RecentTransactions />
            </TabsContent>
            
            {/* Contenuto Tab 2: Il Futuro */}
            <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <UpcomingRecurring />
            </TabsContent>
            
          </Tabs>
        </div>
        
      </div>
      
    </div>
  )
}