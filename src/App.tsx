import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { MainLayout } from "./components/main-layout"
import { Dashboard } from "./features/dashboard/Dashboard"
import { Transactions } from "./features/transactions/Transactions"

// Importiamo i nuovi componenti auth
import { Login } from "./features/auth/Login"
import { Register } from "./features/auth/Register"
import { ProtectedRoute } from "./features/auth/ProtectedRoute"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-buddy-theme">
      <BrowserRouter>
        <Routes>
          
          {/* ROTTE PUBBLICHE (Accessibili senza token) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ROTTE PROTETTE (Richiedono il token) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
            
          </Route>
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}