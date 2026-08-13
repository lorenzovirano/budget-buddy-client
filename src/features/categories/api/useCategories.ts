import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface Type {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  type: string;
  user?: string;
}

export function useTypes() {
  return useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const res = await api.get<{ data: Type[] }>("/categories/types")
      return res.data.data
    }
  })
}

export function useCategories(typeId?: string) {
  return useQuery({
    queryKey: ["categories", typeId],
    queryFn: async () => {
      const res = await api.get<{ data: Category[] }>(`/categories/${typeId}`)
      return res.data.data
    },
    enabled: !!typeId 
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { name: string; typeId: string }) => {
      const res = await api.post("/categories/create", data)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories", variables.typeId] })
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name, typeId }: { id: string; name: string; typeId: string }) => {
      const res = await api.put(`/categories/${id}`, { name })
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories", variables.typeId] })
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, typeId }: { id: string; typeId: string }) => {
      const res = await api.delete(`/categories/${id}`)
      return res.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories", variables.typeId] })
    }
  })
}