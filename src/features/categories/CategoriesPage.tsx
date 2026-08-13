import { useState, useEffect } from "react"
import { useTypes, useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "./api/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, Loader2 } from "lucide-react"

export function CategoriesPage() {
  const { data: types, isLoading: isLoadingTypes } = useTypes()
  
  const [activeTab, setActiveTab] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  
  useEffect(() => {
    if (types && types.length > 0 && !activeTab) {
      setActiveTab(types[0]._id)
    }
  }, [types, activeTab])

  const { data: categories, isLoading: isLoadingCategories } = useCategories(activeTab)
  const createMutation = useCreateCategory()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim() || !activeTab) return

    createMutation.mutate(
      { name: newCategoryName, typeId: activeTab },
      {
        onSuccess: () => {
          setIsModalOpen(false) // Chiudi il modale
          setNewCategoryName("") // Pulisci l'input
        }
      }
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questa categoria?")) {
      deleteMutation.mutate({ id, typeId: activeTab })
    }
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    updateMutation.mutate(
      { id: editingCategory.id, name: editingCategory.name, typeId: activeTab },
      {
        onSuccess: () => setEditingCategory(null)
      }
    )
  }

  if (isLoadingTypes) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorie</h1>
          <p className="text-muted-foreground">Gestisci le tue categorie di entrata e uscita.</p>
        </div>
        
        {/* MODALE DI CREAZIONE */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea una nuova categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome Categoria</Label>
                <Input 
                  placeholder="es. Assicurazione, Abbonamenti..." 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  value={types?.find(t => t._id === activeTab)?.name || ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</>
                ) : (
                  "Salva Categoria"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* CONTENUTO A SCHEDE (TABS) */}
      {types && types.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="mb-4">
            {types.map(type => (
              <TabsTrigger key={type._id} value={type._id} className="min-w-[120px]">
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {types.map(type => (
            <TabsContent key={type._id} value={type._id}>
              <div className="border rounded-md bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="w-[100px] text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCategories ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Caricamento...
                        </TableCell>
                      </TableRow>
                    ) : categories?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-10 text-muted-foreground">
                          Nessuna categoria trovata.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories?.map((cat) => (
                        <TableRow key={cat._id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {cat.name}
                            
                            {!cat.user && (
                              <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                                Sistema
                              </span>
                            )}
                          </TableCell>
                          
                          <TableCell className="text-right space-x-2">
                            {cat.user ? (
                                <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setEditingCategory({ id: cat._id, name: cat.name })}
                                >
                                    Modifica
                                </Button>
                                <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setCategoryToDelete(cat._id)}
                                >
                                Elimina
                                </Button>
                                </>
                            ) : (
                                <span className="text-xs text-muted-foreground mr-4 italic">
                                Sistema (Bloccato)
                                </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Modifica Categoria</DialogTitle>
                </DialogHeader>
                <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    if (editingCategory) {
                    updateMutation.mutate({ 
                        id: editingCategory.id, 
                        name: editingCategory.name, 
                        typeId: activeTab 
                    }, {
                        onSuccess: () => setEditingCategory(null)
                    });
                    }
                }} 
                className="space-y-4 pt-4"
                >
                <div className="space-y-2">
                    <Label>Nuovo Nome</Label>
                    <Input 
                    value={editingCategory?.name || ""}
                    onChange={(e) => setEditingCategory(prev => prev ? {...prev, name: e.target.value} : null)}
                    required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Salvataggio..." : "Salva modifiche"}
                </Button>
                </form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                Questa azione eliminerà permanentemente la categoria. Le transazioni associate potrebbero perdere il riferimento alla categoria.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Annulla</AlertDialogCancel>
                <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                    if (categoryToDelete) {
                    deleteMutation.mutate(
                        { id: categoryToDelete, typeId: activeTab },
                        {
                        onSuccess: () => setCategoryToDelete(null),
                        onError: (err: any) => {
                            alert("Errore nell'eliminazione: " + (err.response?.data?.message || "Errore sconosciuto"))
                        }
                        }
                    )
                    }
                }}
                >
                {deleteMutation.isPending ? "Eliminazione..." : "Conferma ed elimina"}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}