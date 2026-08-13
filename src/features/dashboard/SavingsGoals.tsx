import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target01Icon, PlusSignIcon } from "hugeicons-react"

const savingsGoals = [
  {
    id: "g1",
    title: "Master DTU Copenaghen",
    currentAmount: 4500,
    targetAmount: 10000,
    indicatorColor: "bg-blue-500",
  },
  {
    id: "g2",
    title: "Progetto Barca",
    currentAmount: 1200,
    targetAmount: 3500,
    indicatorColor: "bg-emerald-500",
  },
  {
    id: "g3",
    title: "Fondo di Emergenza",
    currentAmount: 5450,
    targetAmount: 5450,
    indicatorColor: "bg-zinc-800 dark:bg-zinc-200",
  },
  {
    id: "g4",
    title: "Fondo di Emergenza",
    currentAmount: 5450,
    targetAmount: 5450,
    indicatorColor: "bg-zinc-800 dark:bg-zinc-200",
  }
]

export function SavingsGoals() {
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
          <Button variant="outline" size="icon" className="h-8 w-8">
            <PlusSignIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-start gap-6">
        {savingsGoals.map((goal) => {
          const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
          const isCompleted = percentage >= 100

          return (
            <div key={goal.id} className="space-y-2">
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
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-6 w-6 rounded-full shrink-0"
                  disabled={isCompleted}
                >
                  <PlusSignIcon className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}