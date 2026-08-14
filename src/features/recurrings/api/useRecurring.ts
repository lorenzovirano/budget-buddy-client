import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface RecurringPayment {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
  active: boolean;
}

export function useRecurring() {
  return useQuery({
    queryKey: ['recurring'],
    queryFn: async () => {
      const response = await api.get('/recurring/show');
      return response.data.data as RecurringPayment[];
    },
  });
}