import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusSignIcon } from "hugeicons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { cn } from "@/lib/utils"

import { useCreateTransaction } from "./api/useTransactions"
import { useTypes, useCategories } from "@/features/categories/api/useCategories"
import { useBanks } from "@/features/banks/api/useBanks"

export function TransactionFAB() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense") 
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [selectedCategory, setSelectedCategory] = useState("")
  const [account, setAccount] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const createMutation = useCreateTransaction()
  
  const { data: types } = useTypes()
  const { data: banks } = useBanks()


  const currentTypeObj = types?.find((t: any) => {
    const name = t.name.toLowerCase();
    if (type === "expense") return name.includes("uscita") || name.includes("expense") || name.includes("spesa") || name.includes("negativo");
    if (type === "income") return name.includes("entrata") || name.includes("income") || name.includes("positivo");
    return false;
  })
  
  const typeIdForCategories = currentTypeObj?._id || ""
  const { data: categories } = useCategories(typeIdForCategories)

  useEffect(() => {
    setSelectedCategory("")
    setErrorMsg("")
  }, [type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    
    const numericAmount = Math.abs(parseFloat(amount))

    if (!account) {
      return setErrorMsg("Seleziona il conto di origine")
    }

    if (type === 'transfer') {
      if (!toAccount) return setErrorMsg("Seleziona il conto di destinazione")
      if (account === toAccount) return setErrorMsg("Il conto di destinazione deve essere diverso da quello di origine")
    } else {
      if (!selectedCategory) return setErrorMsg("Seleziona una categoria")
    }

    createMutation.mutate(
      {
        amount: numericAmount,
        type,
        account,
        ...(type === 'transfer' ? { toAccount } : { category: selectedCategory }),
        description,
        date: date.toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setAmount("")
          setDescription("")
          setDate(new Date())
          setAccount("")
          setToAccount("")
          setSelectedCategory("")
          setErrorMsg("")
          setType("expense")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        >
          <PlusSignIcon className="w-6 h-6" strokeWidth={3} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuovo Movimento</DialogTitle>
          <DialogDescription>
            Registra una transazione o sposta fondi.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {errorMsg && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium">
              {errorMsg}
            </div>
          )}

          <Tabs value={type} onValueChange={(val: any) => setType(val)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expense">Uscita</TabsTrigger>
              <TabsTrigger value="income">Entrata</TabsTrigger>
              <TabsTrigger value="transfer">Giroconto</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2 mt-2">
            <Label>Importo (€)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="es. 50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{type === 'transfer' ? "Dal conto" : "Conto"}</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            >
              <option value="" disabled>Seleziona conto...</option>
              {banks?.map((b: any) => (
                <option key={b._id} value={b._id}>{b.bankName}</option>
              ))}
            </select>
          </div>

          {type === 'transfer' && (
            <div className="space-y-2">
              <Label>Al conto (Destinazione)</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              >
                <option value="" disabled>Seleziona destinazione...</option>
                {/* Filtra la banca di origine per evitare errori stupidi */}
                {banks?.filter((b: any) => b._id !== account).map((b: any) => (
                  <option key={b._id} value={b._id}>{b.bankName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Calendar Shadcn Popover */}
          <div className="space-y-2 flex flex-col">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: it }) : <span>Seleziona una data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {type !== 'transfer' && (
            <div className="space-y-2">
              <Label>Categoria</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={!typeIdForCategories}
                required
              >
                <option value="" disabled>
                  {typeIdForCategories ? "Seleziona una categoria..." : "Caricamento categorie..."}
                </option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Descrizione (Opzionale)</Label>
            <Input
              placeholder={type === 'transfer' ? "es. Giroconto o Prelievo" : "es. Spesa supermercato"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Salvataggio..." : "Salva Operazione"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}