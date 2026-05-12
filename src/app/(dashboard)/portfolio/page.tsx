'use client'

import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { StatCard } from '@/components/ui/StatCard'
import { PortfolioChart } from '@/components/dashboard/PortfolioChart'
import { PositionRow } from '@/components/dashboard/PositionRow'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { AavePosition, CompoundPosition } from '@/types'

function formatUSD(value: number): string {
	if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
	if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
	return `$${value.toFixed(2)}`
}

export default function PortfolioPage() {
	const { isConnected, address } = useWallet()
	const { data: portfolio, isLoading, error } = usePortfolio()

	if (!isConnected) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					gap: '16px',
				}}
			>
				<div style={{ fontSize: '48px' }}>◈</div>
				<h2
					style={{
						fontSize: '20px',
						fontWeight: 600,
						color: 'var(--text-primary)',
					}}
				>
					Connect your wallet
				</h2>
				<p
					style={{
						fontSize: '14px',
						color: 'var(--text-secondary)',
						marginBottom: '8px',
					}}
				>
					Connect MetaMask to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div>
				<div style={{ marginBottom: '24px' }}>
					<div
						style={{
							height: '28px',
							background: 'var(--bg-elevated)',
							borderRadius: '8px',
							width: '160px',
							marginBottom: '8px',
						}}
					/>
					<div
						style={{
							height: '14px',
							background: 'var(--bg-elevated)',
							borderRadius: '6px',
							width: '120px',
						}}
					/>
				</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: '16px',
						marginBottom: '24px',
					}}
				>
					{Array.from({ length: 4 }).map((_, i) => (
						<StatCard key={i} label='' value='' isLoading />
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
				}}
			>
				<p style={{ color: 'var(--accent-red)' }}>Failed to load portfolio</p>
			</div>
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

	return (
		<div>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: '24px',
				}}
			>
				<div>
					<h1
						style={{
							fontSize: '24px',
							fontWeight: 700,
							color: 'var(--text-primary)',
							letterSpacing: '-0.5px',
						}}
					>
						Portfolio
					</h1>
					<p
						style={{
							fontSize: '12px',
							color: 'var(--text-tertiary)',
							fontFamily: 'monospace',
							marginTop: '4px',
						}}
					>
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</p>
				</div>
				<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
					Updated{' '}
					{portfolio?.lastUpdated
						? new Date(portfolio.lastUpdated).toLocaleTimeString()
						: '—'}
				</p>
			</div>

			{/* Stat cards */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gap: '16px',
					marginBottom: '24px',
				}}
			>
				<StatCard
					label='Total value'
					value={formatUSD(totalValue)}
					subValue={
						change !== 0
							? `${change > 0 ? '+' : ''}${change.toFixed(2)}% 24h`
							: undefined
					}
					trend={change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'}
					accent='blue'
				/>
				<StatCard
					label='Positions'
					value={positions.length.toString()}
					subValue={`${new Set(positions.map(p => p.protocol)).size} protocols`}
				/>
				<StatCard
					label='Best APY'
					value={bestAPY > 0 ? `${bestAPY.toFixed(2)}%` : '—'}
					trend={bestAPY > 0 ? 'up' : 'neutral'}
					accent='green'
				/>
				<StatCard label='Network' value='Ethereum' subValue='Mainnet' />
			</div>

			{/* Main grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: '16px',
				}}
			>
				{/* Positions list */}
				<div
					style={{
						background: 'var(--gradient-card)',
						border: '1px solid var(--border-primary)',
						borderRadius: '16px',
						padding: '20px',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '16px',
						}}
					>
						<p
							style={{
								fontSize: '13px',
								fontWeight: 500,
								color: 'var(--text-secondary)',
							}}
						>
							Open positions
						</p>
						<span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
							{positions.length} total
						</span>
					</div>

					{positions.length === 0 ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '48px 0',
								color: 'var(--text-tertiary)',
							}}
						>
							<p style={{ fontSize: '32px', marginBottom: '12px' }}>◎</p>
							<p style={{ fontSize: '13px' }}>No DeFi positions found</p>
							<p
								style={{
									fontSize: '12px',
									marginTop: '4px',
									color: 'var(--text-tertiary)',
								}}
							>
								Start by supplying assets to Aave or adding liquidity on Uniswap
							</p>
						</div>
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
