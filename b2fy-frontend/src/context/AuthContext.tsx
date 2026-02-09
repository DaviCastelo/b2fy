import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getStoredToken, setStoredToken } from '../services/api'
import type { LoginResponse, TipoUsuario } from '../types/api'

interface AuthState {
  user: LoginResponse | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (cpfOuCnpj: string, senha: string) => Promise<LoginResponse>
  register: (data: import('../types/api').RegistroRequest) => Promise<LoginResponse>
  logout: () => void
  isEmpresa: boolean
  isFornecedor: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  const loadUser = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setState({ user: null, loading: false })
      return
    }
    try {
      const user = await api.get<import('../types/api').UsuarioResponse>('/usuarios/me')
      setState({
        user: {
          token,
          id: user.id,
          email: user.email,
          nome: user.nome,
          tipo: user.tipo,
          fotoPerfilUrl: user.fotoPerfilUrl ?? null,
          nichos: user.nichos ?? [],
        },
        loading: false,
      })
    } catch {
      setStoredToken(null)
      setState({ user: null, loading: false })
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (cpfOuCnpj: string, senha: string) => {
    const res = await api.post<LoginResponse>('/auth/login', { cpfOuCnpj, senha }, false)
    setStoredToken(res.token)
    setState({ user: res, loading: false })
    return res
  }, [])

  const register = useCallback(async (data: import('../types/api').RegistroRequest) => {
    const res = await api.post<LoginResponse>('/auth/registro', data, false)
    setStoredToken(res.token)
    setState({ user: res, loading: false })
    return res
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setState({ user: null, loading: false })
  }, [])

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    isEmpresa: state.user?.tipo === 'EMPRESA',
    isFornecedor: state.user?.tipo === 'FORNECEDOR',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
