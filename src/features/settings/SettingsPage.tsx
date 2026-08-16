import { CsvImportCard } from "./components/CsvImportCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Sliders } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Impostazioni</h2>
        <p className="text-muted-foreground mt-1">
          Gestisci le preferenze dell'applicazione e importa i tuoi dati finanziari.
        </p>
      </div>
      <CsvImportCard />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            Preferenze di Visualizzazione
          </CardTitle>
          <CardDescription>
            Personalizza il comportamento dell'interfaccia e dei dati monetari.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Valuta Principale</Label>
              <p className="text-sm text-muted-foreground">
                Seleziona la valuta predefinita per il calcolo del patrimonio.
              </p>
            </div>
            <Select defaultValue="eur">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleziona valuta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">Euro (€)</SelectItem>
                <SelectItem value="usd">Dollaro ($)</SelectItem>
                <SelectItem value="gbp">Sterlina (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Notifiche di Scadenza</Label>
              <p className="text-sm text-muted-foreground">
                Ricevi avvisi per le uscite ricorrenti in arrivo.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sicurezza e Account
          </CardTitle>
          <CardDescription>
            Gestisci la protezione dei tuoi dati finanziari.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sessione di Autenticazione</Label>
              <p className="text-sm text-muted-foreground">
                Il token JWT corrente è attivo e protetto tramite cookie sicuri.
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Connesso
            </span>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}