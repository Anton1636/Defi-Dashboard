'use client'

import { usePWA } from '@/hooks/usePWA'

export function OfflineBanner() {
	const { isOnline } = usePWA()
	if (isOnline) return null

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 1000,
				background: 'rgba(251,191,36,.95)',
				padding: '8px 16px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
				fontSize: 12,
				fontWeight: 700,
				color: '#000',
			}}
		>
			⚡ You are offline — showing cached data
		</div>
	)
}
