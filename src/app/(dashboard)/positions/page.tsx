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
				<div style={{ fontSize: 40 }}>⬡</div>
				<h2
					style={{
						fontSize: 20,
						fontWeight: 800,
						letterSpacing: '-.5px',
						color: 'var(--text-primary)',
					}}
				>
					Connect your wallet
				</h2>
				<p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
					Connect to see your DeFi positions
				</p>
				<ConnectButton />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='layout-analytics fade-in'>
				<div
					style={{ height: 28, width: 140, marginBottom: 6 }}
					className='skeleton'
				/>
				<div
					style={{ height: 14, width: 220, marginBottom: 22 }}
					className='skeleton'
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
						gap: 12,
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
		<div className='layout-analytics fade-in'>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 20,
					flexWrap: 'wrap',
					gap: 10,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 22,
							fontWeight: 900,
							color: 'var(--text-primary)',
							letterSpacing: '-.8px',
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
						borderRadius: 'var(--card-radius-sm)',
						fontSize: 12,
						fontWeight: 800,
						background: 'linear-gradient(135deg,var(--accent-purple),#5b44d4)',
						color: '#fff',
						border: 'none',
						cursor: 'pointer',
						boxShadow: 'var(--glow-purple)',
					}}
				>
					+ Add Position
				</button>
			</div>

			{/* Filter pills */}
			<div
				className='filter-pills-wrap'
				style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}
			>
				{FILTERS.map(f => {
					const isAct = active === f.key
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
								fontWeight: isAct ? 700 : 400,
								background: isAct ? 'rgba(123,97,255,.15)' : 'var(--surface-1)',
								border: `1px solid ${isAct ? 'rgba(123,97,255,.35)' : 'var(--border-1)'}`,
								color: isAct ? '#fff' : 'var(--text-secondary)',
								cursor: 'pointer',
								transition: 'all .15s',
								display: 'flex',
								alignItems: 'center',
								gap: 5,
							}}
						>
							{f.icon && <span style={{ fontSize: 11 }}>{f.icon}</span>}
							{f.label}
							<span
								style={{
									fontSize: 9,
									fontWeight: 800,
									padding: '1px 6px',
									borderRadius: 10,
									background: isAct
										? 'rgba(255,255,255,.15)'
										: 'var(--surface-3)',
									color: isAct ? '#fff' : 'var(--text-tertiary)',
								}}
							>
								{count}
							</span>
						</button>
					)
				})}
			</div>

			{/* Cards grid */}
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
					className='positions-grid'
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
						gap: 12,
						marginBottom: 20,
					}}
				>
					{filtered.map((pos: DeFiPosition) => {
						if (pos.protocol === 'uniswap')
							return (
								<UniswapCard key={pos.id} position={pos as UniswapPosition} />
							)
						if (pos.protocol === 'aave')
							return <AaveCard key={pos.id} position={pos as AavePosition} />
						if (pos.protocol === 'compound')
							return (
								<CompoundCard key={pos.id} position={pos as CompoundPosition} />
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
