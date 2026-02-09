import React from 'react'
import { Card, CardTitle, CardContent } from '../components/ui/Card'

export function Conversas() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Conversas</h1>
      <Card className="max-w-2xl shadow-[var(--shadow)] p-8 text-center">
        <CardTitle className="text-xl">Em breve</CardTitle>
        <CardContent>
          <p className="text-[var(--color-text-muted)] mt-2">O menu de conversas estará disponível em uma próxima atualização.</p>
        </CardContent>
      </Card>
    </div>
  )
}
