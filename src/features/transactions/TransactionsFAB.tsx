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

export function TransactionFAB() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon-lg"
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
        
        <div className="flex flex-col gap-4 py-4">
          <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            Area Form in costruzione...
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}