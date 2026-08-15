import { Home01Icon, CreditCardIcon, Settings01Icon, Tag01Icon, BankIcon, Refresh03Icon } from "hugeicons-react"
import { LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar // <-- 1. Importa l'hook
} from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home01Icon },
  { title: "Transazioni", url: "/transactions", icon: CreditCardIcon },
  { title: "Categorie", url: "/categories", icon: Tag01Icon },
  { title: "Banche", url: "/banks", icon: BankIcon },
  { title: "Uscite ricorrenti", url: "/recurring", icon: Refresh03Icon },
  { title: "Impostazioni", url: "/settings", icon: Settings01Icon },
]

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  // 2. Estrai isMobile e setOpenMobile per gestire la chiusura
  const { setOpenMobile, isMobile } = useSidebar()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Funzione per chiudere la sidebar solo se siamo su schermo mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const initials = user?.username 
    ? user.username.substring(0, 2).toUpperCase() 
    : "BB"

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-foreground mb-2">
            Budget Buddy
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user?.username || "Utente"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || "Nessuna email"}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Esci
          </Button>
          
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}