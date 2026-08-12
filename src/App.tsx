import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { MainLayout } from "./components/main-layout"
import { Dashboard } from "./features/dashboard/Dashboard"
import { Transactions } from "./features/transactions/Transactions"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="budget-buddy-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}