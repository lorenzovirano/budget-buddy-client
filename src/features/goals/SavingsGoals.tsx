import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Target01Icon, PlusSignIcon } from "hugeicons-react"
import { Loader2 } from "lucide-react"
import { useGoals, useCreateGoal, useAddFundsGoal, type Goal } from "./api/useGoals"

const COLOR_OPTIONS = [
  { label: "Blu", value: "bg-blue-500" },
  { label: "Smeraldo", value: "bg-emerald-500" },
  { label: "Viola", value: "bg-purple-500" },
  { label: "Rosso", value: "bg-red-500" },
  { label: "Zinco", value: "bg-zinc-800 dark:bg-zinc-200" },
]

export function SavingsGoals() {
  const { data: goals, isLoading } = useGoals()
  const createMutation = useCreateGoal()
  const addFundsMutation = useAddFundsGoal()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newTarget, setNewTarget] = useState("")
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value)

  const [fundGoal, setFundGoal] = useState<Goal | null>(null)
  const [fundAmount, setFundAmount] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newTarget) return

    createMutation.mutate(
      { title: newTitle, targetAmount: parseFloat(newTarget), indicatorColor: newColor },
      {
        onSuccess: () => {
          setIsCreateOpen(false)
          setNewTitle("")
          setNewTarget("")
          setNewColor(COLOR_OPTIONS[0].value)
        }
      }
    )
  }

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fundGoal || !fundAmount) return

    addFundsMutation.mutate(
      { id: fundGoal._id, amount: parseFloat(fundAmount) },
      {
        onSuccess: () => {
          setFundGoal(null)
          setFundAmount("")
          toast.success("Fondi aggiunti con successo! 🎉")
        },
        onError: (error: any) => {
          setFundGoal(null) // <-- Chiude il modale anche in caso di errore
          setFundAmount("") // <-- Pulisce l'input
          toast.error(
            error.response?.data?.message || "Impossibile aggiungere i fondi. Riprova."
          )
        }
      }
    )
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target01Icon className="w-5 h-5 text-primary" />
              Obiettivi & Risparmi
            </CardTitle>
            <CardDescription>
              Monitora i tuoi traguardi di allocazione
            </CardDescription>
          </div>
          
          {/* DIALOG CREAZIONE OBIETTIVO */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <PlusSignIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuovo Obiettivo di Risparmio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Titolo</Label>
                  <Input 
                    placeholder="es. Master DTU Copenaghen" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Obiettivo Finale (€)</Label>
                  <Input 
                    type="number" 
                    placeholder="es. 10000" 
                    value={newTarget} 
                    onChange={e => setNewTarget(e.target.value)} 
                    required 
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colore</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  >
                    {COLOR_OPTIONS.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvataggio..." : "Crea Obiettivo"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-start gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Caricamento obiettivi...
          </div>
        ) : goals?.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Nessun obiettivo impostato. Clicca sul tasto + in alto per iniziare a risparmiare!
          </div>
        ) : (
          goals?.map((goal) => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
            const isCompleted = percentage >= 100

            return (
              <div key={goal._id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-sm font-medium leading-none">
                      {goal.title}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {isCompleted 
                        ? "Obiettivo completato! 🎉" 
                        : `Mancano €${(goal.targetAmount - goal.currentAmount).toLocaleString("it-IT")} al traguardo`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">
                      €{goal.currentAmount.toLocaleString("it-IT")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      / €{goal.targetAmount.toLocaleString("it-IT")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Progress 
                    value={percentage} 
                    className="h-2 flex-1"
                    indicatorClassName={goal.indicatorColor}
                  />
                  
                  {/* TASTO PLUS PER AGGIUNGERE FONDI AL SINGOLO OBIETTIVO */}
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-6 w-6 rounded-full shrink-0"
                    disabled={isCompleted}
                    onClick={() => setFundGoal(goal)}
                  >
                    <PlusSignIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>

      {/* DIALOG AGGIUNTA FONDI (Condiviso per tutti gli obiettivi) */}
      <Dialog open={!!fundGoal} onOpenChange={(open) => !open && setFundGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi fondi a "{fundGoal?.title}"</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFunds} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Importo da aggiungere (€)</Label>
              <Input 
                type="number" 
                placeholder="es. 150" 
                value={fundAmount} 
                onChange={e => setFundAmount(e.target.value)} 
                required 
                min="0.01"
                step="0.01"
              />
            </div>
            <Button type="submit" className="w-full" disabled={addFundsMutation.isPending}>
              {addFundsMutation.isPending ? "Aggiunta in corso..." : "Aggiungi Risparmi"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}