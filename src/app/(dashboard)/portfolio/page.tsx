'use client'

import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { EmptyState } from '@/components/ui/EmptyState'
import { TrendBadge } from '@/components/ui/TrendBadge'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import { OrbitalSystem } from '@/components/orbital/OrbitalSystem'
import { LiquidityStreams } from '@/components/orbital/LiquidityStreams'
import {
	PositionCapsule,
	AddPositionCapsule,
} from '@/components/orbital/PositionCapsule'
import { IdentityCard } from '@/components/identity/IdentityCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import type { AavePosition, CompoundPosition } from '@/types'

export default function PortfolioPage() {
	const { isConnected } = useWallet()
	const { data: portfolio, isLoading, error, refetch } = usePortfolio()

	/* ── Not connected ── */
	if (!isConnected) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '70vh',
					gap: 16,
					padding: 24,
				}}
			>
				<div
					style={{
						width: 64,
						height: 64,
						borderRadius: '50%',
						border: '2px solid rgba(0,229,255,0.3)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 24,
					}}
				>
					◈
				</div>
				<h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
					Track your DeFi portfolio
				</h2>
				<p
					style={{
						fontSize: 14,
						color: 'var(--text-secondary)',
						textAlign: 'center',
						maxWidth: 300,
						lineHeight: 1.6,
					}}
				>
					Connect your wallet to see positions across Uniswap, Aave and Compound
				</p>
				<ConnectButton />
			</div>
		)
	}

	/* ── Loading ── */
	if (isLoading) {
		return (
			<div
				className='fade-in'
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: 'calc(100vh - 84px)',
				}}
			>
				<div
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div style={{ position: 'relative', width: 300, height: 300 }}>
						{[240, 180, 120].map(d => (
							<div
								key={d}
								className='skeleton'
								style={{
									position: 'absolute',
									width: d,
									height: d,
									borderRadius: '50%',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%,-50%)',
									opacity: 0.5,
								}}
							/>
						))}
					</div>
				</div>
				<div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
					{[0, 1, 2].map(i => (
						<SkeletonCard key={i} lines={2} />
					))}
				</div>
			</div>
		)
	}

	/* ── Error ── */
	if (error) {
		return (
			<div style={{ padding: 24 }}>
				<EmptyState
					icon='⚠️'
					title='Failed to load portfolio'
					description={(error as Error).message}
					action={{ label: 'Try again', onClick: () => refetch() }}
				/>
			</div>
		)
	}

	const totalValue = portfolio?.totalValueUSD ?? 0
	const change = portfolio?.change24hPercent ?? 0
	const positions = portfolio?.positions ?? []
	const protocolCount = new Set(positions.map(p => p.protocol)).size

	const bestAPY = positions.reduce((best, pos) => {
		const apy =
			pos.protocol === 'aave'
				? (pos as AavePosition).netAPY
				: pos.protocol === 'compound'
					? (pos as CompoundPosition).supplyAPR
					: 0
		return apy > best ? apy : best
	}, 0)

	return (
		<div
			className='warp-in'
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: 'calc(100vh - 84px)',
				overflow: 'hidden',
			}}
		>
			{/* ── Body: galaxy + right panel ── */}
			<div
				style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}
			>
				{/* ── Galaxy area ── */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					{/* Section label */}
					<div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
						<div className='section-label'>PORTFOLIO CORE</div>
					</div>

					{/* Orbital system */}
					<OrbitalSystem
						positions={positions}
						totalValue={totalValue}
						change24h={change}
						bestAPY={bestAPY}
					/>

					{/* View all button */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							marginBottom: 12,
							flexShrink: 0,
						}}
					>
						<Link href='/positions' className='view-all-btn'>
							◎ View All Positions →
						</Link>
					</div>

					{/* Position Capsules */}
					<div style={{ flexShrink: 0, padding: '0 20px 20px' }}>
						<div className='section-label'>POSITION CAPSULES</div>
						<div
							style={{
								display: 'flex',
								gap: 10,
								overflowX: 'auto',
								scrollbarWidth: 'none',
								paddingBottom: 4,
							}}
						>
							{positions.map(pos => (
								<PositionCapsule key={pos.id} position={pos} />
							))}
							<AddPositionCapsule />
						</div>
					</div>
				</div>

				{/* ── Right panel ── */}
				<div
					style={{
						width: 272,
						borderLeft: '1px solid var(--border-primary)',
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
						padding: 14,
						overflowY: 'auto',
						flexShrink: 0,
					}}
				>
					{/* Identity */}
					<div className='panel-card'>
						<div className='panel-title'>
							IDENTITY SCORE
							<span className='panel-link'>View</span>
						</div>
						<IdentityCard compact />
					</div>

					{/* Liquidity Streams */}
					<LiquidityStreams />

					{/* AI Signals */}
					<div className='panel-card'>
						<div className='panel-title'>
							AI SIGNALS
							<Link
								href='/ai-insights'
								style={{
									fontSize: 9,
									color: 'var(--accent-lime)',
									fontWeight: 700,
									textDecoration: 'none',
								}}
							>
								3 New
							</Link>
						</div>
						{[
							{
								icon: '🔄',
								bg: 'rgba(0,229,255,0.1)',
								title: 'Rotation Opportunity',
								sub: 'Move USDC → ETH on Aave V3',
							},
							{
								icon: '⚖',
								bg: 'rgba(124,255,107,0.1)',
								title: 'Rebalance Suggested',
								sub: 'ETH exposure is high',
							},
							{
								icon: '⛽',
								bg: 'rgba(251,191,36,0.1)',
								title: 'Gas Price Alert',
								sub: 'Gas 32% above average',
							},
						].map((sig, i) => (
							<div
								key={i}
								className='signal-item'
								style={{ animationDelay: `${i * 0.08}s` }}
							>
								<div
									style={{
										width: 26,
										height: 26,
										borderRadius: 8,
										background: sig.bg,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 12,
										flexShrink: 0,
									}}
								>
									{sig.icon}
								</div>
								<div>
									<div
										style={{
											fontSize: 11,
											fontWeight: 700,
											color: '#fff',
											marginBottom: 2,
										}}
									>
										{sig.title}
									</div>
									<div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>
										{sig.sub}
									</div>
								</div>
								<span
									style={{
										marginLeft: 'auto',
										fontSize: 12,
										color: 'var(--text-tertiary)',
										flexShrink: 0,
									}}
								>
									›
								</span>
							</div>
						))}
					</div>

					{/* Quick stats */}
					<div className='panel-card'>
						<div className='panel-title'>OVERVIEW</div>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: 8,
							}}
						>
							{[
								{ label: 'Positions', value: positions.length.toString() },
								{ label: 'Protocols', value: protocolCount.toString() },
								{
									label: '24h Change',
									value: <TrendBadge value={change} size='sm' />,
								},
								{
									label: 'Best APY',
									value: bestAPY > 0 ? `${bestAPY.toFixed(2)}%` : '—',
									color: 'var(--accent-lime)',
								},
							].map((s, i) => (
								<div
									key={i}
									style={{
										background: 'rgba(255,255,255,0.02)',
										borderRadius: 10,
										padding: '10px 12px',
										border: '1px solid rgba(255,255,255,0.05)',
									}}
								>
									<div
										style={{
											fontSize: 9,
											color: 'var(--text-tertiary)',
											fontWeight: 700,
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											marginBottom: 5,
										}}
									>
										{s.label}
									</div>
									<div
										style={{
											fontSize: 16,
											fontWeight: 800,
											color: s.color ?? '#fff',
										}}
									>
										{s.value}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
