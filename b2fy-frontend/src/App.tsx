import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { HomeEmpresa } from './pages/HomeEmpresa'
import { HomeFornecedor } from './pages/HomeFornecedor'
import { NovaLicitação } from './pages/NovaLicitação'
import { DetalheLicitação } from './pages/DetalheLicitação'
import { Perfil } from './pages/Perfil'
import { Configuracoes } from './pages/Configuracoes'
import { Conversas } from './pages/Conversas'

function ProtectedRoute({ children, requireEmpresa, requireFornecedor }: { children: React.ReactNode; requireEmpresa?: boolean; requireFornecedor?: boolean }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)] font-semibold">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (requireEmpresa && user.tipo !== 'EMPRESA') return <Navigate to="/" replace />
  if (requireFornecedor && user.tipo !== 'FORNECEDOR') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)] font-semibold">Carregando...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/registro" element={user ? <Navigate to="/" replace /> : <Registro />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={user?.tipo === 'EMPRESA' ? <HomeEmpresa /> : <HomeFornecedor />} />
        <Route path="agendar-licitacao" element={<ProtectedRoute requireEmpresa><NovaLicitação /></ProtectedRoute>} />
        <Route path="conversas" element={<Conversas />} />
        <Route path="licitacao/:id" element={<DetalheLicitação />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
