import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wallet01Icon, BerlinIcon, CreditCardIcon, PiggyBankIcon } from "hugeicons-react"

export function BankSelector() {
  return (
    <div className="mt-2 mb-5">
        <Select defaultValue="all">
            <SelectTrigger className="w-[280px] h-10 bg-background">
                <SelectValue placeholder="Seleziona un conto" />
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

                <SelectGroup className="mt-2">
                <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    Conti Operativi
                </SelectLabel>
                <SelectItem value="intesa">
                    <div className="flex items-center justify-between w-full min-w-[200px]">
                    <div className="flex items-center gap-2">
                        <BerlinIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Intesa Sanpaolo</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-4">IT...4567</span>
                    </div>
                </SelectItem>
                <SelectItem value="revolut">
                    <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Revolut</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-4">LT...8901</span>
                    </div>
                </SelectItem>
                </SelectGroup>

                <SelectGroup className="mt-2">
                <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    Risparmi & Investimenti
                </SelectLabel>
                <SelectItem value="trade-republic">
                    <div className="flex items-center gap-2">
                    <PiggyBankIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Trade Republic</span>
                    </div>
                </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}