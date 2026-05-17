'use client'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
	const { isDark, toggle } = useTheme()

	return (
		<button
			onClick={toggle}
			title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			aria-label='Toggle theme'
			style={{
				width: 36,
				height: 36,
				borderRadius: 10,
				background: 'var(--bg-elevated)',
				border: '1px solid var(--border-primary)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				transition: 'all 0.2s',
				flexShrink: 0,
				fontSize: 16,
				lineHeight: 1,
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--border-secondary)'
				e.currentTarget.style.background = 'var(--bg-card-hover)'
				e.currentTarget.style.transform = 'scale(1.08) rotate(15deg)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
				e.currentTarget.style.background = 'var(--bg-elevated)'
				e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
			}}
		>
			{isDark ? '☀️' : '🌙'}
		</button>
	)
}
