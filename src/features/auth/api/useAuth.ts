import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

type LoginDTO = { username: string; password: string }
type RegisterDTO = LoginDTO & { email: string }

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: LoginDTO) => {
      const response = await api.post('/users/login', credentials)
      return response.data
    },
    onSuccess: (res) => {
      setAuth(res.data, res.token)
      navigate('/')
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: RegisterDTO) => {
      const response = await api.post('/users/register', data)
      return response.data
    },
    onSuccess: (res) => {
      setAuth(res.data, res.token)
      navigate('/')
    },
  })
}