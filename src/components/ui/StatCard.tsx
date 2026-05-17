import { Sparkline } from '@/components/ui/Sparkline'

interface StatCardProps {
	label: string
	value: string
	subValue?: string
	trend?: 'up' | 'down' | 'neutral'
	isLoading?: boolean
	accent?: 'blue' | 'green' | 'purple'
	size?: 'default' | 'hero'
	tooltip?: string
	sparkData?: number[]
}

export function StatCard({
	label,
	value,
	subValue,
	trend = 'neutral',
	isLoading = false,
	accent,
	size = 'default',
	tooltip,
	sparkData,
}: StatCardProps) {
	const ACCENT_GLOWS: Record<string, string> = {
		blue: 'var(--shadow-glow-blue)',
		green: '0 0 40px var(--accent-green-glow)',
		purple: '0 0 40px rgba(139, 92, 246, 0.15)',
	}

	const accentGlow = accent ? (ACCENT_GLOWS[accent] ?? 'none') : 'none'

	if (isLoading) {
		return (
			<div className='card' style={{ padding: size === 'hero' ? 28 : 20 }}>
				<div
					className='skeleton'
					style={{ height: 12, width: '55%', marginBottom: 12 }}
				/>
				<div
					className='skeleton'
					style={{
						height: size === 'hero' ? 44 : 28,
						width: '75%',
						marginBottom: 10,
					}}
				/>
				<div className='skeleton' style={{ height: 10, width: '35%' }} />
			</div>
		)
	}

	return (
		<div
			className='card card-lift'
			style={{
				padding: size === 'hero' ? 28 : 20,
				boxShadow: accent
					? `var(--shadow-card), ${accentGlow}`
					: 'var(--shadow-card)',
				position: 'relative',
				overflow: 'hidden',
			}}
			title={tooltip}
		>
			{/* Accent top line */}
			{size === 'hero' && accent && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background:
							accent === 'blue'
								? 'var(--gradient-blue)'
								: 'var(--gradient-green)',
						borderRadius: '16px 16px 0 0',
					}}
				/>
			)}

			{/* Label row — with optional sparkline on the right */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: 8,
				}}
			>
				<p
					style={{
						fontSize: 'var(--text-2xs)',
						color: 'var(--text-tertiary)',
						fontWeight: 500,
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
					}}
				>
					{label}
				</p>

				{sparkData && sparkData.length >= 2 && (
					<Sparkline data={sparkData} width={72} height={28} filled />
				)}
			</div>

			{/* Value */}
			<p
				className='animate-count'
				style={{
					fontSize: size === 'hero' ? 'var(--text-hero)' : 'var(--text-xl)',
					fontWeight: 700,
					color: 'var(--text-primary)',
					letterSpacing: '-1.5px',
					lineHeight: 1,
					marginBottom: 10,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{value}
			</p>

			{/* Sub value */}
			{subValue && (
				<span
					className={
						trend === 'up'
							? 'trend-up-bg'
							: trend === 'down'
								? 'trend-down-bg'
								: ''
					}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 4,
						fontSize: 'var(--text-xs)',
						fontWeight: 600,
						padding: '3px 8px',
						borderRadius: 20,
						color: trend === 'neutral' ? 'var(--text-tertiary)' : undefined,
					}}
				>
					{trend === 'up' && '↑'}
					{trend === 'down' && '↓'}
					{subValue}
				</span>
			)}
		</div>
	)
}
