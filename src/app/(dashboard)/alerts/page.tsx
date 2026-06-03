'use client'

import { useAlerts } from '@/hooks/useAlerts'
import { AlertItem } from '@/components/alerts/AlertItem'
import { useState } from 'react'

const SEVERITY_FILTERS = [
	'All',
	'Critical',
	'Warning',
	'Info',
	'Success',
] as const
type SeverityFilter = (typeof SEVERITY_FILTERS)[number]

export default function AlertsPage() {
	const { alerts, unreadCount, markRead, markAllRead, refresh, lastUpdated } =
		useAlerts()
	const [filter, setFilter] = useState<SeverityFilter>('All')

	const filtered =
		filter === 'All'
			? alerts
			: alerts.filter(a => a.severity === filter.toLowerCase())

	const counts = {
		Critical: alerts.filter(a => a.severity === 'critical').length,
		Warning: alerts.filter(a => a.severity === 'warning').length,
		Info: alerts.filter(a => a.severity === 'info').length,
		Success: alerts.filter(a => a.severity === 'success').length,
	}

	const FILTER_COLORS: Record<string, string> = {
		Critical: '#f87171',
		Warning: '#fbbf24',
		Info: '#00d1ff',
		Success: '#4ade80',
	}

	return (
		<div className='layout-analytics fade-in'>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 22,
					flexWrap: 'wrap',
					gap: 12,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 22,
							fontWeight: 900,
							color: 'var(--text-primary)',
							letterSpacing: '-.8px',
							marginBottom: 3,
						}}
					>
						🔔 Alerts
					</h1>
					<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
						{unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}{' '}
						· Auto-refreshes every 30s
					</p>
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					{lastUpdated && (
						<span
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								display: 'flex',
								alignItems: 'center',
							}}
						>
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
							padding: '8px 16px',
							borderRadius: 'var(--card-radius-sm)',
							fontSize: 12,
							fontWeight: 700,
							background: 'var(--surface-2)',
							border: '1px solid var(--border-1)',
							color: 'var(--text-secondary)',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: 6,
						}}
					>
						↻ Refresh
					</button>
					{unreadCount > 0 && (
						<button
							onClick={markAllRead}
							style={{
								padding: '8px 16px',
								borderRadius: 'var(--card-radius-sm)',
								fontSize: 12,
								fontWeight: 700,
								background: 'rgba(0,209,255,.08)',
								border: '1px solid rgba(0,209,255,.2)',
								color: 'var(--accent-blue)',
								cursor: 'pointer',
							}}
						>
							✓ Mark all read
						</button>
					)}
				</div>
			</div>

			{/* Stats row */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
					gap: 10,
					marginBottom: 20,
				}}
			>
				{[
					{
						label: 'Total',
						value: alerts.length,
						color: 'var(--text-primary)',
					},
					{ label: 'Critical', value: counts.Critical, color: '#f87171' },
					{ label: 'Warning', value: counts.Warning, color: '#fbbf24' },
					{ label: 'Info', value: counts.Info, color: '#00d1ff' },
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'var(--card-bg)',
							border: '1px solid var(--card-border)',
							borderRadius: 'var(--card-radius-sm)',
							padding: '12px 14px',
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '.1em',
								marginBottom: 5,
							}}
						>
							{s.label}
						</p>
						<p style={{ fontSize: 24, fontWeight: 900, color: s.color }}>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div
				style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}
			>
				{SEVERITY_FILTERS.map(f => {
					const isActive = filter === f
					const col = f === 'All' ? 'var(--accent-blue)' : FILTER_COLORS[f]
					return (
						<button
							key={f}
							onClick={() => setFilter(f)}
							style={{
								padding: '5px 14px',
								borderRadius: 20,
								fontSize: 12,
								fontWeight: isActive ? 700 : 400,
								background: isActive ? `${col}18` : 'var(--surface-1)',
								border: `1px solid ${isActive ? `${col}40` : 'var(--border-1)'}`,
								color: isActive ? col : 'var(--text-secondary)',
								cursor: 'pointer',
								transition: 'all .15s',
								display: 'flex',
								alignItems: 'center',
								gap: 5,
							}}
						>
							{f}
							{f !== 'All' && counts[f as keyof typeof counts] > 0 && (
								<span
									style={{
										fontSize: 9,
										fontWeight: 800,
										padding: '1px 5px',
										borderRadius: 8,
										background: isActive ? `${col}25` : 'var(--surface-3)',
										color: isActive ? col : 'var(--text-tertiary)',
									}}
								>
									{counts[f as keyof typeof counts]}
								</span>
							)}
						</button>
					)
				})}
			</div>

			{/* Alert list */}
			{filtered.length === 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '60px 0',
						color: 'var(--text-tertiary)',
					}}
				>
					<p style={{ fontSize: 40, marginBottom: 12 }}>🔔</p>
					<p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
						No {filter !== 'All' ? filter.toLowerCase() : ''} alerts
					</p>
					<p style={{ fontSize: 12 }}>All systems operational</p>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					{filtered.map(alert => (
						<AlertItem key={alert.id} alert={alert} onRead={markRead} />
					))}
				</div>
			)}
		</div>
	)
}
