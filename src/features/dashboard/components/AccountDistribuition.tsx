import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Wallet, TrendingUp } from "lucide-react"
import { useTransactions } from "@/features/transactions/api/useTransactions"
import { useBanks } from "@/features/banks/api/useBanks"

export function AccountsDistribution() {
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { data: banks, isLoading: banksLoading } = useBanks()

  const { bankBalance, cashBalance, investBalance, total } = useMemo(() => {
    if (!transactions || !banks) {
      return { bankBalance: 0, cashBalance: 0, investBalance: 0, total: 0 }
    }

    const balances: Record<string, number> = {}
    banks.forEach((b) => (balances[b._id] = 0))

    transactions.forEach((tx) => {
      const accountId = typeof tx.account === "object" ? tx.account?._id : tx.account
      const toAccountId = typeof tx.toAccount === "object" ? tx.toAccount?._id : tx.toAccount
      const amount = Number(tx.amount)

      if (!accountId) return

      if (tx.type === "income") {
        balances[accountId] += amount
      } else if (tx.type === "expense") {
        balances[accountId] += amount // L'importo a DB è già negativo
      } else if (tx.type === "transfer") {
        balances[accountId] -= amount
        if (toAccountId) {
          balances[toAccountId] += amount
        }
      }
    })

    let bankTotal = 0
    let cashTotal = 0
    let investTotal = 0

    banks.forEach((bank) => {
      const balance = balances[bank._id] || 0
      if (bank.accountType === "OPERATIVE") bankTotal += balance
      if (bank.accountType === "CASH") cashTotal += balance
      if (bank.accountType === "INVESTMENT") investTotal += balance
    })

    const totalSum = bankTotal + cashTotal + investTotal

    return {
      bankBalance: bankTotal,
      cashBalance: cashTotal,
      investBalance: investTotal,
      total: totalSum > 0 ? totalSum : 1, // Previene divisioni per 0
    }
  }, [transactions, banks])

  const isLoading = txLoading || banksLoading

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  const bankPct = Math.max(0, Math.round((bankBalance / total) * 100))
  const cashPct = Math.max(0, Math.round((cashBalance / total) * 100))
  const investPct = Math.max(0, Math.round((investBalance / total) * 100))

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Allocazione Liquidità
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Conti Bancari */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4 text-blue-500" />
              Conti Bancari
            </span>
            <span className="font-semibold">
              € {bankBalance.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${bankPct}%` }}
            />
          </div>
        </div>

        {/* Contanti / Portafoglio */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="w-4 h-4 text-emerald-500" />
              Contanti (Portafoglio)
            </span>
            <span className="font-semibold">
              € {cashBalance.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${cashPct}%` }}
            />
          </div>
        </div>

        {/* Investimenti (visibile solo se presenti o diversi da zero) */}
        {investBalance > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                Investimenti
              </span>
              <span className="font-semibold">
                € {investBalance.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${investPct}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}