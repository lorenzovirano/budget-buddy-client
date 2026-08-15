import { BankSelector } from "../banks/BanksSelector"
import { NetWorthSummary } from "./components/NetWorthSummary"
import { AccountsDistribution } from "./components/AccountDistribuition"
import { MonthlyCashFlow } from "./components/MonthlyCashFlow"
import { SavingsGoals } from "../goals/SavingsGoals"
import { UpcomingRecurring } from "../recurrings/UpcomingRecurring"
import { RecentTransactions } from "./components/RecentTransactions"
import { NetWorthChart } from "./components/NetWorthChart"
import { ExpensesPieChart } from "./components/ExpensesPieChart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, PieChart, Activity } from "lucide-react"

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Ecco come stanno andando le tue finanze.
          </p>
        </div>
        <BankSelector />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <NetWorthSummary />
        </div>
        
        <div className="md:col-span-1 h-full flex flex-col">
          <Tabs defaultValue="cashflow" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="liquidity">Liquidità</TabsTrigger>
            </TabsList>
            <TabsContent value="cashflow" className="mt-0 flex-1 focus-visible:outline-none focus-visible:ring-0">
              <MonthlyCashFlow />
            </TabsContent>
            <TabsContent value="liquidity" className="mt-0 flex-1 focus-visible:outline-none focus-visible:ring-0">
              <AccountsDistribution />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="w-full">
        <Card className="w-full">
          <Tabs defaultValue="networth" className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Analisi e Trend
              </CardTitle>

              <TabsList className="grid grid-cols-2 w-full sm:w-[350px]">
                <TabsTrigger value="networth" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Patrimonio
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Spese Categorie
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-0">
              <TabsContent value="networth" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="w-full">
                  <NetWorthChart />
                </div>
              </TabsContent>
              <TabsContent value="expenses" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="w-full">
                  <ExpensesPieChart />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 items-start">
        <div className="md:col-span-1 lg:col-span-4 h-full">
          <SavingsGoals />
        </div>
        <div className="md:col-span-1 lg:col-span-3 h-full">
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="recent">Ultimi Movimenti</TabsTrigger>
              <TabsTrigger value="upcoming">In Arrivo</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <RecentTransactions />
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <UpcomingRecurring />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
    </div>
  )
}