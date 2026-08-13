import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Goal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  indicatorColor: string;
}

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/goals/show');
      return response.data.data as Goal[];
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; targetAmount: number; indicatorColor: string }) => {
      const response = await api.post('/goals/create', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useAddFundsGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const response = await api.put(`/goals/${id}/add-funds`, { amount });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}