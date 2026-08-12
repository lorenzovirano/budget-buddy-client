import { Card, CardContent } from "@/components/ui/card"
import { Wallet01Icon, Coins01Icon } from "hugeicons-react"

export function NetWorthSummary() {
  const netWorth = 24500.00
  const availableLiquidity = 5450.00

  const liquidityPercentage = (availableLiquidity / netWorth) * 100

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet01Icon className="w-4 h-4" />
              <h3 className="text-sm font-medium uppercase tracking-wider">
                Patrimonio Netto
              </h3>
            </div>
            <div className="text-4xl font-bold tracking-tight">
              € {netWorth.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              Inclusi investimenti e fondi di emergenza
            </p>
          </div>

          <div className="hidden sm:block w-px bg-border my-2" />

          <div className="space-y-2 flex-1 sm:text-right flex flex-col sm:items-end">
            <div className="flex items-center gap-2 text-muted-foreground sm:flex-row-reverse">
              <Coins01Icon className="w-4 h-4" />
              <h3 className="text-sm font-medium uppercase tracking-wider">
                Liquidità Subito Disponibile
              </h3>
            </div>
            <div className="text-3xl font-semibold text-primary">
              € {availableLiquidity.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
            </div>
        
            <div className="w-full sm:w-1/2 mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{liquidityPercentage.toFixed(0)}% del totale</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${liquidityPercentage}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}