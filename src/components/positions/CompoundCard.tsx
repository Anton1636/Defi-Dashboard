'use client'

import { useModeStore } from '@/store/modeStore'
import type { CompoundPosition } from '@/types'

function formatUSD(v: number) {
	if (v >= 1000) return `$${(v / 1000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

export function CompoundCard({ position }: { position: CompoundPosition }) {
	const { mode } = useModeStore()
	const isSimple = mode === 'simple'

	const utilizationRate =
		position.supplied > 0 ? (position.borrowed / position.supplied) * 100 : 0

	return (
		<div
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '16px',
				padding: '20px',
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--compound)44'
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
					marginBottom: '16px',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<div
						style={{
							width: '40px',
							height: '40px',
							borderRadius: '50%',
							background: 'var(--compound-glow)',
							border: '1px solid var(--compound)44',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '20px',
						}}
					>
						🏦
					</div>
					<div>
						<p
							style={{
								fontWeight: 600,
								color: 'var(--text-primary)',
								fontSize: '14px',
							}}
						>
							{isSimple
								? `Compound — ${position.market} savings`
								: `Compound V3 · ${position.market}`}
						</p>
						<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
							{isSimple
								? 'Like a savings account but on blockchain'
								: 'Money market · Ethereum'}
						</p>
					</div>
				</div>
				<span
					style={{
						fontSize: '12px',
						fontWeight: 600,
						padding: '4px 10px',
						borderRadius: '20px',
						background: 'var(--compound-glow)',
						color: 'var(--compound)',
					}}
				>
					{isSimple
						? `Earning ${position.supplyAPR.toFixed(2)}%/yr`
						: `${position.supplyAPR.toFixed(2)}% APR`}
				</span>
			</div>

			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '8px',
					marginBottom: '16px',
				}}
			>
				{[
					{
						label: isSimple ? 'Net value' : 'Net value',
						value: formatUSD(position.valueUSD),
						color: 'var(--text-primary)',
					},
					{
						label: isSimple ? 'You deposited' : 'Supplied',
						value: formatUSD(position.supplied),
						color: 'var(--compound)',
					},
					{
						label: isSimple ? 'You borrowed' : 'Borrowed',
						value: position.borrowed > 0 ? formatUSD(position.borrowed) : '—',
						color: 'var(--text-secondary)',
					},
				].map(stat => (
					<div
						key={stat.label}
						style={{
							background: 'var(--bg-elevated)',
							borderRadius: '10px',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: '11px',
								color: 'var(--text-tertiary)',
								marginBottom: '4px',
							}}
						>
							{stat.label}
						</p>
						<p style={{ fontSize: '13px', fontWeight: 600, color: stat.color }}>
							{stat.value}
						</p>
					</div>
				))}
			</div>

			{/* APR comparison */}
			<div style={{ display: 'flex', gap: '8px' }}>
				<div
					style={{
						flex: 1,
						background: 'rgba(0, 211, 149, 0.06)',
						border: '1px solid rgba(0, 211, 149, 0.12)',
						borderRadius: '8px',
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: '11px',
							color: 'var(--text-tertiary)',
							marginBottom: '4px',
						}}
					>
						{isSimple ? 'Interest you earn' : 'Supply APR'}
					</p>
					<p
						style={{
							fontSize: '14px',
							fontWeight: 600,
							color: 'var(--compound)',
						}}
					>
						{position.supplyAPR.toFixed(2)}%
					</p>
				</div>
				<div
					style={{
						flex: 1,
						background: 'var(--bg-elevated)',
						borderRadius: '8px',
						padding: '10px 12px',
					}}
				>
					<p
						style={{
							fontSize: '11px',
							color: 'var(--text-tertiary)',
							marginBottom: '4px',
						}}
					>
						{isSimple ? 'Interest you pay' : 'Borrow APR'}
					</p>
					<p
						style={{
							fontSize: '14px',
							fontWeight: 600,
							color: 'var(--text-secondary)',
						}}
					>
						{position.borrowAPR.toFixed(2)}%
					</p>
				</div>
				{!isSimple && utilizationRate > 0 && (
					<div
						style={{
							flex: 1,
							background: 'var(--bg-elevated)',
							borderRadius: '8px',
							padding: '10px 12px',
						}}
					>
						<p
							style={{
								fontSize: '11px',
								color: 'var(--text-tertiary)',
								marginBottom: '4px',
							}}
						>
							Utilization
						</p>
						<p
							style={{
								fontSize: '14px',
								fontWeight: 600,
								color: 'var(--text-secondary)',
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
