import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TransactionFAB } from "@/features/transactions/TransactionsFAB"

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground flex w-full">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col p-6 overflow-x-hidden">
          <header className="flex items-center gap-2 mb-6">
            <SidebarTrigger />
          </header>
          
          <Outlet /> 
          <TransactionFAB />
        </main>
      </div>
    </SidebarProvider>
  )
}