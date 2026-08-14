import { useState, useEffect } from "react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { CalendarIcon, Plus, Repeat, CalendarClock, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Importiamo gli hook
import { useRecurring } from "./api/useRecurring"
import { useCreateRecurring } from "./api/useRecurringMutations"
import { useTypes, useCategories } from "@/features/categories/api/useCategories"
import { useBanks } from "@/features/banks/api/useBanks"

export function RecurringPage() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"expense" | "income">("expense")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const [nextDate, setNextDate] = useState<Date>(new Date())
  const [account, setAccount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Dati
  const { data: recurringList, isLoading } = useRecurring()
  const createMutation = useCreateRecurring()
  const { data: banks } = useBanks()
  
  // Categorie dinamiche in base al tipo
  const { data: types } = useTypes()
  const currentTypeObj = types?.find((t: any) => {
    const name = t.name.toLowerCase();
    if (type === "expense") return name.includes("uscita") || name.includes("expense") || name.includes("spesa") || name.includes("negativo");
    if (type === "income") return name.includes("entrata") || name.includes("income") || name.includes("positivo");
    return false;
  })
  const typeIdForCategories = currentTypeObj?._id || ""
  const { data: categories } = useCategories(typeIdForCategories)

  // Reset category on type change
  useEffect(() => {
    setSelectedCategory("")
    setErrorMsg("")
  }, [type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!account) return setErrorMsg("Seleziona il conto di addebito")
    if (!selectedCategory) return setErrorMsg("Seleziona una categoria")
    if (!title.trim()) return setErrorMsg("Inserisci un titolo per l'abbonamento")

    createMutation.mutate(
      {
        title,
        amount: Math.abs(parseFloat(amount)),
        type,
        frequency,
        nextDate: nextDate.toISOString(),
        account,
        category: selectedCategory,
        active: true
      },
      {
        onSuccess: () => {
          setOpen(false)
          setTitle("")
          setAmount("")
          setNextDate(new Date())
          setAccount("")
          setSelectedCategory("")
          setErrorMsg("")
        },
        onError: (error: any) => {
          setErrorMsg(error.response?.data?.message || "Errore durante il salvataggio.");
        }
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spese Ricorrenti</h2>
          <p className="text-muted-foreground mt-1">
            Gestisci i tuoi abbonamenti, bollette e rate fisse.
          </p>
        </div>

        {/* MODALE DI AGGIUNTA */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuovo Abbonamento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Aggiungi Ricorrente</DialogTitle>
              <DialogDescription>Imposta un nuovo movimento automatico.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
              {errorMsg && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium">
                  {errorMsg}
                </div>
              )}

              <Tabs value={type} onValueChange={(val: any) => setType(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Uscita fissa</TabsTrigger>
                  <TabsTrigger value="income">Entrata fissa</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2 mt-2">
                <Label>Nome (es. Netflix, Palestra)</Label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo abbonamento" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Importo (€)</Label>
                  <Input required type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Frequenza</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={frequency}
                    onChange={(e: any) => setFrequency(e.target.value)}
                  >
                    <option value="weekly">Settimanale</option>
                    <option value="monthly">Mensile</option>
                    <option value="yearly">Annuale</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label>Prossimo Addebito</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !nextDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextDate ? format(nextDate, "PPP", { locale: it }) : <span>Seleziona data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={nextDate} onSelect={(d) => d && setNextDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Conto di Addebito</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                >
                  <option value="" disabled>Seleziona conto...</option>
                  {banks?.map((b: any) => <option key={b._id} value={b._id}>{b.bankName}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={!typeIdForCategories}
                >
                  <option value="" disabled>Seleziona categoria...</option>
                  {categories?.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvataggio..." : "Aggiungi Ricorrente"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA ABBONAMENTI ATTIVI */}
      <Card>
        <CardHeader>
          <CardTitle>I tuoi abbonamenti</CardTitle>
          <CardDescription>Visualizza e gestisci le tue spese fisse mensili e annuali.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />)}
            </div>
          ) : !recurringList || recurringList.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
              <Repeat className="w-10 h-10 mb-3 opacity-20" />
              <p>Nessun pagamento ricorrente impostato.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {recurringList.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${item.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground gap-2 mt-1">
                        <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" /> {format(new Date(item.nextDate), "dd MMM yyyy", { locale: it })}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {item.account?.bankName}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${item.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {item.type === 'expense' ? '-' : '+'}€{item.amount.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      /{item.frequency === 'monthly' ? 'mese' : item.frequency === 'yearly' ? 'anno' : 'sett'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}