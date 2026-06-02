'use client'

import { useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { UniswapCard } from '@/components/positions/UniswapCard'
import { AaveCard } from '@/components/positions/AaveCard'
import { CompoundCard } from '@/components/positions/CompoundCard'
import { SkeletonCard } from '@/components/dashboard/SkeletonCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import dynamic from 'next/dynamic'
import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'

const RiskScanner = dynamic(
	() => import('@/components/risk/RiskScanner').then(m => m.RiskScanner),
	{ ssr: false },
)

type Filter = 'all' | 'uniswap' | 'aave' | 'compound'

const FILTERS: { key: Filter; label: string; icon: string }[] = [
	{ key: 'all', label: 'All', icon: '' },
	{ key: 'uniswap', label: 'Uniswap', icon: '🦄' },
	{ key: 'aave', label: 'Aave', icon: '👻' },
	{ key: 'compound', label: 'Compound', icon: '🏦' },
]

export default function PositionsPage() {
	const { isConnected } = useWallet()
	const { data: portfolio, isLoading, error } = usePortfolio()
	const [active, setActive] = useState<Filter>('all')

	const counts: Record<string, number> = { uniswap: 0, aave: 0, compound: 0 }
	portfolio?.positions.forEach(p => {
		counts[p.protocol] = (counts[p.protocol] ?? 0) + 1
	})

	const filtered = !portfolio?.positions
		? []
		: active === 'all'
			? portfolio.positions
			: portfolio.positions.filter(p => p.protocol === active)

	if (!isConnected) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					gap: 16,
					padding: 24,
				}}
			>
				<div style={{ fontSize: 40, marginBottom: 4 }}>⬡</div>
				<h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
					Connect your wallet
				</h2>
				<p
					style={{
						fontSize: 14,
						color: 'var(--text-secondary)',
						marginBottom: 8,
					}}
				>
					Connect to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div style={{ padding: 24 }} className='fade-in'>
				<div
					style={{ height: 28, width: 160, marginBottom: 6 }}
					className='skeleton'
				/>
				<div
					style={{ height: 14, width: 240, marginBottom: 24 }}
					className='skeleton'
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
						gap: 14,
					}}
				>
					{[0, 1, 2].map(i => (
						<SkeletonCard key={i} lines={4} />
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
					padding: 24,
				}}
			>
				<p style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
					Failed to load positions
				</p>
			</div>
		)
	}

	const totalProtocols = Object.values(counts).filter(Boolean).length

	return (
		<div className='fade-in' style={{ padding: 24 }}>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 20,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 24,
							fontWeight: 900,
							color: 'var(--text-primary)',
							letterSpacing: '-0.8px',
							marginBottom: 3,
						}}
					>
						Positions
					</h1>
					<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
						{portfolio?.positions.length ?? 0} open positions across{' '}
						{totalProtocols} protocols
					</p>
				</div>
				<button
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						padding: '9px 18px',
						borderRadius: 10,
						fontSize: 13,
						fontWeight: 800,
						background: 'linear-gradient(135deg,var(--accent-purple),#5b44d4)',
						color: '#fff',
						border: 'none',
						cursor: 'pointer',
						boxShadow: '0 0 16px rgba(123,97,255,0.3)',
					}}
				>
					+ Add Position
				</button>
			</div>

			{/* Filter pills */}
			<div
				style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}
			>
				{FILTERS.map(f => {
					const isActive = active === f.key
					const count =
						f.key === 'all' ? (portfolio?.positions.length ?? 0) : counts[f.key]
					return (
						<button
							key={f.key}
							onClick={() => setActive(f.key)}
							style={{
								padding: '5px 14px',
								borderRadius: 20,
								fontSize: 12,
								fontWeight: isActive ? 700 : 500,
								background: isActive
									? 'rgba(123,97,255,0.15)'
									: 'rgba(255,255,255,0.03)',
								border: `1px solid ${isActive ? 'rgba(123,97,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
								color: isActive ? '#fff' : 'var(--text-secondary)',
								cursor: 'pointer',
								transition: 'all 0.15s',
								display: 'flex',
								alignItems: 'center',
								gap: 5,
							}}
						>
							{f.icon && <span style={{ fontSize: 11 }}>{f.icon}</span>}
							{f.label}
							<span
								style={{
									fontSize: 10,
									fontWeight: 800,
									padding: '1px 6px',
									borderRadius: 10,
									background: isActive
										? 'rgba(255,255,255,0.15)'
										: 'rgba(255,255,255,0.06)',
									color: isActive ? '#fff' : 'var(--text-tertiary)',
								}}
							>
								{count}
							</span>
						</button>
					)
				})}
			</div>

			{/* Cards */}
			{filtered.length === 0 ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: '60px 0',
						color: 'var(--text-tertiary)',
					}}
				>
					<p style={{ fontSize: 32, marginBottom: 10 }}>⬡</p>
					<p style={{ fontSize: 13 }}>
						No {active === 'all' ? '' : active} positions found
					</p>
				</div>
			) : (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
						gap: 14,
						marginBottom: 24,
					}}
				>
					{filtered.map((position: DeFiPosition) => {
						if (position.protocol === 'uniswap')
							return (
								<UniswapCard
									key={position.id}
									position={position as UniswapPosition}
								/>
							)
						if (position.protocol === 'aave')
							return (
								<AaveCard
									key={position.id}
									position={position as AavePosition}
								/>
							)
						if (position.protocol === 'compound')
							return (
								<CompoundCard
									key={position.id}
									position={position as CompoundPosition}
								/>
							)
						return null
					})}
				</div>
			)}

			{/* Risk Scanner */}
			<RiskScanner />
		</div>
	)
}
