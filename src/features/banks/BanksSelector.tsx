import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet01Icon, BerlinIcon, PiggyBankIcon } from "hugeicons-react"
import { useBanks } from "./api/useBanks"

export function BankSelector() {
  const { data: banks, isLoading } = useBanks()

  const operativeBanks = banks?.filter(b => b.accountType === 'OPERATIVE') || []
  const investmentBanks = banks?.filter(b => b.accountType === 'INVESTMENT') || []

  return (
    <div className="mt-2 mb-5">
      <Select defaultValue="all">
        <SelectTrigger className="w-[280px] h-10 bg-background">
          <SelectValue placeholder={isLoading ? "Caricamento conti..." : "Seleziona un conto"} />
        </SelectTrigger>
        
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Panoramica
            </SelectLabel>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Wallet01Icon className="w-4 h-4 text-primary" />
                <span className="font-medium">Tutti i conti (Totale)</span>
              </div>
            </SelectItem>
          </SelectGroup>

          {operativeBanks.length > 0 && (
            <SelectGroup className="mt-2">
              <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                Conti Operativi
              </SelectLabel>
              {operativeBanks.map(bank => (
                <SelectItem key={bank._id} value={bank._id}>
                  <div className="flex items-center justify-between w-full min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <BerlinIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{bank.bankName}</span>
                    </div>
                    {bank.identifier && (
                      <span className="text-xs text-muted-foreground ml-4">{bank.identifier}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {investmentBanks.length > 0 && (
            <SelectGroup className="mt-2">
              <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                Risparmi & Investimenti
              </SelectLabel>
              {investmentBanks.map(bank => (
                <SelectItem key={bank._id} value={bank._id}>
                  <div className="flex items-center justify-between w-full min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <PiggyBankIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{bank.bankName}</span>
                    </div>
                    {bank.identifier && (
                      <span className="text-xs text-muted-foreground ml-4">{bank.identifier}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}