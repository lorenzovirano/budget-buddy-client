import { useState } from "react"
import { Link } from "react-router-dom"
import { useRegister } from "./api/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet } from "lucide-react"
import { AxiosError } from "axios"

export function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const registerMutation = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({ username, email, password })
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
            <CardTitle>Crea un account</CardTitle>
            <CardDescription>
              Inizia a tracciare le tue finanze in pochi secondi.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              
            {registerMutation.isError && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                {registerMutation.error instanceof AxiosError 
                ? registerMutation.error.response?.data?.message || "Errore sconosciuto dal server."
                : "Errore di connessione."}
            </div>
            )}

              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Mario Rossi" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="mario.rossi@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creazione in corso...
                  </>
                ) : (
                  "Registrati"
                )}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Hai già un account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Accedi
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}