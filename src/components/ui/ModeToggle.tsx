'use client'

import { useMode } from '@/hooks/useMode'

export function ModeToggle() {
	const { mode, setMode } = useMode()

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				background: 'var(--bg-elevated)',
				border: '1px solid var(--border-primary)',
				borderRadius: 10,
				padding: 3,
				gap: 2,
			}}
		>
			{(['pro', 'simple'] as const).map(m => {
				const isActive = mode === m
				return (
					<button
						key={m}
						onClick={() => setMode(m)}
						style={{
							padding: '5px 12px',
							borderRadius: 7,
							fontSize: 12,
							fontWeight: isActive ? 600 : 400,
							color: isActive
								? m === 'pro'
									? 'var(--accent-blue)'
									: 'var(--accent-green)'
								: 'var(--text-tertiary)',
							background: isActive ? 'var(--bg-card)' : 'transparent',
							border: isActive
								? `1px solid ${m === 'pro' ? 'var(--border-accent)' : 'rgba(16,185,129,0.3)'}`
								: '1px solid transparent',
							cursor: 'pointer',
							transition: 'all 0.15s',
							boxShadow: isActive
								? m === 'pro'
									? '0 0 12px var(--accent-blue-glow)'
									: '0 0 12px var(--accent-green-glow)'
								: 'none',
						}}
					>
						{m === 'pro' ? 'PRO' : 'SIMPLE'}
					</button>
				)
			})}
		</div>
	)
}
