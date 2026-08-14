import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Bank {
  _id: string;
  bankName: string;
  accountType: 'OPERATIVE' | 'INVESTMENT';
  identifier?: string;
}

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const response = await api.get('/bank/show');
      return response.data.data as Bank[];
    },
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Bank, '_id'>) => {
      const response = await api.post('/bank/create', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      toast.success("Conto aggiunto con successo!");
    },
  });
}

export function useDeleteBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/bank/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      toast.success("Conto rimosso.");
    },
  });
}