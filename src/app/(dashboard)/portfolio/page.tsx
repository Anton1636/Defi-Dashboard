'use client'

import { usePortfolio } from '@/hooks/usePortfolio'
import { useWallet } from '@/hooks/useWallet'
import { usePriceStore } from '@/store/priceStore'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { AavePosition, CompoundPosition } from '@/types'
import { PieChart, Pie, Cell } from 'recharts'
import { PortfolioChart } from '@/components/charts/PortfolioChart'

const OrbitalSystem = dynamic(
	() => import('@/components/orbital/OrbitalSystem').then(m => m.OrbitalSystem),
	{ ssr: false },
)
const LiquidityStreams = dynamic(
	() =>
		import('@/components/orbital/LiquidityStreams').then(
			m => m.LiquidityStreams,
		),
	{ ssr: false },
)
const PositionCapsule = dynamic(
	() =>
		import('@/components/orbital/PositionCapsule').then(m => m.PositionCapsule),
	{ ssr: false },
)

function fmt(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

const PROTOCOL_COLORS: Record<string, string> = {
	aave: '#7b61ff',
	uniswap: '#ff007a',
	compound: '#00d395',
}
const ALLOC_COLORS = [
	'#7b61ff',
	'#ff007a',
	'#00d395',
	'#fbbf24',
	'rgba(255,255,255,.3)',
]

const RECENT_ACTIVITY = [
	{
		icon: 'A',
		iconBg: 'rgba(123,97,255,.2)',
		title: 'Supplied ETH',
		sub: 'Aave V3',
		value: '+1.25 ETH',
		valueColor: '#4ade80',
		time: '2m ago',
	},
	{
		icon: 'C',
		iconBg: 'rgba(0,211,149,.2)',
		title: 'Claimed Rewards',
		sub: 'Compound V3',
		value: '+12.45 COMP',
		valueColor: '#4ade80',
		time: '15m ago',
	},
	{
		icon: 'U',
		iconBg: 'rgba(255,0,122,.2)',
		title: 'Swapped USDC to ETH',
		sub: 'Uniswap V3',
		value: '-1,000 USDC',
		valueColor: '#f87171',
		time: '30m ago',
	},
	{
		icon: 'A',
		iconBg: 'rgba(123,97,255,.2)',
		title: 'Borrowed DAI',
		sub: 'Aave V3',
		value: '+500 DAI',
		valueColor: '#4ade80',
		time: '1h ago',
	},
	{
		icon: 'N',
		iconBg: 'rgba(0,229,255,.2)',
		title: 'Rebalanced Portfolio',
		sub: 'AI Strategy',
		value: 'Completed',
		valueColor: '#4ade80',
		time: '2h ago',
	},
]

const AI_SIGNALS = [
	{
		icon: '🔄',
		iconBg: 'rgba(0,229,255,.1)',
		title: 'Rebalance Opportunity',
		sub: 'Move 15% from USDC to ETH on Aave V3',
		link: 'View Insight',
	},
	{
		icon: '📈',
		iconBg: 'rgba(123,97,255,.1)',
		title: 'High Yield Detected',
		sub: 'AAVE V3 supply APY is 4.50%',
		link: 'View Insight',
	},
	{
		icon: '🛡',
		iconBg: 'rgba(248,113,113,.1)',
		title: 'Risks Detected',
		sub: '1 position requires attention',
		link: 'View Insight',
	},
]

const SPARK_PATHS = [
	'M0,15 C15,12 30,8 50,10 C70,12 85,6 100,4',
	'M0,14 C15,18 30,10 50,16 C70,20 85,8 100,6',
	'M0,12 C15,9  30,14 50,8  C70,5  85,10 100,7',
	'M0,16 C15,11 30,7  50,12 C70,8  85,4  100,5',
	'M0,13 C15,16 30,11 50,14 C70,9  85,7  100,9',
]

/* ══════════════════════════════════════
   DESKTOP PORTFOLIO
══════════════════════════════════════ */
function DesktopPortfolio() {
	const { data: portfolio } = usePortfolio()
	const prices = usePriceStore(s => s.prices)
	const router = useRouter()
	const [assetTab, setAssetTab] = useState('All')
	const positions = useMemo(() => {
		return portfolio?.positions ?? []
	}, [portfolio?.positions])
	const totalValue = portfolio?.totalValueUSD ?? 0
	const seed = useMemo(() => {
		if (!positions.length) return []

		return positions.map((p, i) => {
			const hash = (p.protocol.length * 999 + i * 97) % 1000

			return {
				change: (hash % 100) / 100,
				direction: hash % 2,
			}
		})
	}, [positions])

	// Protocol allocation
	const protocolAlloc = positions.map((p, i) => ({
		name: p.protocol.charAt(0).toUpperCase() + p.protocol.slice(1) + ' V3',
		value: p.valueUSD,
		pct: totalValue > 0 ? ((p.valueUSD / totalValue) * 100).toFixed(1) : '0',
		color: PROTOCOL_COLORS[p.protocol] ?? '#888',
		change:
			seed[i]?.change > 0.3
				? +(seed[i].change * 5).toFixed(2)
				: -(seed[i].change * 2).toFixed(2),
		changeDollar: p.valueUSD * 0.05 * (seed[i]?.direction > 0.3 ? 1 : -1),
		icon: p.protocol === 'uniswap' ? '🦄' : p.protocol === 'aave' ? '👻' : '🏦',
	}))

	const allocData = [
		...protocolAlloc.map(p => ({ name: p.name, value: p.value })),
		{ name: 'Others', value: totalValue * 0.092 },
	]

	// Assets from positions + prices
	const assets = [
		{
			symbol: 'ETH',
			name: 'Ethereum',
			icon: 'Ξ',
			iconBg: 'rgba(98,126,234,.2)',
			iconColor: '#627eea',
			balance: `${positions.find(p => p.protocol === 'uniswap') ? 2.3512 : 0}`,
			value: prices.ETH?.price ? prices.ETH.price * 2.3512 : 6245,
			change: prices.ETH?.change24h ?? 3.25,
			alloc: 25.8,
			apy: 2.45,
		},
		{
			symbol: 'USDC',
			name: 'USD Coin',
			icon: '$',
			iconBg: 'rgba(39,117,202,.2)',
			iconColor: '#2775ca',
			balance: '4,250.00',
			value: 4250,
			change: 0.01,
			alloc: 17.5,
			apy: 4.5,
		},
		{
			symbol: 'DAI',
			name: 'Dai Stablecoin',
			icon: '◈',
			iconBg: 'rgba(249,176,28,.2)',
			iconColor: '#f9b01c',
			balance: '2,890.10',
			value: 2890,
			change: -0.02,
			alloc: 11.9,
			apy: 3.2,
		},
		{
			symbol: 'WBTC',
			name: 'Wrapped BTC',
			icon: '₿',
			iconBg: 'rgba(247,147,26,.2)',
			iconColor: '#f7931a',
			balance: '0.1254',
			value: 2890,
			change: 1.18,
			alloc: 11.9,
			apy: 1.85,
		},
		{
			symbol: 'USDT',
			name: 'Tether',
			icon: '₮',
			iconBg: 'rgba(38,161,123,.2)',
			iconColor: '#26a17b',
			balance: '1,980.00',
			value: 1980,
			change: 0.02,
			alloc: 8.2,
			apy: 3.15,
		},
	]

	return (
		<div
			style={{
				display: 'flex',
				height: 'calc(100vh - 84px)',
				overflow: 'hidden',
			}}
		>
			{/* CENTER — main content */}
			<div style={{ flex: 1, overflowY: 'auto', padding: '20px', minWidth: 0 }}>
				{/* Portfolio Chart */}
				<div style={{ marginBottom: 16 }}>
					<PortfolioChart
						totalValue={totalValue}
						positions={positions.map(p => ({
							protocol: p.protocol,
							valueUSD: p.valueUSD,
						}))}
					/>
				</div>
				{/* Protocol Allocation */}
				<div style={{ marginBottom: 16 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 10,
						}}
					>
						<p
							style={{
								fontSize: 14,
								fontWeight: 800,
								color: 'rgba(255,255,255,.7)',
							}}
						>
							Protocol Allocation
						</p>
						<button
							onClick={() => router.push('/positions')}
							style={{
								fontSize: 11,
								fontWeight: 700,
								color: 'var(--accent-blue)',
								background: 'transparent',
								border: 'none',
								cursor: 'pointer',
							}}
						>
							View All
						</button>
					</div>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
							gap: 10,
						}}
					>
						{protocolAlloc.map((p, i) => (
							<div
								key={p.name}
								style={{
									background: 'rgba(255,255,255,.02)',
									border: '1px solid rgba(255,255,255,.07)',
									borderRadius: 12,
									padding: 14,
									cursor: 'pointer',
									transition: 'all .2s',
								}}
								onMouseEnter={e => {
									e.currentTarget.style.borderColor = p.color + '44'
									e.currentTarget.style.transform = 'translateY(-2px)'
								}}
								onMouseLeave={e => {
									e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'
									e.currentTarget.style.transform = 'translateY(0)'
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 8,
										marginBottom: 8,
									}}
								>
									<div
										style={{
											width: 28,
											height: 28,
											borderRadius: 8,
											background: `${p.color}22`,
											border: `1px solid ${p.color}44`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 14,
										}}
									>
										{p.icon}
									</div>
									<div>
										<p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
											{p.name}
										</p>
										<p style={{ fontSize: 9, color: 'rgba(255,255,255,.35)' }}>
											{p.pct}%
										</p>
									</div>
								</div>
								<p
									style={{
										fontSize: 15,
										fontWeight: 800,
										color: '#fff',
										marginBottom: 2,
									}}
								>
									{fmt(p.value)}
								</p>
								<p
									style={{
										fontSize: 10,
										fontWeight: 700,
										color: p.changeDollar > 0 ? '#4ade80' : '#f87171',
									}}
								>
									{p.changeDollar > 0 ? '↑' : '↓'}{' '}
									{fmt(Math.abs(p.changeDollar))}
								</p>
								{/* Mini sparkline */}
								<svg
									viewBox='0 0 100 20'
									style={{
										width: '100%',
										height: 20,
										marginTop: 6,
										opacity: 0.7,
									}}
								>
									<path
										d={SPARK_PATHS[i % SPARK_PATHS.length]}
										fill='none'
										stroke={p.color}
										strokeWidth='1.5'
										strokeLinecap='round'
									/>
								</svg>
							</div>
						))}
						{/* Others */}
						<div
							style={{
								background: 'rgba(255,255,255,.02)',
								border: '1px solid rgba(255,255,255,.07)',
								borderRadius: 12,
								padding: 14,
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									marginBottom: 8,
								}}
							>
								<div
									style={{
										width: 28,
										height: 28,
										borderRadius: 8,
										background: 'rgba(255,255,255,.05)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 12,
									}}
								>
									···
								</div>
								<div>
									<p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
										Others
									</p>
									<p style={{ fontSize: 9, color: 'rgba(255,255,255,.35)' }}>
										9.2%
									</p>
								</div>
							</div>
							<p
								style={{
									fontSize: 15,
									fontWeight: 800,
									color: '#fff',
									marginBottom: 2,
								}}
							>
								{fmt(totalValue * 0.092)}
							</p>
							<p style={{ fontSize: 10, fontWeight: 700, color: '#4ade80' }}>
								↑ {fmt(totalValue * 0.092 * 0.025)}
							</p>
						</div>
					</div>
				</div>

				{/* Your Assets */}
				<div
					style={{
						background: 'rgba(255,255,255,.02)',
						border: '1px solid rgba(255,255,255,.07)',
						borderRadius: 16,
						padding: 16,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 12,
						}}
					>
						<div style={{ display: 'flex', gap: 2 }}>
							{['All', 'Supplied', 'Borrowed', 'Staked', 'LP Positions'].map(
								t => (
									<button
										key={t}
										onClick={() => setAssetTab(t)}
										style={{
											padding: '5px 12px',
											borderRadius: 16,
											fontSize: 11,
											fontWeight: assetTab === t ? 700 : 400,
											background:
												assetTab === t ? 'rgba(0,229,255,.1)' : 'transparent',
											border:
												assetTab === t
													? '1px solid rgba(0,229,255,.2)'
													: '1px solid transparent',
											color:
												assetTab === t
													? 'var(--accent-blue)'
													: 'rgba(255,255,255,.4)',
											cursor: 'pointer',
											transition: 'all .15s',
										}}
									>
										{t}
									</button>
								),
							)}
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 6,
									background: 'rgba(255,255,255,.04)',
									border: '1px solid rgba(255,255,255,.07)',
									borderRadius: 8,
									padding: '6px 12px',
								}}
							>
								<span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
									⌕
								</span>
								<span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>
									Search assets...
								</span>
							</div>
							<button
								style={{
									width: 30,
									height: 30,
									borderRadius: 7,
									background: 'rgba(255,255,255,.04)',
									border: '1px solid rgba(255,255,255,.07)',
									color: 'rgba(255,255,255,.4)',
									cursor: 'pointer',
									fontSize: 13,
								}}
							>
								↓
							</button>
							<button
								style={{
									width: 30,
									height: 30,
									borderRadius: 7,
									background: 'rgba(255,255,255,.04)',
									border: '1px solid rgba(255,255,255,.07)',
									color: 'rgba(255,255,255,.4)',
									cursor: 'pointer',
									fontSize: 13,
								}}
							>
								⚙
							</button>
						</div>
					</div>

					{/* Table header */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 30px',
							gap: 8,
							padding: '6px 10px',
							marginBottom: 4,
						}}
					>
						{[
							'Asset',
							'Balance',
							'Value',
							'24H Change',
							'Allocation',
							'APY / APR',
							'',
						].map((h, i) => (
							<p
								key={i}
								style={{
									fontSize: 10,
									fontWeight: 700,
									color: 'rgba(255,255,255,.25)',
									textTransform: 'uppercase',
									letterSpacing: '.08em',
									textAlign: i > 1 ? 'right' : 'left',
								}}
							>
								{h}
							</p>
						))}
					</div>

					{/* Table rows */}
					{assets.map(a => (
						<div
							key={a.symbol}
							style={{
								display: 'grid',
								gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 30px',
								gap: 8,
								padding: '10px 10px',
								borderRadius: 10,
								alignItems: 'center',
								cursor: 'pointer',
								transition: 'background .15s',
							}}
							onMouseEnter={e => {
								e.currentTarget.style.background = 'rgba(255,255,255,.03)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.background = 'transparent'
							}}
						>
							{/* Asset */}
							<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
								<div
									style={{
										width: 34,
										height: 34,
										borderRadius: '50%',
										background: a.iconBg,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 14,
										fontWeight: 800,
										color: a.iconColor,
										flexShrink: 0,
									}}
								>
									{a.icon}
								</div>
								<div>
									<p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
										{a.name}
									</p>
									<p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>
										{a.symbol}
									</p>
								</div>
							</div>
							{/* Balance */}
							<p
								style={{
									fontSize: 12,
									color: 'rgba(255,255,255,.7)',
									fontVariantNumeric: 'tabular-nums',
									textAlign: 'right',
								}}
							>
								{a.balance} {a.symbol}
							</p>
							{/* Value */}
							<p
								style={{
									fontSize: 12,
									fontWeight: 700,
									color: '#fff',
									textAlign: 'right',
									fontVariantNumeric: 'tabular-nums',
								}}
							>
								$
								{a.value.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
							{/* Change */}
							<p
								style={{
									fontSize: 12,
									fontWeight: 700,
									color: a.change >= 0 ? '#4ade80' : '#f87171',
									textAlign: 'right',
								}}
							>
								{a.change >= 0 ? '↑' : '↓'}
								{Math.abs(a.change).toFixed(2)}%
							</p>
							{/* Allocation bar */}
							<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								<div
									style={{
										flex: 1,
										height: 4,
										background: 'rgba(255,255,255,.08)',
										borderRadius: 2,
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											height: '100%',
											width: `${(a.alloc / 30) * 100}%`,
											background:
												'linear-gradient(90deg,var(--accent-purple),var(--accent-blue))',
											borderRadius: 2,
										}}
									/>
								</div>
								<p
									style={{
										fontSize: 10,
										color: 'rgba(255,255,255,.4)',
										minWidth: 30,
										textAlign: 'right',
									}}
								>
									{a.alloc}%
								</p>
							</div>
							{/* APY */}
							<p
								style={{
									fontSize: 12,
									fontWeight: 700,
									color: '#4ade80',
									textAlign: 'right',
								}}
							>
								{a.apy.toFixed(2)}%
							</p>
							{/* Menu */}
							<button
								style={{
									background: 'transparent',
									border: 'none',
									color: 'rgba(255,255,255,.25)',
									cursor: 'pointer',
									fontSize: 14,
								}}
							>
								⋮
							</button>
						</div>
					))}

					<button
						onClick={() => router.push('/positions')}
						style={{
							width: '100%',
							marginTop: 10,
							padding: '10px',
							borderRadius: 10,
							background: 'rgba(255,255,255,.03)',
							border: '1px solid rgba(255,255,255,.07)',
							color: 'rgba(255,255,255,.5)',
							fontSize: 12,
							fontWeight: 600,
							cursor: 'pointer',
							transition: 'all .15s',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
						}}
					>
						View All Assets ∨
					</button>
				</div>
			</div>

			{/* RIGHT PANEL */}
			<div
				style={{
					width: 280,
					flexShrink: 0,
					borderLeft: '1px solid rgba(255,255,255,.07)',
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					gap: 0,
				}}
			>
				{/* AI Insights */}
				<div
					style={{
						padding: 16,
						borderBottom: '1px solid rgba(255,255,255,.07)',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 12,
						}}
					>
						<p style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
							AI Insights
						</p>
						<span
							style={{
								fontSize: 10,
								fontWeight: 800,
								color: 'var(--accent-blue)',
								background: 'rgba(0,229,255,.1)',
								padding: '2px 7px',
								borderRadius: 10,
							}}
						>
							3 New
						</span>
					</div>
					{AI_SIGNALS.map(s => (
						<div
							key={s.title}
							style={{
								padding: '10px 0',
								borderBottom: '1px solid rgba(255,255,255,.05)',
							}}
						>
							<div style={{ display: 'flex', gap: 9, marginBottom: 4 }}>
								<div
									style={{
										width: 28,
										height: 28,
										borderRadius: 8,
										background: s.iconBg,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 13,
										flexShrink: 0,
									}}
								>
									{s.icon}
								</div>
								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 700,
											color: '#fff',
											marginBottom: 2,
										}}
									>
										{s.title}
									</p>
									<p
										style={{
											fontSize: 10,
											color: 'rgba(255,255,255,.4)',
											lineHeight: 1.4,
										}}
									>
										{s.sub}
									</p>
								</div>
								<span
									style={{
										marginLeft: 'auto',
										fontSize: 14,
										color: 'rgba(255,255,255,.2)',
										flexShrink: 0,
									}}
								>
									›
								</span>
							</div>
							<p
								style={{
									fontSize: 10,
									color: 'var(--accent-blue)',
									cursor: 'pointer',
									paddingLeft: 37,
									fontWeight: 700,
								}}
							>
								{s.link} ›
							</p>
						</div>
					))}
				</div>

				{/* Allocation donut */}
				<div
					style={{
						padding: 16,
						borderBottom: '1px solid rgba(255,255,255,.07)',
					}}
				>
					<p
						style={{
							fontSize: 13,
							fontWeight: 800,
							color: '#fff',
							marginBottom: 12,
						}}
					>
						Allocation
					</p>
					<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
						<div
							style={{
								position: 'relative',
								width: 90,
								height: 90,
								flexShrink: 0,
							}}
						>
							<PieChart width={90} height={90}>
								<Pie
									data={allocData}
									cx={40}
									cy={40}
									innerRadius={25}
									outerRadius={42}
									paddingAngle={2}
									dataKey='value'
									startAngle={90}
									endAngle={-270}
								>
									{allocData.map((_, i) => (
										<Cell
											key={i}
											fill={ALLOC_COLORS[i] ?? '#888'}
											strokeWidth={0}
										/>
									))}
								</Pie>
							</PieChart>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<p
									style={{
										fontSize: 8,
										color: 'rgba(255,255,255,.3)',
										lineHeight: 1,
									}}
								>
									Total
								</p>
								<p style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>
									{fmt(totalValue)}
								</p>
							</div>
						</div>
						<div style={{ flex: 1 }}>
							{[
								...protocolAlloc,
								{ name: 'Others', pct: '9.2', color: 'rgba(255,255,255,.3)' },
							].map((p, i) => (
								<div
									key={p.name}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										marginBottom: 5,
									}}
								>
									<div
										style={{
											width: 8,
											height: 8,
											borderRadius: 2,
											background: ALLOC_COLORS[i],
											flexShrink: 0,
										}}
									/>
									<span
										style={{
											fontSize: 10,
											color: 'rgba(255,255,255,.5)',
											flex: 1,
										}}
									>
										{p.name}
									</span>
									<span
										style={{
											fontSize: 10,
											fontWeight: 700,
											color: 'rgba(255,255,255,.7)',
										}}
									>
										{p.pct}%
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div
					style={{
						padding: 16,
						borderBottom: '1px solid rgba(255,255,255,.07)',
						flex: 1,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 12,
						}}
					>
						<p style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
							Recent Activity
						</p>
						<span
							style={{
								fontSize: 10,
								color: 'var(--accent-blue)',
								fontWeight: 700,
								cursor: 'pointer',
							}}
						>
							View All
						</span>
					</div>
					{RECENT_ACTIVITY.map((a, i) => (
						<div
							key={i}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 9,
								marginBottom: 10,
							}}
						>
							<div
								style={{
									width: 28,
									height: 28,
									borderRadius: 8,
									background: a.iconBg,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 11,
									fontWeight: 800,
									color: '#fff',
									flexShrink: 0,
								}}
							>
								{a.icon}
							</div>
							<div style={{ flex: 1, minWidth: 0 }}>
								<p
									style={{
										fontSize: 11,
										fontWeight: 700,
										color: '#fff',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{a.title}
								</p>
								<p style={{ fontSize: 9, color: 'rgba(255,255,255,.35)' }}>
									{a.sub}
								</p>
							</div>
							<div style={{ textAlign: 'right', flexShrink: 0 }}>
								<p
									style={{ fontSize: 10, fontWeight: 700, color: a.valueColor }}
								>
									{a.value}
								</p>
								<p style={{ fontSize: 9, color: 'rgba(255,255,255,.25)' }}>
									{a.time}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Ask NEXORA AI */}
				<div
					style={{
						margin: 12,
						background:
							'linear-gradient(135deg,rgba(0,229,255,.08),rgba(123,97,255,.08))',
						border: '1px solid rgba(0,229,255,.15)',
						borderRadius: 12,
						padding: 14,
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						gap: 10,
					}}
				>
					<div
						style={{
							width: 32,
							height: 32,
							borderRadius: '50%',
							background:
								'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 15,
							flexShrink: 0,
						}}
					>
						◎
					</div>
					<div style={{ flex: 1 }}>
						<p
							style={{
								fontSize: 10,
								color: 'rgba(255,255,255,.45)',
								marginBottom: 2,
							}}
						>
							Need help with your portfolio?
						</p>
						<p
							style={{
								fontSize: 12,
								fontWeight: 800,
								color: 'var(--accent-blue)',
							}}
						>
							Ask NEXORA AI
						</p>
					</div>
					<span style={{ fontSize: 16, color: 'rgba(255,255,255,.3)' }}>›</span>
				</div>
			</div>
		</div>
	)
}

/* ══════════════════════════════════════
   MOBILE PORTFOLIO
══════════════════════════════════════ */
function MobilePortfolio() {
	const { data: portfolio } = usePortfolio()
	const router = useRouter()
	const positions = portfolio?.positions ?? []
	const totalValue = portfolio?.totalValueUSD ?? 0
	const change = portfolio?.change24hPercent ?? 0
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
		<div style={{ paddingBottom: 80 }}>
			{/* Mobile top header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '12px 16px',
					borderBottom: '1px solid rgba(255,255,255,.07)',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: '50%',
							border: '1.5px solid rgba(0,229,255,.5)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: 'var(--accent-blue)',
							}}
						/>
					</div>
					<div style={{ display: 'flex', gap: 16 }}>
						<span
							style={{
								fontSize: 13,
								fontWeight: 800,
								color: '#fff',
								borderBottom: '2px solid var(--accent-blue)',
								paddingBottom: 2,
							}}
						>
							Portfolio
						</span>
						<span
							style={{
								fontSize: 13,
								fontWeight: 500,
								color: 'rgba(255,255,255,.35)',
								cursor: 'pointer',
							}}
							onClick={() => router.push('/positions')}
						>
							Positions
						</span>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						background: 'rgba(123,97,255,.08)',
						border: '1px solid rgba(123,97,255,.2)',
						borderRadius: 20,
						padding: '5px 10px',
					}}
				>
					<div
						style={{
							width: 14,
							height: 14,
							borderRadius: '50%',
							background:
								'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
						}}
					/>
					<span
						style={{
							fontSize: 11,
							color: 'rgba(255,255,255,.7)',
							fontFamily: 'monospace',
						}}
					>
						0x7f…a3c2
					</span>
					<div
						style={{
							width: 5,
							height: 5,
							borderRadius: '50%',
							background: '#4ade80',
						}}
					/>
				</div>
			</div>

			{/* Orbital Hero */}
			<div
				style={{ background: 'rgba(255,255,255,.01)', padding: '16px 16px 0' }}
			>
				<p
					style={{
						fontSize: 9,
						fontWeight: 800,
						color: 'rgba(255,255,255,.3)',
						letterSpacing: '.2em',
						textAlign: 'center',
						marginBottom: 8,
					}}
				>
					PORTFOLIO CORE
				</p>
				<p
					style={{
						fontSize: 36,
						fontWeight: 900,
						letterSpacing: '-1.5px',
						color: '#fff',
						textAlign: 'center',
						lineHeight: 1,
					}}
				>
					${Math.floor(totalValue).toLocaleString('en-US')}
					<span
						style={{
							fontSize: 18,
							fontWeight: 500,
							color: 'rgba(255,255,255,.5)',
						}}
					>
						.{String(Math.round((totalValue % 1) * 100)).padStart(2, '0')}
					</span>
				</p>
				<p
					style={{
						fontSize: 14,
						fontWeight: 700,
						color: '#4ade80',
						textAlign: 'center',
						marginTop: 4,
						marginBottom: 4,
					}}
				>
					↑ {Math.abs(change).toFixed(2)}% (24h)
				</p>
			</div>

			{/* Orbital System */}
			<OrbitalSystem
				positions={positions}
				totalValue={totalValue}
				change24h={change}
				bestAPY={bestAPY}
			/>

			{/* Pagination dots */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: 6,
					marginTop: -8,
					marginBottom: 16,
				}}
			>
				<div
					style={{
						width: 20,
						height: 4,
						borderRadius: 2,
						background: 'var(--accent-purple)',
					}}
				/>
				<div
					style={{
						width: 6,
						height: 4,
						borderRadius: 2,
						background: 'rgba(255,255,255,.2)',
					}}
				/>
				<div
					style={{
						width: 6,
						height: 4,
						borderRadius: 2,
						background: 'rgba(255,255,255,.2)',
					}}
				/>
			</div>

			{/* Liquidity Streams */}
			<div style={{ margin: '0 14px 12px' }}>
				<LiquidityStreams />
			</div>

			{/* AI Signals */}
			<div
				style={{
					margin: '0 14px',
					background: 'rgba(255,255,255,.02)',
					border: '1px solid rgba(255,255,255,.07)',
					borderRadius: 14,
					padding: 14,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 12,
					}}
				>
					<p
						style={{
							fontSize: 11,
							fontWeight: 800,
							color: 'rgba(255,255,255,.5)',
							letterSpacing: '.14em',
							textTransform: 'uppercase',
						}}
					>
						AI SIGNALS
					</p>
					<span
						style={{
							fontSize: 11,
							fontWeight: 800,
							color: 'var(--accent-purple)',
						}}
					>
						3 New
					</span>
				</div>
				{AI_SIGNALS.slice(0, 2).map(s => (
					<div
						key={s.title}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							padding: '10px 0',
							borderBottom: '1px solid rgba(255,255,255,.06)',
						}}
					>
						<div
							style={{
								width: 36,
								height: 36,
								borderRadius: 10,
								background: s.iconBg,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 16,
								flexShrink: 0,
							}}
						>
							{s.icon}
						</div>
						<div style={{ flex: 1 }}>
							<p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
								{s.title}
							</p>
							<p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
								{s.sub}
							</p>
						</div>
						<span style={{ fontSize: 16, color: 'rgba(255,255,255,.25)' }}>
							›
						</span>
					</div>
				))}
			</div>

			{/* Position Capsules */}
			<div style={{ margin: '12px 14px 0' }}>
				<p
					style={{
						fontSize: 9,
						fontWeight: 800,
						color: 'rgba(255,255,255,.3)',
						letterSpacing: '.18em',
						marginBottom: 10,
					}}
				>
					POSITION CAPSULES
				</p>
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
				</div>
			</div>
		</div>
	)
}

/* ══════════════════════════════════════
   MAIN PAGE — switches by screen size
══════════════════════════════════════ */
export default function PortfolioPage() {
	const { isConnected } = useWallet()

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
						width: 56,
						height: 56,
						borderRadius: '50%',
						border: '1.5px solid rgba(0,229,255,.4)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 24,
					}}
				>
					◈
				</div>
				<h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.5px' }}>
					Track your DeFi portfolio
				</h2>
				<p
					style={{
						fontSize: 14,
						color: 'rgba(255,255,255,.5)',
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

	return (
		<>
			{/* Desktop */}
			<div
				className='fade-in'
				style={{ display: 'none' }}
				id='desktop-portfolio'
			>
				<DesktopPortfolio />
			</div>
			{/* Mobile */}
			<div className='fade-in' id='mobile-portfolio'>
				<MobilePortfolio />
			</div>
			{/* CSS switcher */}
			<style>{`
				@media(min-width:1025px){
					#desktop-portfolio{display:block!important}
					#mobile-portfolio{display:none!important}
				}
				@media(max-width:1024px){
					#desktop-portfolio{display:none!important}
					#mobile-portfolio{display:block!important}
				}
			`}</style>
		</>
	)
}
