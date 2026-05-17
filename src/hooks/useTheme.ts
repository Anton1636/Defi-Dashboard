'use client'

import { useCallback, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'dark'
		return (
			(document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
		)
	})

	const toggle = useCallback(() => {
		setTheme(prev => {
			const next: Theme = prev === 'dark' ? 'light' : 'dark'
			localStorage.setItem('defi-theme', next)
			document.documentElement.setAttribute('data-theme', next)
			return next
		})
	}, [])

	return { theme, toggle, isDark: theme === 'dark' }
}
