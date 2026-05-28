import { Sparkline, generateSparkData } from '@/components/ui/Sparkline'

interface StatCardProps {
	label: string
	value: string
	subValue?: string
	trend?: 'up' | 'down' | 'neutral'
	accent?: 'green' | 'blue' | 'red'
	isLoading?: boolean
	sparkline?: boolean
}

const ACCENT_MAP = {
	green: 'var(--accent-green)',
	blue: 'var(--accent-blue)',
	red: 'var(--accent-red)',
}

export function StatCard({
	label,
	value,
	subValue,
	trend,
	accent,
	isLoading,
	sparkline,
}: StatCardProps) {
	if (isLoading) {
		return (
			<div
				style={{
					background: 'var(--bg-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: 12,
					padding: '14px 16px',
				}}
			>
				<div
					className='skeleton'
					style={{ height: 10, width: 80, marginBottom: 10 }}
				/>
				<div className='skeleton' style={{ height: 28, width: 100 }} />
			</div>
		)
	}

	const accentColor = accent ? ACCENT_MAP[accent] : 'var(--text-primary)'
	const sparkData = sparkline ? generateSparkData(label, 7) : null

	return (
		<div
			style={{
				background: 'var(--bg-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: 12,
				padding: '14px 16px',
				transition: 'border-color 0.2s',
				cursor: 'default',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--border-secondary)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
				}}
			>
				<div style={{ flex: 1 }}>
					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							fontWeight: 700,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							marginBottom: 8,
						}}
					>
						{label}
					</p>
					<p
						style={{
							fontSize: 26,
							fontWeight: 800,
							color: accentColor,
							letterSpacing: '-0.5px',
							lineHeight: 1,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{value}
					</p>
					{subValue && (
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								marginTop: 4,
								fontWeight: 500,
							}}
						>
							{subValue}
						</p>
					)}
				</div>
				{sparkData && (
					<Sparkline
						data={sparkData}
						color={
							trend === 'up'
								? 'var(--accent-green)'
								: trend === 'down'
									? 'var(--accent-red)'
									: 'var(--accent-blue)'
						}
						width={64}
						height={28}
					/>
				)}
			</div>
		</div>
	)
}
