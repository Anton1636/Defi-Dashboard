'use client'

import { useAlerts } from '@/hooks/useAlerts'
import { AlertItem } from './AlertItem'

interface AlertFeedProps {
	maxItems?: number
	compact?: boolean
}

export function AlertFeed({ maxItems, compact = false }: AlertFeedProps) {
	const { alerts, markRead, markAllRead, unreadCount, lastUpdated, refresh } =
		useAlerts()

	const visible = maxItems ? alerts.slice(0, maxItems) : alerts

	return (
		<div>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 14,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<p
						style={{
							fontSize: 14,
							fontWeight: 800,
							color: 'var(--text-primary)',
						}}
					>
						Alerts
					</p>
					{unreadCount > 0 && (
						<span
							style={{
								padding: '2px 8px',
								borderRadius: 20,
								fontSize: 10,
								fontWeight: 800,
								background: 'rgba(248,113,113,.12)',
								border: '1px solid rgba(248,113,113,.25)',
								color: '#f87171',
							}}
						>
							{unreadCount} new
						</span>
					)}
				</div>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					{lastUpdated && (
						<span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
							Updated{' '}
							{lastUpdated.toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					)}
					<button
						onClick={refresh}
						style={{
							fontSize: 13,
							background: 'transparent',
							border: 'none',
							color: 'var(--text-tertiary)',
							cursor: 'pointer',
							padding: 4,
							borderRadius: 6,
							transition: 'color .15s',
						}}
						title='Refresh'
						onMouseEnter={e => {
							e.currentTarget.style.color = 'var(--accent-blue)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.color = 'var(--text-tertiary)'
						}}
					>
						↻
					</button>
					{unreadCount > 0 && (
						<button
							onClick={markAllRead}
							style={{
								fontSize: 10,
								fontWeight: 700,
								color: 'var(--accent-blue)',
								background: 'transparent',
								border: 'none',
								cursor: 'pointer',
							}}
						>
							Mark all read
						</button>
					)}
				</div>
			</div>

			{/* Alert list */}
			{visible.length === 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '40px 0',
						color: 'var(--text-tertiary)',
					}}
				>
					<p style={{ fontSize: 28, marginBottom: 8 }}>🔔</p>
					<p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
						All clear
					</p>
					<p style={{ fontSize: 12 }}>No alerts at the moment</p>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
					{visible.map(alert => (
						<AlertItem
							key={alert.id}
							alert={alert}
							onRead={markRead}
							compact={compact}
						/>
					))}
				</div>
			)}
		</div>
	)
}
