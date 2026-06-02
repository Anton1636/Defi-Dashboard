import type { CompoundPosition } from '@/types'

function fmt(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function CompoundCard({ position }: { position: CompoundPosition }) {
	const utilization =
		position.supplied > 0 ? (position.borrowed / position.supplied) * 100 : 0

	return (
		<div
			style={{
				background: 'var(--card-bg)',
				border: '1px solid var(--card-border)',
				borderRadius: 'var(--card-radius)',
				padding: 'var(--card-padding-lg)',
				position: 'relative',
				overflow: 'hidden',
				transition: 'border-color .2s, box-shadow .2s, transform .15s',
				boxShadow: 'var(--shadow-card)',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(0,211,149,.3)'
				e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
				e.currentTarget.style.transform = 'translateY(-2px)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--card-border)'
				e.currentTarget.style.boxShadow = 'var(--shadow-card)'
				e.currentTarget.style.transform = 'translateY(0)'
			}}
		>
			{/* Compound accent line */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 2,
					background:
						'linear-gradient(90deg,var(--compound),rgba(0,211,149,.15),transparent)',
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 16,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 40,
							height: 40,
							borderRadius: '50%',
							background: 'var(--compound-glow)',
							border: '1px solid rgba(0,211,149,.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 20,
						}}
					>
						🏦
					</div>
					<div>
						<p
							style={{
								fontSize: 14,
								fontWeight: 800,
								color: 'var(--text-primary)',
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
						borderRadius: 20,
						background: 'var(--compound-glow)',
						color: 'var(--compound)',
						border: '1px solid rgba(0,211,149,.2)',
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
				}}
			>
				{[
					{
						label: 'Net Value',
						value: fmt(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: 'Supplied',
						value: fmt(position.supplied),
						color: 'var(--compound)',
					},
					{
						label: 'Borrowed',
						value: position.borrowed > 0 ? fmt(position.borrowed) : '—',
						color: 'var(--text-secondary)',
					},
				].map(s => (
					<div
						key={s.label}
						style={{
							background: 'var(--surface-2)',
							borderRadius: 'var(--card-radius-sm)',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '.07em',
								marginBottom: 5,
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

			{/* APR cells */}
			<div style={{ display: 'flex', gap: 8 }}>
				<div
					style={{
						flex: 1,
						background: 'rgba(0,211,149,.06)',
						border: '1px solid rgba(0,211,149,.12)',
						borderRadius: 'var(--card-radius-xs)',
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: 9,
							color: 'var(--text-tertiary)',
							fontWeight: 700,
							textTransform: 'uppercase',
							letterSpacing: '.07em',
							marginBottom: 5,
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
						background: 'var(--surface-2)',
						borderRadius: 'var(--card-radius-xs)',
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: 9,
							color: 'var(--text-tertiary)',
							fontWeight: 700,
							textTransform: 'uppercase',
							letterSpacing: '.07em',
							marginBottom: 5,
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
				{utilization > 0 && (
					<div
						style={{
							flex: 1,
							background: 'var(--surface-2)',
							borderRadius: 'var(--card-radius-xs)',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '.07em',
								marginBottom: 5,
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
							{utilization.toFixed(1)}%
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
