'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Locale } from './translations'

type TranslationKeys = typeof translations.en

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lena_locale') as Locale
      if (saved && (saved === 'en' || saved === 'bm')) {
        setLocaleState(saved)
      }
    } catch {
      // Ignore storage access error
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('lena_locale', newLocale)
    } catch {
      // Ignore
    }
  }

  const t = translations[locale] || translations.en

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback for SSR or non-provider contexts
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: translations.en,
    }
  }
  return context
}
