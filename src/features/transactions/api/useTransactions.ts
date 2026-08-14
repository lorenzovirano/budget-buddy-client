import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  account: any;
  toAccount?: any;
  category?: any;
  description?: string;
  amount: number;
  date: string;
  user: string;
}

export interface CreateTransactionPayload {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  account: string;
  toAccount?: string;
  category?: string;
  description?: string;
  date?: string;
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transaction/show');
      return response.data.data as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTransactionPayload) => {
      const response = await api.post('/transaction/create', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/transaction/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
}