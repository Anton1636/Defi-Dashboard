'use client'

import { useAlerts } from '@/hooks/useAlerts'

export function AlertBadge() {
	const { unreadCount } = useAlerts()

	if (unreadCount === 0) return null

	return (
		<div
			style={{
				minWidth: 16,
				height: 16,
				borderRadius: 8,
				background: '#f87171',
				boxShadow: '0 0 8px rgba(248,113,113,.5)',
				fontSize: 9,
				fontWeight: 900,
				color: '#fff',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 4px',
				animation: 'pulse 2s infinite',
			}}
		>
			{unreadCount > 9 ? '9+' : unreadCount}
		</div>
	)
}
