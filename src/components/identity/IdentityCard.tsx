'use client'

import { useState } from 'react'
import { useIdentity } from '@/hooks/useIdentity'
import { ReputationScore } from './ReputationScore'
import { shortAddress } from '@/lib/ens'

export function IdentityCard() {
	const { identity, ensName, address } = useIdentity()
	const [expanded, setExpanded] = useState(false)

	if (!identity || !address) return null

	return (
		<div
			className='card stagger-1'
			style={{
				padding: 20,
				marginBottom: 16,
				cursor: 'pointer',
				transition: 'border-color 0.2s',
			}}
			onClick={() => setExpanded(e => !e)}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = identity.tierColor + '44'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			{/* Compact view — always visible */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<ReputationScore
					score={identity.totalScore}
					tierColor={identity.tierColor}
					size={72}
				/>

				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 4,
						}}
					>
						<p
							style={{
								fontSize: 16,
								fontWeight: 700,
								color: 'var(--text-primary)',
							}}
						>
							{ensName ?? shortAddress(address)}
						</p>
						<span
							style={{
								fontSize: 11,
								fontWeight: 600,
								padding: '2px 8px',
								borderRadius: 20,
								background: identity.tierColor + '22',
								color: identity.tierColor,
								border: `1px solid ${identity.tierColor}44`,
							}}
						>
							{identity.tier}
						</span>
					</div>

					<div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
						{[
							{ label: 'Age', value: identity.walletAge },
							{ label: 'Txs', value: identity.txCount.toLocaleString() },
							{ label: 'Protocols', value: identity.protocolsUsed },
							{ label: 'ENS', value: identity.hasENS ? '✓' : '—' },
						].map(stat => (
							<div key={stat.label}>
								<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
									{stat.label}{' '}
								</span>
								<span
									style={{
										fontSize: 12,
										fontWeight: 600,
										color: 'var(--text-secondary)',
									}}
								>
									{stat.value}
								</span>
							</div>
						))}
					</div>
				</div>

				<span
					style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}
				>
					{expanded ? '▲' : '▼'}
				</span>
			</div>

			{/* Expanded view */}
			{expanded && (
				<div
					style={{
						marginTop: 20,
						borderTop: '1px solid var(--border-primary)',
						paddingTop: 16,
					}}
					onClick={e => e.stopPropagation()}
				>
					<p
						style={{
							fontSize: 11,
							fontWeight: 500,
							color: 'var(--text-tertiary)',
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							marginBottom: 14,
						}}
					>
						Score breakdown
					</p>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						{identity.categories.map(cat => (
							<div key={cat.name}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: 5,
									}}
								>
									<span
										style={{
											fontSize: 13,
											color: 'var(--text-primary)',
											display: 'flex',
											alignItems: 'center',
											gap: 6,
										}}
									>
										<span>{cat.icon}</span>
										{cat.name}
									</span>
									<div
										style={{ display: 'flex', alignItems: 'center', gap: 8 }}
									>
										<span
											style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
										>
											{cat.description}
										</span>
										<span
											style={{
												fontSize: 12,
												fontWeight: 700,
												color: identity.tierColor,
												minWidth: 28,
												textAlign: 'right',
											}}
										>
											{cat.score}
										</span>
									</div>
								</div>
								{/* Progress bar */}
								<div
									style={{
										height: 4,
										background: 'var(--bg-elevated)',
										borderRadius: 2,
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											height: '100%',
											width: `${cat.score}%`,
											background: identity.tierColor,
											borderRadius: 2,
											boxShadow: `0 0 8px ${identity.tierColor}66`,
											transition: 'width 0.6s ease',
										}}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Tips */}
					<div
						style={{
							marginTop: 16,
							padding: '12px 14px',
							background: 'var(--bg-elevated)',
							borderRadius: 10,
						}}
					>
						<p
							style={{
								fontSize: 11,
								fontWeight: 600,
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
								marginBottom: 8,
							}}
						>
							💡 How to improve
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							{!identity.hasENS && (
								<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
									• Register an ENS name at{' '}
									<a
										href='https://app.ens.domains'
										target='_blank'
										rel='noopener noreferrer'
										style={{ color: 'var(--accent-blue)' }}
									>
										ens.domains
									</a>{' '}
									(+40 Identity pts)
								</p>
							)}
							{identity.categories[0].score < 70 && (
								<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
									• Increase on-chain activity to boost Activity score
								</p>
							)}
							{identity.categories[1].score < 60 && (
								<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
									• Try more DeFi protocols to boost DeFi Experience
								</p>
							)}
							{identity.categories[2].score < 80 && (
								<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
									• Maintain healthy Aave positions for better Portfolio score
								</p>
							)}
						</div>
					</div>

					<p
						style={{
							fontSize: 10,
							color: 'var(--text-tertiary)',
							marginTop: 10,
							textAlign: 'right',
						}}
					>
						First seen: {identity.firstSeen} · Powered by on-chain data
					</p>
				</div>
			)}
		</div>
	)
}
