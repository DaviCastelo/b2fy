import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

const STORAGE_KEYS = {
  theme: 'b2fy_theme',
  fontSize: 'b2fy_font_size',
} as const

interface SettingsState {
  theme: Theme
  fontSize: FontSize
}

interface SettingsContextValue extends SettingsState {
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const fontSizes: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null
    return stored === 'dark' || stored === 'light' ? stored : 'light'
  })
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.fontSize) as FontSize | null
    return stored && ['small', 'medium', 'large'].includes(stored) ? stored : 'medium'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = fontSizes[fontSize]
  }, [fontSize])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEYS.theme, t)
  }, [])

  const setFontSize = useCallback((s: FontSize) => {
    setFontSizeState(s)
    localStorage.setItem(STORAGE_KEYS.fontSize, s)
  }, [])

  const value: SettingsContextValue = {
    theme,
    fontSize,
    setTheme,
    setFontSize,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
