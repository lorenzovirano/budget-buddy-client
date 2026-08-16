import { useState } from "react"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { api } from "@/lib/api"
import { useBanks } from "@/features/banks/api/useBanks" 
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowRight, Settings2 } from "lucide-react"

export function CsvImportCard() {
  const [step, setStep] = useState<"upload" | "mapping">("upload")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<any[]>([])
  
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [mapping, setMapping] = useState({
    date: "",
    amount: "",
    description: "",
    category: "none"
  })

  const { data: banks } = useBanks() 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      
      if (!['csv', 'xlsx', 'xls'].includes(fileExt || '')) {
        setMessage({ type: 'error', text: "Per favore, seleziona un file CSV o Excel (.xlsx, .xls)." })
        return
      }
      
      const findRealHeaderRowIndex = (dataArray: any[][]) => {
        for (let i = 0; i < Math.min(30, dataArray.length); i++) {
          const row = dataArray[i];
          if (!row) continue;
          const rowString = row.join(' ').toLowerCase();
          
          if (rowString.includes('data') && (rowString.includes('importo') || rowString.includes('operazione') || rowString.includes('dettagli'))) {
            return i;
          }
        }
        return 0;
      }
      
      const processMatrixData = (dataMatrix: any[][]) => {
         const headerIndex = findRealHeaderRowIndex(dataMatrix);
         const rawHeaders = dataMatrix[headerIndex] || [];
         
         const headers = rawHeaders.map((h, i) => {
             const cleanH = String(h || '').trim();
             return cleanH !== '' ? cleanH : `Colonna ${i + 1}`;
         });

         const dataRows = dataMatrix.slice(headerIndex + 1);
         
         const formattedData = dataRows.map(row => {
             const obj: any = {};
             headers.forEach((header, index) => {
                 obj[header] = row[index];
             });
             return obj;
         }).filter(row => {
             return Object.values(row).some(val => val !== undefined && val !== null && String(val).trim() !== '')
         });
         
         if (formattedData.length > 0) {
            setCsvHeaders(headers)
            setCsvData(formattedData)
            setStep("mapping")
         } else {
            setMessage({ type: 'error', text: "Nessuna transazione valida trovata nel file." })
         }
      }

      if (fileExt === 'xlsx' || fileExt === 'xls') {
        const reader = new FileReader()
        reader.onload = (evt) => {
          try {
            const buffer = evt.target?.result
            const workbook = XLSX.read(buffer, { type: "array" })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            
            const dataMatrix = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            processMatrixData(dataMatrix);
            
          } catch (error) {
            setMessage({ type: 'error', text: "Errore durante la lettura del file Excel." })
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        Papa.parse(file, {
          skipEmptyLines: true,
          complete: (results) => {
            const dataMatrix = results.data as any[][];
            processMatrixData(dataMatrix);
          },
          error: (err) => setMessage({ type: 'error', text: `Errore CSV: ${err.message}` })
        })
      }
    }
  }

  const handleImport = async () => {
    if (!mapping.date || !mapping.amount || !mapping.description || !selectedAccountId) {
      setMessage({ type: 'error', text: "Compila tutti i campi obbligatori, incluso il conto di destinazione." })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const parseItalianNumber = (val: any) => {
      if (val === undefined || val === null) return 0;
      if (typeof val === 'number') return val; 
      const cleanStr = String(val).replace(/\./g, '').replace(',', '.');
      const num = parseFloat(cleanStr);
      return isNaN(num) ? 0 : num;
    }

    const parseDate = (val: any) => {
       if (!val) return new Date().toISOString();
       if (typeof val === 'number') {
           return new Date((val - (25567 + 2)) * 86400 * 1000).toISOString();
       }
       const str = String(val).trim();
       if (str.includes('/')) {
           const parts = str.split('/');
           if (parts.length === 3) {
               return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
           }
       }
       return str; 
    }

    try {
      const cleanTransactions = csvData.map(row => {
        const parsedAmount = parseItalianNumber(row[mapping.amount]);
        return {
          date: parseDate(row[mapping.date]),
          amount: parsedAmount,
          description: row[mapping.description],
          type: parsedAmount > 0 ? 'income' : 'expense',
          category: mapping.category !== "none" ? row[mapping.category] : null 
        }
      })

      if (!api || typeof api.post !== 'function') {
         throw new Error("L'istanza di Axios (api) non è definita! Controlla l'import in cima al file.");
      }

      await api.post("/transaction/bulk", { 
          transactions: cleanTransactions, 
          account: selectedAccountId 
      })

      setMessage({ type: 'success', text: `${cleanTransactions.length} transazioni importate con successo!` })
      
      setStep("upload")
      setCsvHeaders([])
      setCsvData([])
      setMapping({ date: "", amount: "", description: "", category: "none" })
      setSelectedAccountId("")
      
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || "Errore durante il salvataggio sul server." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setStep("upload")
    setCsvHeaders([])
    setCsvData([])
    setMessage(null)
    setSelectedAccountId("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === "upload" ? <FileSpreadsheet className="w-5 h-5 text-primary" /> : <Settings2 className="w-5 h-5 text-primary" />}
          Importazione Massiva (CSV)
        </CardTitle>
        <CardDescription>
          {step === "upload" 
            ? "Carica il file esportato dalla tua banca." 
            : "Associa le colonne del tuo file ai dati di Budget Buddy."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {message && (
          <div className={`p-3 flex items-start gap-3 text-sm border rounded-md ${
            message.type === 'success' 
              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
              : 'text-red-500 bg-red-500/10 border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="mt-0.5">{message.text}</p>
          </div>
        )}

        {step === "upload" && (
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/20 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
            <div className="space-y-1">
              <p className="text-base font-medium">
                Trascina qui il file, o <span className="text-primary underline">clicca per cercare</span>
              </p>
              <p className="text-sm text-muted-foreground">Supporta file CSV ed Excel (.xlsx, .xls)</p>
            </div>
          </div>
        )}

        {step === "mapping" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-muted/30 rounded-lg border border-border flex items-center justify-between">
              <div>
                <p className="font-medium">File analizzato con successo</p>
                <p className="text-sm text-muted-foreground">Trovate {csvData.length} righe valide.</p>
              </div>
              <CheckCircle2 className="text-emerald-500 w-6 h-6" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Data della Transazione <span className="text-red-500">*</span></Label>
                <Select value={mapping.date} onValueChange={(val) => setMapping({...mapping, date: val})}>
                  <SelectTrigger><SelectValue placeholder="Seleziona colonna..." /></SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map(h => <SelectItem key={`date-${h}`} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">Importo / Cifra <span className="text-red-500">*</span></Label>
                <Select value={mapping.amount} onValueChange={(val) => setMapping({...mapping, amount: val})}>
                  <SelectTrigger><SelectValue placeholder="Seleziona colonna..." /></SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map(h => <SelectItem key={`amount-${h}`} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Descrizione / Causale <span className="text-red-500">*</span></Label>
                <Select value={mapping.description} onValueChange={(val) => setMapping({...mapping, description: val})}>
                  <SelectTrigger><SelectValue placeholder="Seleziona colonna..." /></SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map(h => <SelectItem key={`desc-${h}`} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Categoria <span className="text-muted-foreground text-xs font-normal">(Opzionale)</span>
                </Label>
                <Select value={mapping.category} onValueChange={(val) => setMapping({...mapping, category: val})}>
                  <SelectTrigger><SelectValue placeholder="Non mappare..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Non mappare --</SelectItem>
                    {csvHeaders.map(h => <SelectItem key={`cat-${h}`} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Conto di Destinazione <span className="text-red-500">*</span></Label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger><SelectValue placeholder="Seleziona conto..." /></SelectTrigger>
                  <SelectContent>
                    {banks?.map((bank: any) => (
                      <SelectItem key={bank._id} value={bank._id}>
                        {bank.bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {step === "mapping" && (
        <CardFooter className="flex justify-between border-t border-border pt-4">
          <Button variant="ghost" onClick={handleCancel} disabled={isLoading}>
            Annulla
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !mapping.date || !mapping.amount || !mapping.description || !selectedAccountId}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Elaborazione...
              </>
            ) : (
              <>
                Conferma e Importa <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}