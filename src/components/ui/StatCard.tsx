interface StatCardProps {
	label: string
	value: string
	subValue?: string
	trend?: 'up' | 'down' | 'neutral'
	isLoading?: boolean
	accent?: 'blue' | 'green' | 'purple'
}

export function StatCard({
	label,
	value,
	subValue,
	trend = 'neutral',
	isLoading = false,
	accent,
}: StatCardProps) {
	const trendColor = {
		up: 'var(--accent-green)',
		down: 'var(--accent-red)',
		neutral: 'var(--text-tertiary)',
	}[trend]

	const accentGlow =
		{
			blue: '0 0 30px var(--accent-blue-glow)',
			green: '0 0 30px var(--accent-green-glow)',
			purple: '0 0 30px rgba(139, 92, 246, 0.15)',
		}[accent ?? ''] ?? 'none'

	if (isLoading) {
		return (
			<div
				style={{
					background: 'var(--gradient-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: '16px',
					padding: '20px',
				}}
			>
				<div
					style={{
						height: '12px',
						background: 'var(--bg-elevated)',
						borderRadius: '6px',
						width: '60%',
						marginBottom: '12px',
					}}
				/>
				<div
					style={{
						height: '28px',
						background: 'var(--bg-elevated)',
						borderRadius: '6px',
						width: '80%',
						marginBottom: '8px',
					}}
				/>
				<div
					style={{
						height: '10px',
						background: 'var(--bg-elevated)',
						borderRadius: '6px',
						width: '40%',
					}}
				/>
			</div>
		)
	}

	return (
		<div
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '16px',
				padding: '20px',
				boxShadow: accentGlow,
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--border-secondary)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			<p
				style={{
					fontSize: '12px',
					color: 'var(--text-tertiary)',
					marginBottom: '8px',
				}}
			>
				{label}
			</p>
			<p
				style={{
					fontSize: '24px',
					fontWeight: 600,
					color: 'var(--text-primary)',
					marginBottom: '4px',
					letterSpacing: '-0.5px',
				}}
				className='animate-count'
			>
				{value}
			</p>
			{subValue && (
				<p style={{ fontSize: '12px', color: trendColor, fontWeight: 500 }}>
					{subValue}
				</p>
			)}
		</div>
	)
}
