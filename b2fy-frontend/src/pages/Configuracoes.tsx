import React from 'react'
import { Card, CardTitle, CardContent } from '../components/ui/Card'
import { useSettings } from '../context/SettingsContext'

export function Configuracoes() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings()

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Configurações</h1>
      <Card className="max-w-md shadow-[var(--shadow)] mb-4">
        <CardTitle>Tema</CardTitle>
        <CardContent>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
              <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} className="accent-[var(--color-primary)]" />
              Claro
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
              <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="accent-[var(--color-primary)]" />
              Escuro
            </label>
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-md mt-4 shadow-[var(--shadow)]">
        <CardTitle>Tamanho da fonte</CardTitle>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
              <input type="radio" name="fontSize" checked={fontSize === 'small'} onChange={() => setFontSize('small')} className="accent-[var(--color-primary)]" />
              Pequeno
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
              <input type="radio" name="fontSize" checked={fontSize === 'medium'} onChange={() => setFontSize('medium')} className="accent-[var(--color-primary)]" />
              Médio
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
              <input type="radio" name="fontSize" checked={fontSize === 'large'} onChange={() => setFontSize('large')} className="accent-[var(--color-primary)]" />
              Grande
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
