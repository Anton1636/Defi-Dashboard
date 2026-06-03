import type { Alert } from '@/lib/alertEngine'
import { useRouter } from 'next/navigation'

const SEVERITY_CFG = {
	critical: {
		color: '#f87171',
		bg: 'rgba(248,113,113,.08)',
		border: 'rgba(248,113,113,.2)',
		icon: '🚨',
		dot: '#f87171',
	},
	warning: {
		color: '#fbbf24',
		bg: 'rgba(251,191,36,.06)',
		border: 'rgba(251,191,36,.18)',
		icon: '⚠️',
		dot: '#fbbf24',
	},
	info: {
		color: '#00d1ff',
		bg: 'rgba(0,209,255,.06)',
		border: 'rgba(0,209,255,.15)',
		icon: 'ℹ️',
		dot: '#00d1ff',
	},
	success: {
		color: '#4ade80',
		bg: 'rgba(74,222,128,.06)',
		border: 'rgba(74,222,128,.18)',
		icon: '✅',
		dot: '#4ade80',
	},
}

const TYPE_ICONS: Record<string, string> = {
	liquidation: '🚨',
	out_of_range: '🎯',
	gas_low: '⛽',
	price_change: '📈',
	hf_warning: '⚠️',
	fees_earned: '💰',
}

function timeAgo(date: Date) {
	const diff = Date.now() - date.getTime()
	const m = Math.floor(diff / 60_000)
	if (m < 1) return 'Just now'
	if (m < 60) return `${m}m ago`
	const h = Math.floor(m / 60)
	if (h < 24) return `${h}h ago`
	return `${Math.floor(h / 24)}d ago`
}

interface AlertItemProps {
	alert: Alert
	onRead: (id: string) => void
	compact?: boolean
}

export function AlertItem({ alert, onRead, compact = false }: AlertItemProps) {
	const router = useRouter()
	const cfg = SEVERITY_CFG[alert.severity]

	const handleAction = () => {
		onRead(alert.id)
		if (alert.actionHref) router.push(alert.actionHref)
	}

	return (
		<div
			onClick={() => onRead(alert.id)}
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: 12,
				padding: compact ? '10px 14px' : '13px 16px',
				background: alert.read ? 'var(--card-bg)' : cfg.bg,
				border: `1px solid ${alert.read ? 'var(--card-border)' : cfg.border}`,
				borderRadius: 'var(--card-radius-sm)',
				cursor: 'pointer',
				transition: 'all .15s',
				opacity: alert.read ? 0.6 : 1,
				position: 'relative',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.opacity = '1'
				e.currentTarget.style.transform = 'translateX(2px)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.opacity = alert.read ? '0.6' : '1'
				e.currentTarget.style.transform = 'translateX(0)'
			}}
		>
			{/* Unread dot */}
			{!alert.read && (
				<div
					style={{
						position: 'absolute',
						top: 10,
						right: 12,
						width: 6,
						height: 6,
						borderRadius: '50%',
						background: cfg.dot,
						boxShadow: `0 0 6px ${cfg.dot}`,
					}}
				/>
			)}

			{/* Icon */}
			<div
				style={{
					width: 36,
					height: 36,
					borderRadius: 10,
					flexShrink: 0,
					background: `${cfg.color}18`,
					border: `1px solid ${cfg.color}30`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 17,
				}}
			>
				{TYPE_ICONS[alert.type] ?? cfg.icon}
			</div>

			{/* Content */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 3,
					}}
				>
					<p
						style={{
							fontSize: 13,
							fontWeight: 700,
							color: alert.read ? 'var(--text-secondary)' : '#fff',
						}}
					>
						{alert.title}
					</p>
					<span
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							flexShrink: 0,
							marginLeft: 8,
						}}
					>
						{timeAgo(alert.timestamp)}
					</span>
				</div>

				<p
					style={{
						fontSize: 11,
						color: 'var(--text-tertiary)',
						lineHeight: 1.5,
						marginBottom: alert.actionLabel ? 8 : 0,
					}}
				>
					{alert.description}
				</p>

				{alert.actionLabel && !compact && (
					<button
						onClick={e => {
							e.stopPropagation()
							handleAction()
						}}
						style={{
							padding: '4px 12px',
							borderRadius: 20,
							fontSize: 10,
							fontWeight: 700,
							background: `${cfg.color}15`,
							border: `1px solid ${cfg.color}30`,
							color: cfg.color,
							cursor: 'pointer',
							transition: 'all .15s',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.background = `${cfg.color}25`
						}}
						onMouseLeave={e => {
							e.currentTarget.style.background = `${cfg.color}15`
						}}
					>
						{alert.actionLabel} →
					</button>
				)}
			</div>

			{/* Value badge */}
			{alert.value && (
				<div
					style={{
						flexShrink: 0,
						padding: '3px 9px',
						borderRadius: 20,
						background: `${cfg.color}12`,
						border: `1px solid ${cfg.color}25`,
						fontSize: 10,
						fontWeight: 800,
						color: cfg.color,
					}}
				>
					{alert.value}
				</div>
			)}
		</div>
	)
}
