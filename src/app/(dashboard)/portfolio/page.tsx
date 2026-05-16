'use client'

import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { StatCard } from '@/components/ui/StatCard'
import { TrendBadge } from '@/components/ui/TrendBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tooltip } from '@/components/ui/Tooltip'
import { PortfolioChart } from '@/components/dashboard/PortfolioChart'
import { PositionRow } from '@/components/dashboard/PositionRow'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { AavePosition, CompoundPosition } from '@/types'

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

export default function PortfolioPage() {
	const { isConnected, address } = useWallet()
	const { data: portfolio, isLoading, error, refetch } = usePortfolio()

	// ─── Not connected ────────────────────────────────────────────────────────
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
				}}
			>
				<div style={{ fontSize: 56, marginBottom: 8 }}>◈</div>
				<h2
					style={{
						fontSize: 'var(--text-xl)',
						fontWeight: 700,
						color: 'var(--text-primary)',
					}}
				>
					Track your DeFi portfolio
				</h2>
				<p
					style={{
						fontSize: 'var(--text-sm)',
						color: 'var(--text-secondary)',
						textAlign: 'center',
						maxWidth: 320,
					}}
				>
					Connect your wallet to see positions across Uniswap, Aave and Compound
				</p>
				<ConnectButton />
			</div>
		)
	}

	// ─── Loading ──────────────────────────────────────────────────────────────
	if (isLoading) {
		return (
			<div className='fade-in'>
				{/* Hero skeleton */}
				<div className='card' style={{ padding: 28, marginBottom: 16 }}>
					<div
						className='skeleton'
						style={{ height: 12, width: 100, marginBottom: 16 }}
					/>
					<div
						className='skeleton'
						style={{ height: 56, width: 220, marginBottom: 12 }}
					/>
					<div
						className='skeleton'
						style={{ height: 22, width: 80, borderRadius: 20 }}
					/>
				</div>
				{/* Secondary skeletons */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 12,
						marginBottom: 16,
					}}
				>
					{Array.from({ length: 3 }).map((_, i) => (
						<StatCard key={i} label='' value='' isLoading />
					))}
				</div>
				<div
					style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}
				>
					<SkeletonCard lines={4} />
					<SkeletonCard lines={3} />
				</div>
			</div>
		)
	}

	// ─── Error ────────────────────────────────────────────────────────────────
	if (error) {
		return (
			<EmptyState
				icon='⚠️'
				title='Failed to load portfolio'
				description={(error as Error).message}
				action={{ label: 'Try again', onClick: () => refetch() }}
			/>
		)
	}

	const totalValue = portfolio?.totalValueUSD ?? 0
	const change = portfolio?.change24hPercent ?? 0
	const positions = portfolio?.positions ?? []

	const bestAPY = positions.reduce((best, pos) => {
		const apy =
			pos.protocol === 'aave'
				? (pos as AavePosition).netAPY
				: pos.protocol === 'compound'
					? (pos as CompoundPosition).supplyAPR
					: 0
		return apy > best ? apy : best
	}, 0)

	const protocolCount = new Set(positions.map(p => p.protocol)).size

	return (
		<div className='fade-in'>
			{/* ─── Hero block ──────────────────────── */}
			<div
				className='card'
				style={{
					padding: 28,
					marginBottom: 16,
					background: 'linear-gradient(135deg, #16161f 0%, #1a1a2e 100%)',
					boxShadow: `var(--shadow-card), var(--shadow-glow-blue)`,
				}}
			>
				{/* Accent top line */}
				<div
					style={{
						position: 'absolute' as const,
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background: 'var(--gradient-blue)',
						borderRadius: '16px 16px 0 0',
					}}
				/>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}
				>
					<div>
						{/* Label */}
						<p
							style={{
								fontSize: 'var(--text-2xs)',
								color: 'var(--text-tertiary)',
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								marginBottom: 12,
							}}
						>
							Total Portfolio Value
						</p>

						<p
							className='animate-count'
							style={{
								fontSize: 'var(--text-hero)',
								fontWeight: 800,
								color: 'var(--text-primary)',
								letterSpacing: '-2px',
								lineHeight: 1,
								marginBottom: 12,
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{formatUSD(totalValue)}
						</p>

						{/* Trend badge */}
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<TrendBadge value={change} suffix='24h' size='md' />
							<span
								style={{
									fontSize: 'var(--text-xs)',
									color: 'var(--text-tertiary)',
								}}
							>
								across {protocolCount} protocols
							</span>
						</div>
					</div>

					{/* Wallet address + timestamp */}
					<div style={{ textAlign: 'right' }}>
						<p
							style={{
								fontSize: 'var(--text-xs)',
								color: 'var(--text-tertiary)',
								fontFamily: 'monospace',
								marginBottom: 4,
							}}
						>
							{address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
						<p
							style={{
								fontSize: 'var(--text-2xs)',
								color: 'var(--text-tertiary)',
							}}
						>
							Updated{' '}
							{portfolio?.lastUpdated
								? new Date(portfolio.lastUpdated).toLocaleTimeString()
								: '—'}
						</p>
					</div>
				</div>
			</div>

			{/* ─── Secondary stats ─────────────────────────────────────────────── */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 12,
					marginBottom: 16,
				}}
			>
				<Tooltip content='Number of open DeFi positions'>
					<StatCard
						label='Open positions'
						value={positions.length.toString()}
						subValue={`${protocolCount} protocol${protocolCount !== 1 ? 's' : ''}`}
					/>
				</Tooltip>

				<Tooltip content='Best annual percentage yield among your positions'>
					<StatCard
						label='Best APY'
						value={bestAPY > 0 ? `${bestAPY.toFixed(2)}%` : '—'}
						trend={bestAPY > 5 ? 'up' : bestAPY > 0 ? 'neutral' : 'neutral'}
						accent={bestAPY > 5 ? 'green' : undefined}
					/>
				</Tooltip>

				<Tooltip content='Current network'>
					<StatCard label='Network' value='Ethereum' subValue='Mainnet' />
				</Tooltip>
			</div>

			{/* ─── Main content ────────────────────────────────────────────────── */}
			<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
				{/* Positions list */}
				<div className='card' style={{ padding: 20 }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 20,
						}}
					>
						<p
							style={{
								fontSize: 'var(--text-sm)',
								fontWeight: 600,
								color: 'var(--text-secondary)',
							}}
						>
							Open positions
						</p>
						<span
							style={{
								fontSize: 'var(--text-2xs)',
								color: 'var(--text-tertiary)',
								background: 'var(--bg-elevated)',
								padding: '2px 8px',
								borderRadius: 20,
							}}
						>
							{positions.length} total
						</span>
					</div>

					{positions.length === 0 ? (
						<EmptyState
							icon='◎'
							title='No DeFi positions found'
							description='Start by supplying assets to Aave or adding liquidity on Uniswap'
						/>
					) : (
						positions.map(position => (
							<PositionRow key={position.id} position={position} />
						))
					)}
				</div>

				{/* Chart */}
				<PortfolioChart positions={positions} totalValueUSD={totalValue} />
			</div>
		</div>
	)
}
