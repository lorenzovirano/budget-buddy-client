
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type Investment = {
  id: string
  bankName: string // <--- Aggiunto
  symbol: string
  type: 'crypto' | 'stock' | 'etf'
  quantity: number
  averageBuyPrice: number
  livePrice: number
  currentTotalValue: number
  profitLoss: number
  profitLossPercentage: number
}

export type PortfolioSummary = {
  totalValue: number
  totalInvested: number
  totalGlobalProfitLoss: number
  totalGlobalProfitLossPercentage: number
}

export type PortfolioResponse = {
  data: Investment[]
  summary: PortfolioSummary
}

export type AddInvestmentDTO = {
  bankId: string
  symbol: string
  type: 'crypto' | 'stock' | 'etf'
  quantity: number
  averageBuyPrice: number
  currency?: string
}

export function useGetPortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async (): Promise<PortfolioResponse> => {
      const response = await api.get('/investments')
      return response.data
    },
    refetchInterval: 5 * 60 * 1000, 
  })
}

export function useAddInvestment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddInvestmentDTO) => {
      const response = await api.post('/investments', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/investments/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}