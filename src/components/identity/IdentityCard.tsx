'use client'

import { useState } from 'react'
import { useIdentity } from '@/hooks/useIdentity'
import { ReputationScore } from './ReputationScore'
import { shortAddress } from '@/lib/ens'

export function IdentityCard({ compact = false }: { compact?: boolean }) {
	const { identity, ensName, address } = useIdentity()
	const [expanded, setExpanded] = useState(false)

	if (!identity || !address) return null

	return (
		<div
			style={{
				background: 'var(--bg-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: 14,
				padding: '16px 18px',
				marginBottom: 12,
				cursor: 'pointer',
				transition: 'border-color 0.2s',
			}}
			onClick={() => setExpanded(e => !e)}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--border-accent)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			{/* Compact */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
				<ReputationScore
					score={identity.totalScore}
					tierColor='var(--accent-blue)'
					size={64}
				/>

				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 5,
						}}
					>
						<p
							style={{
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
								letterSpacing: '-0.3px',
							}}
						>
							{ensName ?? shortAddress(address)}
						</p>
						<span
							style={{
								fontSize: 10,
								fontWeight: 700,
								padding: '2px 8px',
								borderRadius: 6,
								background: 'var(--accent-blue-glow)',
								color: 'var(--accent-blue)',
								border: '1px solid var(--border-accent)',
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
							}}
						>
							{identity.tier}
						</span>
					</div>
					<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
						{[
							{ label: 'Age', value: identity.walletAge },
							{ label: 'Txs', value: identity.txCount.toLocaleString() },
							{ label: 'Protocols', value: identity.protocolsUsed },
							{ label: 'ENS', value: identity.hasENS ? '✓' : '—' },
						].map(stat => (
							<div key={stat.label}>
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 600,
									}}
								>
									{stat.label}{' '}
								</span>
								<span
									style={{
										fontSize: 11,
										fontWeight: 700,
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
					style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}
				>
					{expanded ? '▲' : '▼'}
				</span>
			</div>

			{/* Expanded */}
			{!compact && expanded && (
				<div
					style={{
						marginTop: 16,
						borderTop: '1px solid var(--border-primary)',
						paddingTop: 14,
					}}
					onClick={e => e.stopPropagation()}
				>
					<p
						style={{
							fontSize: 10,
							fontWeight: 700,
							color: 'var(--text-tertiary)',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							marginBottom: 12,
						}}
					>
						Score breakdown
					</p>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						{identity.categories.map(cat => (
							<div key={cat.name}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: 4,
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
												fontWeight: 800,
												color: 'var(--accent-blue)',
												minWidth: 28,
												textAlign: 'right',
											}}
										>
											{cat.score}
										</span>
									</div>
								</div>
								<div
									style={{
										height: 3,
										background: 'var(--bg-elevated)',
										borderRadius: 2,
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											height: '100%',
											width: `${cat.score}%`,
											background: 'var(--accent-blue)',
											borderRadius: 2,
											boxShadow: '0 0 6px var(--accent-blue-glow)',
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
							marginTop: 14,
							padding: '12px 14px',
							background: 'var(--bg-elevated)',
							borderRadius: 10,
						}}
					>
						<p
							style={{
								fontSize: 10,
								fontWeight: 700,
								color: 'var(--text-tertiary)',
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								marginBottom: 8,
							}}
						>
							💡 How to improve
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							{!identity.hasENS && (
								<p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
									• Register ENS at{' '}
									<a
										href='https://app.ens.domains'
										target='_blank'
										rel='noopener noreferrer'
										style={{ color: 'var(--accent-blue)' }}
									>
										ens.domains
									</a>{' '}
									(+40 pts)
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
