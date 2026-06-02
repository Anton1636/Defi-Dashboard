import type { CompoundPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function CompoundCard({ position }: { position: CompoundPosition }) {
	const utilizationRate =
		position.supplied > 0 ? (position.borrowed / position.supplied) * 100 : 0

	return (
		<div
			style={{
				background: 'rgba(255,255,255,0.02)',
				border: '1px solid rgba(255,255,255,0.07)',
				borderRadius: 16,
				padding: 20,
				position: 'relative',
				overflow: 'hidden',
				transition: 'all 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(0,211,149,0.25)'
				e.currentTarget.style.transform = 'translateY(-2px)'
				e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.5)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
				e.currentTarget.style.transform = 'translateY(0)'
				e.currentTarget.style.boxShadow = 'none'
			}}
		>
			{/* Top line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,#00d395,rgba(0,211,149,0.1),transparent)',
				}}
			/>

			{/* Decorative orb */}
			<div
				style={{
					position: 'absolute',
					bottom: -30,
					right: -30,
					width: 140,
					height: 140,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(0,211,149,0.06) 0%,transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
					position: 'relative',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: '50%',
							background: 'rgba(0,211,149,0.12)',
							border: '1px solid rgba(0,211,149,0.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 22,
						}}
					>
						🏦
					</div>
					<div>
						<p
							style={{
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
								letterSpacing: '-0.3px',
							}}
						>
							COMPOUND V3 - {position.market}
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: 12,
						fontWeight: 700,
						padding: '4px 10px',
						borderRadius: 20,
						background: 'rgba(0,211,149,0.1)',
						color: 'var(--compound)',
						border: '1px solid rgba(0,211,149,0.2)',
					}}
				>
					{position.supplyAPR.toFixed(2)}% APR
				</span>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 8,
					marginBottom: 12,
					position: 'relative',
				}}
			>
				{[
					{
						label: 'Net Value',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Supplied',
						value: formatUSD(position.supplied),
						color: 'var(--compound)',
					},
					{
						label: 'Borrowed',
						value: position.borrowed > 0 ? formatUSD(position.borrowed) : '—',
						color: 'var(--text-secondary)',
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'rgba(255,255,255,0.04)',
							borderRadius: 10,
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 5,
								fontWeight: 600,
							}}
						>
							{s.label}
						</p>
						<p style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
							{s.value}
						</p>
					</div>
				))}
			</div>

			{/* APR comparison */}
			<div style={{ display: 'flex', gap: 8, position: 'relative' }}>
				<div
					style={{
						flex: 1,
						background: 'rgba(0,211,149,0.06)',
						border: '1px solid rgba(0,211,149,0.12)',
						borderRadius: 10,
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginBottom: 5,
							fontWeight: 600,
						}}
					>
						Supply APR
					</p>
					<p
						style={{ fontSize: 18, fontWeight: 800, color: 'var(--compound)' }}
					>
						{position.supplyAPR.toFixed(2)}%
					</p>
				</div>
				<div
					style={{
						flex: 1,
						background: 'rgba(255,255,255,0.03)',
						borderRadius: 10,
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginBottom: 5,
							fontWeight: 600,
						}}
					>
						Borrow APR
					</p>
					<p
						style={{
							fontSize: 18,
							fontWeight: 800,
							color: 'var(--text-secondary)',
						}}
					>
						{position.borrowAPR.toFixed(2)}%
					</p>
				</div>
				{utilizationRate > 0 && (
					<div
						style={{
							flex: 1,
							background: 'rgba(255,255,255,0.03)',
							borderRadius: 10,
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 5,
								fontWeight: 600,
							}}
						>
							Utilization
						</p>
						<p
							style={{
								fontSize: 18,
								fontWeight: 800,
								color: 'var(--accent-blue)',
							}}
						>
							{utilizationRate.toFixed(1)}%
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
