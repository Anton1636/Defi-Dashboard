interface ReputationScoreProps {
	score: number
	tierColor: string
	size?: number
}

export function ReputationScore({
	score,
	tierColor,
	size = 96,
}: ReputationScoreProps) {
	const radius = (size - 12) / 2
	const circumference = 2 * Math.PI * radius
	const progress = (score / 100) * circumference
	const gap = circumference - progress

	return (
		<div
			style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				style={{ transform: 'rotate(-90deg)' }}
			>
				{/* Track */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke='var(--bg-elevated)'
					strokeWidth={8}
				/>
				{/* Progress */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='none'
					stroke={tierColor}
					strokeWidth={8}
					strokeLinecap='round'
					strokeDasharray={`${progress} ${gap}`}
					style={{
						filter: `drop-shadow(0 0 6px ${tierColor}88)`,
						transition: 'stroke-dasharray 0.8s ease',
					}}
				/>
			</svg>
			{/* Score text */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span
					style={{
						fontSize: size * 0.28,
						fontWeight: 800,
						color: tierColor,
						lineHeight: 1,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{score}
				</span>
				<span
					style={{
						fontSize: size * 0.12,
						color: 'var(--text-tertiary)',
						fontWeight: 500,
					}}
				>
					/100
				</span>
			</div>
		</div>
	)
}
