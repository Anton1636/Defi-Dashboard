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
import { IdentityCard } from '@/components/identity/IdentityCard'
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
				<div style={{ fontSize: 52, marginBottom: 4 }}>◈</div>
				<h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
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

	if (isLoading) {
		return (
			<div className='fade-in'>
				<div
					style={{
						background: 'var(--bg-card)',
						border: '1px solid var(--border-primary)',
						borderRadius: 14,
						padding: 24,
						marginBottom: 12,
					}}
				>
					<div
						className='skeleton'
						style={{ height: 11, width: 120, marginBottom: 14 }}
					/>
					<div
						className='skeleton'
						style={{ height: 52, width: 200, marginBottom: 10 }}
					/>
					<div
						className='skeleton'
						style={{ height: 20, width: 80, borderRadius: 20 }}
					/>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 10,
						marginBottom: 12,
					}}
				>
					{Array.from({ length: 3 }).map((_, i) => (
						<StatCard key={i} label='' value='' isLoading />
					))}
				</div>
				<div
					style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}
				>
					<SkeletonCard lines={4} />
					<SkeletonCard lines={3} />
				</div>
			</div>
		)
	}

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
			{/* Identity */}
			<IdentityCard />

			{/* Hero */}
			<div
				style={{
					background: 'var(--bg-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: 14,
					padding: '22px 24px',
					marginBottom: 12,
					position: 'relative',
					overflow: 'hidden',
					transition: 'border-color 0.2s',
				}}
				onMouseEnter={e => {
					e.currentTarget.style.borderColor = 'var(--border-accent)'
				}}
				onMouseLeave={e => {
					e.currentTarget.style.borderColor = 'var(--border-primary)'
				}}
			>
				{/* Cyan top line */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background: 'linear-gradient(90deg, var(--accent-blue), #0066cc)',
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
						<p
							style={{
								fontSize: 10,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '0.1em',
								marginBottom: 10,
							}}
						>
							Total Portfolio Value
						</p>
						<p
							className='animate-count'
							style={{
								fontSize: 46,
								fontWeight: 900,
								color: 'var(--text-primary)',
								letterSpacing: '-2.5px',
								lineHeight: 1,
								marginBottom: 10,
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{formatUSD(totalValue)}
						</p>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<TrendBadge value={change} suffix='24h' size='md' />
							<span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
								across {protocolCount} protocols
							</span>
						</div>
					</div>
					<div style={{ textAlign: 'right' }}>
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								fontFamily: 'monospace',
								marginBottom: 3,
							}}
						>
							{address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
						<p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
							Updated{' '}
							{portfolio?.lastUpdated
								? new Date(portfolio.lastUpdated).toLocaleTimeString()
								: '—'}
						</p>
					</div>
				</div>
			</div>

			{/* Stats row */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 10,
					marginBottom: 12,
				}}
			>
				<Tooltip content='Number of open DeFi positions'>
					<StatCard
						label='Open positions'
						value={positions.length.toString()}
						subValue={`${protocolCount} protocol${protocolCount !== 1 ? 's' : ''}`}
					/>
				</Tooltip>
				<Tooltip content='Best annual yield among your positions'>
					<StatCard
						label='Best APY'
						value={bestAPY > 0 ? `${bestAPY.toFixed(2)}%` : '—'}
						trend={bestAPY > 5 ? 'up' : 'neutral'}
						accent={bestAPY > 5 ? 'green' : undefined}
					/>
				</Tooltip>
				<Tooltip content='Current network'>
					<StatCard label='Network' value='Ethereum' subValue='Mainnet' />
				</Tooltip>
			</div>

			{/* Main grid */}
			<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
				{/* Positions */}
				<div
					style={{
						background: 'var(--bg-card)',
						border: '1px solid var(--border-primary)',
						borderRadius: 14,
						padding: 20,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 16,
						}}
					>
						<p
							style={{
								fontSize: 14,
								fontWeight: 700,
								color: 'var(--text-primary)',
							}}
						>
							Open positions
						</p>
						<span
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								background: 'var(--bg-elevated)',
								padding: '2px 8px',
								borderRadius: 20,
								fontWeight: 600,
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
