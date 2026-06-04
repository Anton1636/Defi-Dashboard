'use client'

import { useState, useMemo } from 'react'
import {
	generateLiquidityData,
	getLiquidityColor,
	formatPrice,
} from '@/lib/liquidityData'
import { usePortfolio } from '@/hooks/usePortfolio'
import { usePriceStore } from '@/store/priceStore'
import type { UniswapPosition } from '@/types'

const DEPTH_ZONES = [
	{ label: 'Deep', min: 0.75, color: 'rgba(74,222,128,.8)' },
	{ label: 'Medium', min: 0.4, color: 'rgba(74,222,128,.5)' },
	{ label: 'Shallow', min: 0.15, color: 'rgba(0,209,255,.5)' },
	{ label: 'Low', min: 0, color: 'rgba(0,209,255,.25)' },
]

function depthLabel(liq: number) {
	return (
		DEPTH_ZONES.find(z => liq >= z.min) ?? DEPTH_ZONES[DEPTH_ZONES.length - 1]
	)
}

interface BarTooltip {
	bucket: ReturnType<typeof generateLiquidityData>['buckets'][0]
	x: number
	y: number
}

interface LiquidityHeatMapProps {
	pair?: string
	feeTier?: string
}

export function LiquidityHeatMap({
	pair = 'ETH/USDC',
	feeTier = '0.3%',
}: LiquidityHeatMapProps) {
	const { data: portfolio } = usePortfolio()
	const prices = usePriceStore(s => s.prices)
	const [tooltip, setTooltip] = useState<BarTooltip | null>(null)
	const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

	const ethPrice = prices.ETH?.price ?? 3245

	const uniPos = portfolio?.positions.find(p => p.protocol === 'uniswap') as
		| UniswapPosition
		| undefined

	const data = useMemo(
		() =>
			generateLiquidityData(
				ethPrice,
				uniPos ? ethPrice * 0.89 : ethPrice * 0.88,
				uniPos ? ethPrice * 1.11 : ethPrice * 1.12,
				pair,
				feeTier,
				30,
			),
		[ethPrice, uniPos, pair, feeTier],
	)

	const coveragePct = useMemo(() => {
		const inRange = data.buckets.filter(b => b.inRange)
		const peakInRange = inRange.filter(b => b.liquidity >= 0.75)
		const totalPeak = data.buckets.filter(b => b.liquidity >= 0.75)
		return totalPeak.length > 0
			? Math.round((peakInRange.length / totalPeak.length) * 100)
			: 0
	}, [data])

	const dailyFees = uniPos ? uniPos.feesEarned / 30 : 23.45

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				gap: 0,
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '16px 20px 12px',
					borderBottom: '1px solid var(--border-1)',
					flexWrap: 'wrap',
					gap: 10,
					flexShrink: 0,
				}}
			>
				<div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 3,
						}}
					>
						<p
							style={{
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
							}}
						>
							{data.pair}
						</p>
						<span
							style={{
								padding: '2px 8px',
								borderRadius: 20,
								background: 'var(--surface-3)',
								border: '1px solid var(--border-1)',
								fontSize: 10,
								color: 'var(--text-tertiary)',
								fontWeight: 600,
							}}
						>
							{data.feeTier}
						</span>
						<span
							style={{
								padding: '2px 8px',
								borderRadius: 20,
								background: 'rgba(74,222,128,.1)',
								border: '1px solid rgba(74,222,128,.2)',
								fontSize: 10,
								color: 'var(--accent-green)',
								fontWeight: 700,
							}}
						>
							● In range
						</span>
					</div>
					<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
						Liquidity depth · hover bars to explore
					</p>
				</div>
				<div
					style={{
						background: 'rgba(0,209,255,.08)',
						border: '1px solid rgba(0,209,255,.2)',
						borderRadius: 10,
						padding: '7px 14px',
					}}
				>
					<p
						style={{
							fontSize: 9,
							color: 'var(--accent-blue)',
							fontWeight: 700,
							letterSpacing: '.08em',
							marginBottom: 1,
						}}
					>
						CURRENT PRICE
					</p>
					<p
						style={{
							fontSize: 16,
							fontWeight: 900,
							color: 'var(--accent-blue)',
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{formatPrice(data.currentPrice)}
					</p>
				</div>
			</div>

			{/* Main content */}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					minHeight: 0,
				}}
			>
				{/* Chart + sidebar */}
				<div
					className='liquidity-main-wrap'
					style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}
				>
					{/* Chart area */}
					<div
						className='liquidity-chart-area'
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							padding: '16px 16px 12px',
							minWidth: 0,
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						{/* Legend */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								marginBottom: 12,
								flexShrink: 0,
								flexWrap: 'wrap',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								<div
									style={{
										width: 12,
										height: 12,
										borderRadius: 2,
										background: 'rgba(74,222,128,.6)',
									}}
								/>
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 600,
									}}
								>
									Your LP range
								</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								<div
									style={{
										width: 12,
										height: 12,
										borderRadius: 2,
										background: 'rgba(0,209,255,.4)',
									}}
								/>
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 600,
									}}
								>
									Market liquidity
								</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								<div
									style={{
										width: 2,
										height: 12,
										borderRadius: 1,
										background: 'var(--accent-blue)',
									}}
								/>
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 600,
									}}
								>
									Current price
								</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								<div
									style={{
										width: 10,
										height: 10,
										borderRadius: 2,
										border: '1px dashed rgba(74,222,128,.5)',
									}}
								/>
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 600,
									}}
								>
									Your range boundary
								</span>
							</div>
						</div>

						{/* Chart */}
						<div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
							{/* Y axis */}
							<div
								style={{
									position: 'absolute',
									left: 0,
									top: 0,
									bottom: 24,
									width: 36,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									pointerEvents: 'none',
									zIndex: 2,
								}}
							>
								{['100%', '75%', '50%', '25%', '0%'].map(l => (
									<span
										key={l}
										style={{
											fontSize: 8,
											color: 'var(--text-tertiary)',
											textAlign: 'right',
											display: 'block',
											paddingRight: 4,
										}}
									>
										{l}
									</span>
								))}
							</div>

							{/* Bars container */}
							<div
								style={{
									position: 'absolute',
									left: 40,
									right: 0,
									top: 0,
									bottom: 24,
								}}
							>
								{/* Grid lines */}
								{[0, 25, 50, 75, 100].map(pct => (
									<div
										key={pct}
										style={{
											position: 'absolute',
											left: 0,
											right: 0,
											top: `${100 - pct}%`,
											height: 1,
											background: 'rgba(255,255,255,.04)',
											pointerEvents: 'none',
										}}
									/>
								))}

								{/* LP Range highlight */}
								{(() => {
									const total =
										data.buckets[data.buckets.length - 1].priceMax -
										data.buckets[0].priceMin
									const lowPct =
										((data.yourLow - data.buckets[0].priceMin) / total) * 100
									const highPct =
										((data.yourHigh - data.buckets[0].priceMin) / total) * 100
									return (
										<div
											style={{
												position: 'absolute',
												top: 0,
												bottom: 0,
												left: `${Math.max(0, lowPct)}%`,
												right: `${Math.max(0, 100 - highPct)}%`,
												background: 'rgba(74,222,128,.04)',
												borderLeft: '1px dashed rgba(74,222,128,.4)',
												borderRight: '1px dashed rgba(74,222,128,.4)',
												pointerEvents: 'none',
												zIndex: 1,
											}}
										>
											<div
												style={{
													position: 'absolute',
													top: 4,
													left: '50%',
													transform: 'translateX(-50%)',
													fontSize: 8,
													fontWeight: 800,
													color: 'rgba(74,222,128,.6)',
													whiteSpace: 'nowrap',
													background: 'rgba(5,6,10,.8)',
													padding: '1px 6px',
													borderRadius: 4,
												}}
											>
												🦄 Your LP
											</div>
										</div>
									)
								})()}

								{/* Current price line */}
								{(() => {
									const total =
										data.buckets[data.buckets.length - 1].priceMax -
										data.buckets[0].priceMin
									const pct =
										((data.currentPrice - data.buckets[0].priceMin) / total) *
										100
									return (
										<div
											style={{
												position: 'absolute',
												top: 0,
												bottom: 0,
												left: `${pct}%`,
												width: 2,
												background: 'var(--accent-blue)',
												boxShadow: '0 0 8px rgba(0,209,255,.6)',
												zIndex: 5,
												pointerEvents: 'none',
											}}
										>
											<div
												style={{
													position: 'absolute',
													top: 0,
													left: '50%',
													transform: 'translateX(-50%)',
													fontSize: 8,
													fontWeight: 800,
													color: 'var(--accent-blue)',
													whiteSpace: 'nowrap',
													background: 'rgba(5,6,10,.95)',
													padding: '2px 7px',
													borderRadius: 5,
													border: '1px solid rgba(0,209,255,.3)',
												}}
											>
												{formatPrice(data.currentPrice)}
											</div>
										</div>
									)
								})()}

								{/* Bars */}
								<div
									style={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'flex-end',
										gap: 2,
										padding: '0 1px',
									}}
								>
									{data.buckets.map((bucket, i) => {
										const isHovered = hoveredIdx === i
										const color = getLiquidityColor(
											bucket.liquidity,
											bucket.inRange,
										)
										return (
											<div
												key={i}
												style={{
													flex: 1,
													height: '100%',
													display: 'flex',
													alignItems: 'flex-end',
													cursor: 'pointer',
													position: 'relative',
												}}
												onMouseEnter={e => {
													setHoveredIdx(i)
													const rect = e.currentTarget.getBoundingClientRect()
													setTooltip({ bucket, x: rect.left, y: rect.top })
												}}
												onMouseLeave={() => {
													setHoveredIdx(null)
													setTooltip(null)
												}}
											>
												<div
													style={{
														width: '100%',
														height: `${Math.max(2, bucket.liquidity * 100)}%`,
														background: color,
														borderRadius: '3px 3px 0 0',
														transition: 'height .2s ease, filter .15s',
														filter: isHovered
															? 'brightness(1.4)'
															: 'brightness(1)',
														boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
													}}
												/>
											</div>
										)
									})}
								</div>
							</div>

							{/* X axis */}
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 40,
									right: 0,
									height: 22,
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'flex-end',
								}}
							>
								{[0, 6, 12, 18, 24, 29].map(i => (
									<span
										key={i}
										style={{
											fontSize: 8,
											color: 'var(--text-tertiary)',
											fontVariantNumeric: 'tabular-nums',
											fontWeight: 600,
										}}
									>
										{data.buckets[i]
											? formatPrice(data.buckets[i].priceMid)
											: ''}
									</span>
								))}
							</div>

							{/* Tooltip */}
							{tooltip && typeof window !== 'undefined' && (
								<div
									style={{
										position: 'fixed',
										left: Math.min(tooltip.x + 10, window.innerWidth - 180),
										top: Math.max(tooltip.y - 120, 10),
										background: 'rgba(5,6,10,.97)',
										border: '1px solid rgba(255,255,255,.12)',
										borderRadius: 10,
										padding: '10px 14px',
										zIndex: 100,
										pointerEvents: 'none',
										boxShadow: '0 8px 24px rgba(0,0,0,.6)',
										minWidth: 160,
									}}
								>
									<p
										style={{
											fontSize: 12,
											fontWeight: 800,
											color: '#fff',
											marginBottom: 7,
										}}
									>
										{formatPrice(tooltip.bucket.priceMin)} –{' '}
										{formatPrice(tooltip.bucket.priceMax)}
									</p>
									<div
										style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												fontSize: 11,
											}}
										>
											<span style={{ color: 'rgba(255,255,255,.4)' }}>
												Depth
											</span>
											<span
												style={{
													fontWeight: 700,
													color: depthLabel(tooltip.bucket.liquidity).color,
												}}
											>
												{depthLabel(tooltip.bucket.liquidity).label} ·{' '}
												{(tooltip.bucket.liquidity * 100).toFixed(0)}%
											</span>
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												fontSize: 11,
											}}
										>
											<span style={{ color: 'rgba(255,255,255,.4)' }}>
												In your range
											</span>
											<span
												style={{
													fontWeight: 700,
													color: tooltip.bucket.inRange
														? 'var(--accent-green)'
														: 'var(--text-tertiary)',
												}}
											>
												{tooltip.bucket.inRange ? 'Yes ✓' : 'No'}
											</span>
										</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												fontSize: 11,
											}}
										>
											<span style={{ color: 'rgba(255,255,255,.4)' }}>
												Est. fees/day
											</span>
											<span
												style={{
													fontWeight: 700,
													color: 'var(--accent-green)',
												}}
											>
												{tooltip.bucket.inRange
													? `+$${(tooltip.bucket.liquidity * dailyFees * 0.4).toFixed(2)}`
													: '—'}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right sidebar */}
					<div
						className='liquidity-sidebar'
						style={{
							width: 220,
							flexShrink: 0,
							borderLeft: '1px solid var(--border-1)',
							display: 'flex',
							flexDirection: 'column',
							overflowY: 'auto',
						}}
					>
						{/* Your position */}
						<div
							style={{
								padding: '14px 16px',
								borderBottom: '1px solid var(--border-1)',
							}}
						>
							<p
								style={{
									fontSize: 9,
									fontWeight: 800,
									color: 'var(--text-tertiary)',
									letterSpacing: '.14em',
									textTransform: 'uppercase',
									marginBottom: 10,
								}}
							>
								Your Position
							</p>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								{[
									{
										label: 'Value',
										val: `$${(uniPos?.valueUSD ?? 12400).toLocaleString()}`,
										col: 'var(--text-primary)',
									},
									{
										label: 'Range low',
										val: formatPrice(data.yourLow),
										col: 'var(--accent-green)',
									},
									{
										label: 'Range high',
										val: formatPrice(data.yourHigh),
										col: 'var(--accent-green)',
									},
									{
										label: 'Status',
										val: '● In range',
										col: 'var(--accent-green)',
									},
									{
										label: 'Fees 24h',
										val: `+$${dailyFees.toFixed(2)}`,
										col: 'var(--accent-green)',
									},
								].map(s => (
									<div
										key={s.label}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										<span
											style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
										>
											{s.label}
										</span>
										<span
											style={{ fontSize: 11, fontWeight: 700, color: s.col }}
										>
											{s.val}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Range visualizer */}
						<div
							style={{
								padding: '14px 16px',
								borderBottom: '1px solid var(--border-1)',
							}}
						>
							<p
								style={{
									fontSize: 9,
									fontWeight: 800,
									color: 'var(--text-tertiary)',
									letterSpacing: '.14em',
									textTransform: 'uppercase',
									marginBottom: 10,
								}}
							>
								Range Coverage
							</p>
							<div
								style={{
									height: 6,
									background: 'var(--surface-3)',
									borderRadius: 3,
									position: 'relative',
									marginBottom: 6,
									overflow: 'visible',
								}}
							>
								{(() => {
									const total =
										data.buckets[data.buckets.length - 1].priceMax -
										data.buckets[0].priceMin
									const lo =
										((data.yourLow - data.buckets[0].priceMin) / total) * 100
									const hi =
										((data.yourHigh - data.buckets[0].priceMin) / total) * 100
									const cur =
										((data.currentPrice - data.buckets[0].priceMin) / total) *
										100
									return (
										<>
											<div
												style={{
													position: 'absolute',
													left: `${lo}%`,
													width: `${hi - lo}%`,
													top: 0,
													height: '100%',
													background: 'rgba(74,222,128,.4)',
													borderRadius: 3,
												}}
											/>
											<div
												style={{
													position: 'absolute',
													left: `${cur}%`,
													top: -3,
													width: 2,
													height: 12,
													background: 'var(--accent-blue)',
													borderRadius: 1,
													transform: 'translateX(-50%)',
												}}
											/>
										</>
									)
								})()}
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: 9,
									color: 'var(--text-tertiary)',
								}}
							>
								<span>{formatPrice(data.buckets[0].priceMin)}</span>
								<span>
									{formatPrice(data.buckets[data.buckets.length - 1].priceMax)}
								</span>
							</div>
						</div>

						{/* Peak zone */}
						<div
							style={{
								padding: '14px 16px',
								borderBottom: '1px solid var(--border-1)',
							}}
						>
							<p
								style={{
									fontSize: 9,
									fontWeight: 800,
									color: 'var(--text-tertiary)',
									letterSpacing: '.14em',
									textTransform: 'uppercase',
									marginBottom: 10,
								}}
							>
								Peak Liquidity
							</p>
							<p
								style={{
									fontSize: 13,
									fontWeight: 800,
									color: 'var(--accent-purple)',
									marginBottom: 3,
								}}
							>
								{formatPrice(data.peakZone.min)} –{' '}
								{formatPrice(data.peakZone.max)}
							</p>
							<p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
								Highest concentration zone
							</p>
							<div
								style={{
									marginTop: 8,
									padding: '6px 10px',
									background: 'rgba(74,222,128,.06)',
									border: '1px solid rgba(74,222,128,.14)',
									borderRadius: 8,
								}}
							>
								<p
									style={{
										fontSize: 10,
										fontWeight: 700,
										color: 'var(--accent-green)',
									}}
								>
									{coveragePct}% peak coverage ✓
								</p>
							</div>
						</div>

						{/* AI Suggestion */}
						<div style={{ padding: '14px 16px', flex: 1 }}>
							<p
								style={{
									fontSize: 9,
									fontWeight: 800,
									color: 'var(--text-tertiary)',
									letterSpacing: '.14em',
									textTransform: 'uppercase',
									marginBottom: 10,
								}}
							>
								AI Suggestion
							</p>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-secondary)',
									lineHeight: 1.65,
								}}
							>
								Your range covers{' '}
								<span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
									{coveragePct}%
								</span>{' '}
								of the peak liquidity zone.
								{coveragePct >= 80
									? ' Excellent positioning — no action needed.'
									: coveragePct >= 60
										? ` Consider widening slightly toward ${formatPrice(data.peakZone.max)} to capture more fees.`
										: ` Range is partially outside peak zone. Rebalancing could increase fees by ~${Math.round((80 - coveragePct) * 0.3)}%.`}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom legend */}
			<div
				style={{
					padding: '8px 20px',
					borderTop: '1px solid var(--border-1)',
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					flexShrink: 0,
					flexWrap: 'wrap',
				}}
			>
				<span
					style={{
						fontSize: 9,
						color: 'var(--text-tertiary)',
						fontWeight: 600,
					}}
				>
					DEPTH:
				</span>
				{DEPTH_ZONES.map(z => (
					<div
						key={z.label}
						style={{ display: 'flex', alignItems: 'center', gap: 4 }}
					>
						<div
							style={{
								width: 10,
								height: 10,
								borderRadius: 2,
								background: z.color,
							}}
						/>
						<span
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 600,
							}}
						>
							{z.label}
						</span>
					</div>
				))}
				<div
					style={{
						marginLeft: 'auto',
						fontSize: 9,
						color: 'var(--text-tertiary)',
					}}
				>
					Uniswap V3 · {data.buckets.length} price buckets
				</div>
			</div>
		</div>
	)
}
