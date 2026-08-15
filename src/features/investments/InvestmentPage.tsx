import { useState } from "react"
import { useGetPortfolio, useAddInvestment, useDeleteInvestment } from "./api/useInvestments"
import { useBanks } from "@/features/banks/api/useBanks" // <--- Importiamo i conti bancari
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Loader2, Plus, TrendingDown, TrendingUp, Wallet, Trash2, Check, ChevronsUpDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const ASSET_LIST = [
  { group: "Criptovalute", items: [{ symbol: "BTC-USD", name: "Bitcoin" }, { symbol: "ETH-USD", name: "Ethereum" }, { symbol: "SOL-USD", name: "Solana" }] },
  { group: "Azioni", items: [{ symbol: "AAPL", name: "Apple Inc." }, { symbol: "MSFT", name: "Microsoft" }, { symbol: "TSLA", name: "Tesla" }, { symbol: "NVDA", name: "NVIDIA" }] },
  { group: "ETF", items: [{ symbol: "VWCE.MI", name: "Vanguard FTSE All-World" }, { symbol: "SWDA.MI", name: "iShares Core MSCI World" }, { symbol: "CSSPX.MI", name: "iShares Core S&P 500" }] },
]

export function InvestmentsPage() {
  const { data: portfolio, isLoading: isPortfolioLoading } = useGetPortfolio()
  const { data: banks, isLoading: isBanksLoading } = useBanks() // Fetch dei conti
  const addMutation = useAddInvestment()
  const deleteMutation = useDeleteInvestment()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  
  // Stato per la modale di errore custom
  const [errorMsg, setErrorMsg] = useState("")

  // Stati del form
  const [bankId, setBankId] = useState("")
  const [symbol, setSymbol] = useState("")
  const [type, setType] = useState<"crypto" | "stock" | "etf">("crypto")
  const [quantity, setQuantity] = useState("")
  const [averageBuyPrice, setAverageBuyPrice] = useState("")

  const investmentBanks = banks?.filter(b => b.accountType === 'INVESTMENT') || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankId) {
      return setErrorMsg("Seleziona il conto (broker) su cui registrare l'investimento.")
    }
    if (!symbol) {
      return setErrorMsg("Seleziona un asset dalla lista prima di salvare.")
    }

    addMutation.mutate({
      bankId,
      symbol,
      type,
      quantity: Number(quantity),
      averageBuyPrice: Number(averageBuyPrice),
    }, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setBankId("")
        setSymbol("")
        setQuantity("")
        setAverageBuyPrice("")
      }
    })
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val)
  const formatPercent = (val: number) => `${val.toFixed(2)}%`

  const selectedAsset = ASSET_LIST.flatMap(g => g.items).find(i => i.symbol === symbol)

  if (isPortfolioLoading || isBanksLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  const summary = portfolio?.summary
  const isGlobalProfit = (summary?.totalGlobalProfitLoss ?? 0) >= 0

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* MODALE DI ERRORE CUSTOM */}
      <Dialog open={!!errorMsg} onOpenChange={() => setErrorMsg("")}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-2 text-destructive">
              <AlertCircle className="w-8 h-8" />
              Dati mancanti
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-muted-foreground">
            {errorMsg}
          </div>
          <Button onClick={() => setErrorMsg("")} className="w-full">Ho capito</Button>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portafoglio</h1>
          <p className="text-muted-foreground">Monitora i tuoi investimenti in tempo reale.</p>
        </div>
        
        {/* MODALE INSERIMENTO */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Aggiungi Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Investimento</DialogTitle>
            </DialogHeader>
            
            {/* Controllo se l'utente ha conti d'investimento */}
            {investmentBanks.length === 0 ? (
              <div className="p-4 text-center space-y-4">
                <p className="text-muted-foreground">Non hai ancora creato nessun conto d'investimento. Aggiungi un broker (es. Fineco, Binance) nella sezione Conti prima di iniziare.</p>
                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-full">Chiudi</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* SELEZIONE BROKER */}
                <div className="space-y-2">
                  <Label>Conto / Broker</Label>
                  <Select required value={bankId} onValueChange={setBankId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona dove hai acquistato l'asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentBanks.map((bank) => (
                        <SelectItem key={bank._id} value={bank._id}>
                          {bank.bankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* RICERCA ASSET */}
                <div className="space-y-2 flex flex-col">
                  <Label>Cerca Asset</Label>
                  <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isComboboxOpen}
                        className="w-full justify-between"
                      >
                        {selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : "Seleziona un prodotto..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Cerca ticker o nome (es. AAPL, Bitcoin)..." />
                        <CommandList>
                          <CommandEmpty>Nessun asset trovato.</CommandEmpty>
                          {ASSET_LIST.map((group) => (
                            <CommandGroup key={group.group} heading={group.group}>
                              {group.items.map((item) => (
                                <CommandItem
                                  key={item.symbol}
                                  value={`${item.name} ${item.symbol}`} 
                                  onSelect={() => {
                                    setSymbol(item.symbol)
                                    if(item.symbol.includes('-USD')) setType('crypto');
                                    else if(item.symbol.includes('.MI')) setType('etf');
                                    else setType('stock');
                                    setIsComboboxOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      symbol === item.symbol ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {item.name} ({item.symbol})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 hidden">
                  <Label>Tipo di Asset</Label>
                  <Input value={type} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantità</Label>
                    <Input required type="number" step="any" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="es. 0.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prezzo Medio di Carico</Label>
                    <Input required type="number" step="any" min="0" value={averageBuyPrice} onChange={(e) => setAverageBuyPrice(e.target.value)} placeholder="es. 50000" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-4" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Salva Investimento"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valore Totale</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalValue ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capitale Investito</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalInvested ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitto / Perdita</CardTitle>
            {isGlobalProfit ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isGlobalProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isGlobalProfit ? '+' : ''}{formatCurrency(summary?.totalGlobalProfitLoss ?? 0)}
            </div>
            <p className={`text-xs ${isGlobalProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isGlobalProfit ? '+' : ''}{formatPercent(summary?.totalGlobalProfitLossPercentage ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>I tuoi Asset</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio?.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nessun investimento trovato. Inizia ad aggiungerne uno!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broker</TableHead> {/* Nuova Colonna */}
                  <TableHead>Simbolo</TableHead>
                  <TableHead>Quantità</TableHead>
                  <TableHead>Prezzo Medio</TableHead>
                  <TableHead>Prezzo Attuale</TableHead>
                  <TableHead className="text-right">Valore Attuale</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio?.data.map((asset) => {
                  const isProfit = asset.profitLoss >= 0;
                  return (
                    <TableRow key={asset.id}>
                      <TableCell className="text-muted-foreground font-medium">{asset.bankName || 'N/A'}</TableCell> {/* Nome Banca */}
                      <TableCell className="font-bold">{asset.symbol}</TableCell>
                      <TableCell>{asset.quantity}</TableCell>
                      <TableCell>{formatCurrency(asset.averageBuyPrice)}</TableCell>
                      <TableCell>{formatCurrency(asset.livePrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(asset.currentTotalValue)}</TableCell>
                      <TableCell className={`text-right ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                        {isProfit ? '+' : ''}{formatCurrency(asset.profitLoss)} ({formatPercent(asset.profitLossPercentage)})
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => {
                            if(window.confirm(`Vuoi davvero eliminare ${asset.symbol} da ${asset.bankName}?`)) {
                              deleteMutation.mutate(asset.id)
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}