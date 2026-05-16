interface TrendBadgeProps {
	value: number
	suffix?: string // '24h', '7d', etc
	size?: 'sm' | 'md'
}

export function TrendBadge({ value, suffix, size = 'sm' }: TrendBadgeProps) {
	const isPositive = value > 0
	const isNegative = value < 0
	const fontSize = size === 'sm' ? '11px' : '13px'

	return (
		<span
			className={isPositive ? 'trend-up-bg' : isNegative ? 'trend-down-bg' : ''}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 3,
				fontSize,
				fontWeight: 600,
				padding: size === 'sm' ? '2px 7px' : '4px 10px',
				borderRadius: 20,
				color: !isPositive && !isNegative ? 'var(--text-tertiary)' : undefined,
			}}
		>
			{isPositive ? '↑' : isNegative ? '↓' : '→'}
			{Math.abs(value).toFixed(2)}%
			{suffix && (
				<span style={{ opacity: 0.7, fontWeight: 400 }}>{suffix}</span>
			)}
		</span>
	)
}
