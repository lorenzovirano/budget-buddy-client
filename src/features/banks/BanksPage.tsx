import { useState } from "react"
import { useBanks, useCreateBank, useDeleteBank } from "./api/useBanks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PlusSignIcon, Delete01Icon, BerlinIcon, PiggyBankIcon } from "hugeicons-react"
import { Loader2 } from "lucide-react"

export function BanksPage() {
  const { data: banks, isLoading } = useBanks()
  const createMutation = useCreateBank()
  const deleteMutation = useDeleteBank()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [bankToDelete, setBankToDelete] = useState<string | null>(null)
  
  // Form State
  const [bankName, setBankName] = useState("")
  const [accountType, setAccountType] = useState<'OPERATIVE' | 'INVESTMENT'>('OPERATIVE')
  const [identifier, setIdentifier] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { bankName, accountType, identifier },
      {
        onSuccess: () => {
          setIsCreateOpen(false)
          setBankName("")
          setIdentifier("")
          setAccountType('OPERATIVE')
        }
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conti e Carte</h1>
          <p className="text-muted-foreground">Gestisci le tue banche e i conti di investimento.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusSignIcon className="h-4 w-4 mr-2" /> Aggiungi Conto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Conto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome Banca / Servizio</Label>
                <Input placeholder="es. Intesa Sanpaolo" value={bankName} onChange={e => setBankName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Tipologia</Label>
                <Select value={accountType} onValueChange={(val: any) => setAccountType(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPERATIVE">Conto Operativo / Carta</SelectItem>
                    <SelectItem value="INVESTMENT">Risparmio / Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Identificativo (Opzionale)</Label>
                <Input placeholder="es. IT...4567" value={identifier} onChange={e => setIdentifier(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvataggio..." : "Salva Conto"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banca</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Identificativo</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell>
              </TableRow>
            ) : banks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Nessun conto configurato.</TableCell>
              </TableRow>
            ) : (
              banks?.map((bank) => (
                <TableRow key={bank._id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {bank.accountType === 'OPERATIVE' ? <BerlinIcon className="w-4 h-4 text-muted-foreground" /> : <PiggyBankIcon className="w-4 h-4 text-muted-foreground" />}
                    {bank.bankName}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md uppercase tracking-wider font-semibold">
                      {bank.accountType === 'OPERATIVE' ? 'Operativo' : 'Investimento'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{bank.identifier || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => setBankToDelete(bank._id)}>
                      <Delete01Icon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!bankToDelete} onOpenChange={(open) => !open && setBankToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>Vuoi davvero eliminare questo conto? L'azione è irreversibile.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => bankToDelete && deleteMutation.mutate(bankToDelete, { onSuccess: () => setBankToDelete(null) })}>
              {deleteMutation.isPending ? "Eliminazione..." : "Elimina Conto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}