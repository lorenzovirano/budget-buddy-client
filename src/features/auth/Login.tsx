import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useLogin } from "./api/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet, AlertCircle } from "lucide-react"
import { AxiosError } from "axios"

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [sessionExpired, setSessionExpired] = useState(false)
  
  const [searchParams] = useSearchParams()
  const loginMutation = useLogin()

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSessionExpired(false) 
    loginMutation.mutate({ username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
    
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-primary/10 rounded-full">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Buddy</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bentornato</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere alla dashboard.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              
              {sessionExpired && (
                <div className="p-3 flex items-start gap-3 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>La tua sessione è scaduta per inattività. Effettua nuovamente l'accesso per continuare.</p>
                </div>
              )}

              {/* BANNER ERRORE DI LOGIN */}
              {loginMutation.isError && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                    {loginMutation.error instanceof AxiosError 
                    ? loginMutation.error.response?.data?.message || "Errore sconosciuto dal server."
                    : "Errore di connessione."}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="mariorossi01" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Password dimenticata?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 mt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
                  </>
                ) : (
                  "Accedi"
                )}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Non hai un account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Registrati
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}