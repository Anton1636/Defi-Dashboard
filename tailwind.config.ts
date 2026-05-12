import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'bg-primary': 'var(--bg-primary)',
				'bg-secondary': 'var(--bg-secondary)',
				'bg-card': 'var(--bg-card)',
				'bg-elevated': 'var(--bg-elevated)',
				'text-primary': 'var(--text-primary)',
				'text-secondary': 'var(--text-secondary)',
				'text-tertiary': 'var(--text-tertiary)',
				'accent-blue': 'var(--accent-blue)',
				'accent-green': 'var(--accent-green)',
				'accent-purple': 'var(--accent-purple)',
				'accent-red': 'var(--accent-red)',
				'accent-amber': 'var(--accent-amber)',
				'border-primary': 'var(--border-primary)',
				'border-secondary': 'var(--border-secondary)',
			},
			borderRadius: {
				xl: '12px',
				'2xl': '16px',
				'3xl': '20px',
			},
			fontFamily: {
				sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'monospace'],
			},
		},
	},
	plugins: [],
}

export default config
