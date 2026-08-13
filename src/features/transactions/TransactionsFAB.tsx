import { useState } from "react"
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
import { CalendarIcon } from "lucide-react" // Oppure l'icona che preferisci
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useCreateTransaction } from "./api/useTransactions"
import { useTypes, useCategories } from "@/features/categories/api/useCategories" 

export function TransactionFAB() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTypeId, setSelectedTypeId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const createMutation = useCreateTransaction()
  
  const { data: types } = useTypes()
  const { data: categories } = useCategories(selectedTypeId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    const numericAmount = parseFloat(amount)

    if (!selectedTypeId) {
      setErrorMsg("Seleziona il tipo di movimento")
      return
    }

    const currentTypeObj = types?.find((t: any) => t._id === selectedTypeId)
    const typeName = currentTypeObj?.name?.toLowerCase() || ""

    const isIncomeType = typeName.includes("entrata") || typeName.includes("income") || typeName.includes("positivo")
    const isExpenseType = typeName.includes("uscita") || typeName.includes("expense") || typeName.includes("spesa") || typeName.includes("negativo")

    if (isIncomeType && numericAmount < 0) {
      setErrorMsg("Un'entrata non può avere un importo negativo.")
      return
    }

    if (isExpenseType && numericAmount > 0) {
      setErrorMsg("Un'uscita non può avere un importo positivo.")
      return
    }

    if (!selectedCategory) {
      setErrorMsg("Seleziona una categoria")
      return
    }

    createMutation.mutate(
      {
        amount: numericAmount,
        description,
        type: numericAmount >= 0 ? "income" : "expense",
        category: selectedCategory,
        date: date.toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setAmount("")
          setDescription("")
          setDate(new Date())
          setSelectedTypeId("")
          setSelectedCategory("")
          setErrorMsg("")
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
            Aggiungi un'entrata o un'uscita al tuo bilancio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          {errorMsg && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipo Movimento</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedTypeId}
              onChange={(e) => {
                setSelectedTypeId(e.target.value)
                setSelectedCategory("")
                setErrorMsg("")
              }}
              required
            >
              <option value="" disabled>Seleziona tipo...</option>
              {types?.map((t: any) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Importo (€)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="es. -50.00 o 1200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

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

          <div className="space-y-2">
            <Label>Categoria</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={!selectedTypeId}
              required
            >
              <option value="" disabled>
                {selectedTypeId ? "Seleziona una categoria..." : "Prima seleziona il tipo..."}
              </option>
              {categories?.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Descrizione (Opzionale)</Label>
            <Input
              placeholder="es. Spesa supermercato"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Salvataggio..." : "Crea Movimento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}