'use client'

import { useEffect } from 'react'

export function ThemeInjector() {
  useEffect(() => {
    fetch('/api/website-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.config?.theme) {
          const {
            primaryColor,
            primaryDarkColor,
            accentGoldColor,
            backgroundColor,
            creamColor,
            textColor,
            saleColor,
          } = data.config.theme

          const root = document.documentElement
          if (primaryColor) root.style.setProperty('--color-forest', primaryColor)
          if (primaryDarkColor) root.style.setProperty('--color-forest-dark', primaryDarkColor)
          if (accentGoldColor) root.style.setProperty('--color-gold', accentGoldColor)
          if (backgroundColor) root.style.setProperty('--color-warmwhite', backgroundColor)
          if (creamColor) root.style.setProperty('--color-cream', creamColor)
          if (textColor) root.style.setProperty('--color-charcoal', textColor)
          if (saleColor) root.style.setProperty('--color-sale', saleColor)
        }
      })
      .catch((err) => console.error('Failed to inject theme styles:', err))
  }, [])

  return null
}
