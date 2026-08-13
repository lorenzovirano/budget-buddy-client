import { useState } from "react"
import { useTransactions, useDeleteTransaction } from "./api/useTransactions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Delete02Icon } from "hugeicons-react"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export function Transactions() {
  const { data: transactions, isLoading, error } = useTransactions()
  const deleteMutation = useDeleteTransaction()
  
  // Stato per gestire l'alert di conferma
  const [txToDelete, setTxToDelete] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transazioni</h2>
        <p className="text-muted-foreground mt-2">Lista di tutti i movimenti registrati.</p>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrizione</TableHead>
              <TableHead className="text-right">Importo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Caricamento movimenti...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive py-8">
                  Errore nel caricamento delle transazioni.
                </TableCell>
              </TableRow>
            ) : transactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nessuna transazione trovata.
                </TableCell>
              </TableRow>
            ) : (
              transactions?.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-medium">{new Date(tx.date).toLocaleDateString()}</TableCell>
                  
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {typeof tx.category === 'object' && tx.category !== null ? (tx.category as any).name : "Categoria"}
                    </span>
                  </TableCell>

                  <TableCell>{tx.description || "-"}</TableCell>

                  <TableCell className={`text-right font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? `+€${tx.amount.toFixed(2)}` : `-€${Math.abs(tx.amount).toFixed(2)}`}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      onClick={() => setTxToDelete(tx._id)}
                    >
                      <Delete02Icon className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ALERT DI CONFERMA ELIMINAZIONE */}
      <AlertDialog open={!!txToDelete} onOpenChange={(open) => !open && setTxToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà permanentemente la transazione selezionata. Non sarà possibile annullare l'operazione.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => txToDelete && deleteMutation.mutate(txToDelete, {
                onSuccess: () => setTxToDelete(null)
              })}
            >
              {deleteMutation.isPending ? "Eliminazione..." : "Conferma ed elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}