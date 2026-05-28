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
				background: 'var(--bg-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: 14,
				padding: 18,
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(0,211,149,0.3)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 14,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<div
						style={{
							width: 38,
							height: 38,
							borderRadius: 10,
							background: 'var(--compound-glow)',
							border: '1px solid rgba(0,211,149,0.2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 18,
						}}
					>
						🏦
					</div>
					<div>
						<p
							style={{
								fontWeight: 700,
								color: 'var(--text-primary)',
								fontSize: 14,
							}}
						>
							Compound V3 · {position.market}
						</p>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Money market · Ethereum
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: 11,
						fontWeight: 700,
						padding: '4px 10px',
						borderRadius: 8,
						background: 'var(--compound-glow)',
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
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 6,
					marginBottom: 12,
				}}
			>
				{[
					{
						label: 'Net value',
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
							background: 'var(--bg-elevated)',
							borderRadius: 8,
							padding: '9px 10px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 3,
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
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

			{/* APR bars */}
			<div style={{ display: 'flex', gap: 6 }}>
				<div
					style={{
						flex: 1,
						background: 'rgba(0,211,149,0.06)',
						border: '1px solid rgba(0,211,149,0.12)',
						borderRadius: 8,
						padding: '9px 10px',
					}}
				>
					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginBottom: 3,
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Supply APR
					</p>
					<p
						style={{ fontSize: 16, fontWeight: 800, color: 'var(--compound)' }}
					>
						{position.supplyAPR.toFixed(2)}%
					</p>
				</div>
				<div
					style={{
						flex: 1,
						background: 'var(--bg-elevated)',
						borderRadius: 8,
						padding: '9px 10px',
					}}
				>
					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginBottom: 3,
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Borrow APR
					</p>
					<p
						style={{
							fontSize: 16,
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
							background: 'var(--bg-elevated)',
							borderRadius: 8,
							padding: '9px 10px',
						}}
					>
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								marginBottom: 3,
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
							}}
						>
							Utilization
						</p>
						<p
							style={{
								fontSize: 16,
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
