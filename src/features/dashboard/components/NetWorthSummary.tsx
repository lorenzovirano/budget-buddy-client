import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet01Icon, Coins01Icon } from "hugeicons-react"
import { useTransactions } from "@/features/transactions/api/useTransactions"
import { useBanks } from "@/features/banks/api/useBanks"
import { useGetPortfolio } from "@/features/investments/api/useInvestments" // <--- Aggiunto import

export function NetWorthSummary() {
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { data: banks, isLoading: banksLoading } = useBanks()
  const { data: portfolio, isLoading: portfolioLoading } = useGetPortfolio() // <--- Fetch dati portafoglio

  const { netWorth, availableLiquidity } = useMemo(() => {
    if (!transactions || !banks) return { netWorth: 0, availableLiquidity: 0 }

    const balances: Record<string, number> = {}
    banks.forEach(b => (balances[b._id] = 0))

    transactions.forEach(tx => {
      const accountId = typeof tx.account === 'object' ? tx.account?._id : tx.account;
      const toAccountId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
      
      const amount = Number(tx.amount)
      
      if (!accountId) return;

      if (tx.type === 'income') {
        balances[accountId] += amount
      } 
      else if (tx.type === 'expense') {
        balances[accountId] += amount
      } 
      else if (tx.type === 'transfer') {
        balances[accountId] -= amount 
        if (toAccountId) {
          balances[toAccountId] += amount
        }
      }
    })

    let totalBankBalances = 0
    let available = 0

    banks.forEach(bank => {
      const bankBalance = balances[bank._id] || 0
      totalBankBalances += bankBalance
      
      if (bank.accountType === 'OPERATIVE' || bank.accountType === 'CASH') {
        available += bankBalance
      }
    })

    // <--- Aggiungiamo il valore totale degli investimenti al Patrimonio Netto
    const investmentsTotal = portfolio?.summary?.totalValue || 0;
    const total = totalBankBalances + investmentsTotal;

    return { netWorth: total, availableLiquidity: available }
  }, [transactions, banks, portfolio]) // <--- Aggiunto portfolio alle dipendenze

  // <--- Aggiornato l'isLoading per aspettare anche gli investimenti
  const isLoading = txLoading || banksLoading || portfolioLoading
  
  const liquidityPercentage = netWorth > 0 ? (availableLiquidity / netWorth) * 100 : 0

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="hidden sm:block w-px bg-border my-2" />
            <div className="space-y-4 flex-1 sm:items-end flex flex-col">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col justify-between">
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
              € {netWorth.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">
              Inclusi investimenti e liquidità
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
              € {availableLiquidity.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        
            <div className="w-full sm:w-1/2 mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{liquidityPercentage.toFixed(0)}% del totale</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(liquidityPercentage, 100)}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}