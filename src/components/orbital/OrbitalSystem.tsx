'use client'

import { useRef, useEffect, useState } from 'react'
import type {
	DeFiPosition,
	AavePosition,
	CompoundPosition,
	UniswapPosition,
} from '@/types'

function formatUSD(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

interface PlanetCfg {
	icon: string
	size: number
	bgGlow: string
	border: string
	radius: number
	duration: string
	reverse: boolean
	delay: string
}

const PLANET_MAP: Record<string, PlanetCfg> = {
	uniswap: {
		icon: '🦄',
		size: 88,
		bgGlow: 'rgba(255,0,122,0.18)',
		border: 'rgba(255,0,122,0.4)',
		radius: 120,
		duration: '40s',
		reverse: false,
		delay: '0s',
	},
	aave: {
		icon: '👻',
		size: 74,
		bgGlow: 'rgba(123,97,255,0.18)',
		border: 'rgba(123,97,255,0.4)',
		radius: 175,
		duration: '65s',
		reverse: true,
		delay: '-22s',
	},
	compound: {
		icon: '🏦',
		size: 62,
		bgGlow: 'rgba(0,211,149,0.18)',
		border: 'rgba(0,211,149,0.4)',
		radius: 228,
		duration: '85s',
		reverse: false,
		delay: '-40s',
	},
}

const PARTICLES = [
	{
		orbit: 120,
		angle: 0,
		color: 'rgba(0,229,255,0.55)',
		dur: '40s',
		delay: '0s',
	},
	{
		orbit: 120,
		angle: 120,
		color: 'rgba(0,229,255,0.35)',
		dur: '40s',
		delay: '-13s',
	},
	{
		orbit: 120,
		angle: 240,
		color: 'rgba(0,229,255,0.2)',
		dur: '40s',
		delay: '-27s',
	},
	{
		orbit: 175,
		angle: 0,
		color: 'rgba(123,97,255,0.5)',
		dur: '65s',
		delay: '0s',
	},
	{
		orbit: 175,
		angle: 180,
		color: 'rgba(123,97,255,0.3)',
		dur: '65s',
		delay: '-32s',
	},
	{
		orbit: 228,
		angle: 60,
		color: 'rgba(124,255,107,0.4)',
		dur: '85s',
		delay: '0s',
	},
	{
		orbit: 228,
		angle: 240,
		color: 'rgba(124,255,107,0.25)',
		dur: '85s',
		delay: '-42s',
	},
]

function getMetrics(pos: DeFiPosition) {
	if (pos.protocol === 'uniswap') {
		const p = pos as UniswapPosition
		return {
			label1: 'Fees 24h',
			val1: `+$${p.feesEarned.toFixed(2)}`,
			label2: 'Status',
			val2: p.inRange ? 'In range' : 'Out of range',
			label3: 'Pair',
			val3: `${p.token0.symbol}/${p.token1.symbol}`,
			col1: 'var(--accent-lime)',
		}
	}
	if (pos.protocol === 'aave') {
		const p = pos as AavePosition
		const hfColor =
			p.healthFactor > 2
				? 'var(--accent-lime)'
				: p.healthFactor > 1.5
					? 'var(--accent-amber)'
					: 'var(--accent-red)'
		return {
			label1: 'Net APY',
			val1: `${p.netAPY.toFixed(2)}%`,
			label2: 'Health',
			val2: `HF ${p.healthFactor.toFixed(2)}`,
			label3: 'Debt',
			val3: formatUSD(p.totalDebtUSD),
			col1: 'var(--accent-lime)',
			col2: hfColor,
		}
	}
	if (pos.protocol === 'compound') {
		const p = pos as CompoundPosition
		return {
			label1: 'Supply APR',
			val1: `${p.supplyAPR.toFixed(2)}%`,
			label2: 'Market',
			val2: p.market,
			label3: 'Daily earn',
			val3: `+$${((p.supplied * p.supplyAPR) / 100 / 365).toFixed(2)}`,
			col1: 'var(--compound)',
		}
	}
	return {
		label1: '',
		val1: '',
		label2: '',
		val2: '',
		label3: '',
		val3: '',
		col1: '#fff',
	}
}

function Planet({ position, cfg }: { position: DeFiPosition; cfg: PlanetCfg }) {
	const [hovered, setHovered] = useState(false)
	const metrics = getMetrics(position)
	const name = position.protocol.toUpperCase()

	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				width: 0,
				height: 0,
				animation: `orbitRotate ${cfg.duration} linear infinite${cfg.reverse ? ' reverse' : ''}`,
				animationDelay: cfg.delay,
				willChange: 'transform',
			}}
		>
			<div
				style={{
					position: 'absolute',
					transform: `translateX(${cfg.radius}px) translate(-50%,-50%)`,
					width: cfg.size,
					height: cfg.size,
					borderRadius: '50%',
					background: `radial-gradient(circle,${cfg.bgGlow} 0%,transparent 70%)`,
					border: `1px solid ${cfg.border}`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
					zIndex: hovered ? 30 : 15,
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						animation: `spinCCW ${cfg.duration} linear infinite${cfg.reverse ? ' reverse' : ''}`,
						animationDelay: cfg.delay,
					}}
				>
					<span
						style={{
							fontSize: cfg.size > 80 ? 20 : cfg.size > 70 ? 17 : 14,
							lineHeight: 1,
						}}
					>
						{cfg.icon}
					</span>
					<span
						style={{
							fontSize: 8,
							fontWeight: 800,
							color: 'rgba(255,255,255,0.8)',
							letterSpacing: '0.04em',
							marginTop: 2,
						}}
					>
						{name}
					</span>
					<span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>
						{formatUSD(position.valueUSD)}
					</span>
				</div>

				{/* Hover tooltip */}
				{hovered && (
					<div
						style={{
							position: 'absolute',
							bottom: `calc(100% + 10px)`,
							left: '50%',
							transform: 'translateX(-50%)',
							background: 'rgba(5,6,10,0.97)',
							border: '1px solid rgba(255,255,255,0.12)',
							borderRadius: 12,
							padding: '12px 14px',
							width: 148,
							pointerEvents: 'none',
							zIndex: 50,
							boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
							animation: 'fadeIn 0.15s ease-out',
						}}
					>
						<p
							style={{
								fontSize: 12,
								fontWeight: 800,
								color: '#fff',
								marginBottom: 8,
							}}
						>
							{cfg.icon}{' '}
							{position.protocol.charAt(0).toUpperCase() +
								position.protocol.slice(1)}{' '}
							V3
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: 10,
								}}
							>
								<span style={{ color: 'var(--text-tertiary)' }}>Value</span>
								<span style={{ color: '#fff', fontWeight: 700 }}>
									{formatUSD(position.valueUSD)}
								</span>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: 10,
								}}
							>
								<span style={{ color: 'var(--text-tertiary)' }}>
									{metrics.label1}
								</span>
								<span style={{ color: metrics.col1, fontWeight: 700 }}>
									{metrics.val1}
								</span>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: 10,
								}}
							>
								<span style={{ color: 'var(--text-tertiary)' }}>
									{metrics.label2}
								</span>
								<span
									style={{ color: metrics.col2 ?? '#fff', fontWeight: 700 }}
								>
									{metrics.val2}
								</span>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									fontSize: 10,
								}}
							>
								<span style={{ color: 'var(--text-tertiary)' }}>
									{metrics.label3}
								</span>
								<span
									style={{ color: 'var(--text-secondary)', fontWeight: 600 }}
								>
									{metrics.val3}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

interface Props {
	positions: DeFiPosition[]
	totalValue: number
	change24h: number
	bestAPY: number
}

export function OrbitalSystem({
	positions,
	totalValue,
	change24h,
	bestAPY,
}: Props) {
	const areaRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (document.getElementById('nexora-spin-ccw')) return
		const style = document.createElement('style')
		style.id = 'nexora-spin-ccw'
		style.textContent =
			'@keyframes spinCCW { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }'
		document.head.appendChild(style)
	}, [])
	const sysRef = useRef<HTMLDivElement>(null)

	/* Mouse parallax — desktop only */
	useEffect(() => {
		const area = areaRef.current
		if (!area) return

		const isMobile = () => window.innerWidth < 1025

		const onMove = (e: MouseEvent) => {
			if (isMobile()) return
			const sys = sysRef.current
			if (!sys) return
			const r = area.getBoundingClientRect()
			const x = (e.clientX - r.left - r.width / 2) / r.width
			const y = (e.clientY - r.top - r.height / 2) / r.height
			sys.style.transform = `translate(${x * 12}px, ${y * 8}px)`
			sys.style.transition = 'transform 0.08s ease-out'
		}

		const onLeave = () => {
			const sys = sysRef.current
			if (sys) {
				sys.style.transform = 'translate(0,0)'
				sys.style.transition = 'transform 0.6s ease-out'
			}
		}

		area.addEventListener('mousemove', onMove)
		area.addEventListener('mouseleave', onLeave)
		return () => {
			area.removeEventListener('mousemove', onMove)
			area.removeEventListener('mouseleave', onLeave)
		}
	}, [])

	/* Group positions by protocol */
	const planetPositions = positions.filter(p => PLANET_MAP[p.protocol])

	return (
		<div
			ref={areaRef}
			style={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				minHeight: 460,
			}}
		>
			{/* Background ambient glow */}
			<div
				style={{
					position: 'absolute',
					width: 600,
					height: 600,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(123,97,255,0.05) 0%,transparent 60%)',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 300,
					height: 300,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(0,229,255,0.03) 0%,transparent 60%)',
					top: '30%',
					left: '45%',
					pointerEvents: 'none',
				}}
			/>

			{/* Orbital system */}
			<div
				ref={sysRef}
				style={{
					position: 'relative',
					width: 500,
					height: 500,
					willChange: 'transform',
				}}
			>
				{/* ── Static orbit rings ── */}
				{[240, 350, 460].map((d, i) => (
					<div
						key={d}
						style={{
							position: 'absolute',
							borderRadius: '50%',
							width: d,
							height: d,
							border: `1px dashed rgba(255,255,255,${0.055 - i * 0.012})`,
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-50%)',
							pointerEvents: 'none',
						}}
					/>
				))}

				{/* ── Particles ── */}
				{/* Desktop only — hidden on mobile via parent media query */}
				<div className='orbital-particles'>
					{PARTICLES.map((p, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								width: 0,
								height: 0,
								animation: `particleDrift ${p.dur} linear infinite`,
								animationDelay: p.delay,
								// CSS custom property for orbit radius
								// @ts-expect-error css custom property
								'--orbit-r': `${p.orbit}px`,
							}}
						>
							<div
								style={{
									position: 'absolute',
									width: 4,
									height: 4,
									borderRadius: '50%',
									background: p.color,
									transform: 'translate(-50%,-50%)',
								}}
							/>
						</div>
					))}
				</div>

				{/* ── CORE — breathing + glow pulse ── */}
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						width: 130,
						height: 130,
						borderRadius: '50%',
						background:
							'radial-gradient(circle,rgba(0,229,255,0.10) 0%,rgba(123,97,255,0.07) 50%,transparent 70%)',
						border: '1px solid rgba(0,229,255,0.22)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						animation:
							'breatheCore 5s ease-in-out infinite, glowPulse 6s ease-in-out infinite',
						zIndex: 10,
						willChange: 'transform',
					}}
				>
					<span
						style={{
							fontSize: 8,
							color: 'var(--text-tertiary)',
							letterSpacing: '0.12em',
							marginBottom: 2,
						}}
					>
						TOTAL VALUE
					</span>
					<span
						className='animate-count'
						style={{
							fontSize: 20,
							fontWeight: 900,
							letterSpacing: '-1px',
							color: '#fff',
							lineHeight: 1,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{formatUSD(totalValue)}
					</span>
					<span
						style={{
							fontSize: 10,
							color: 'var(--accent-lime)',
							fontWeight: 700,
							marginTop: 3,
						}}
					>
						{change24h >= 0 ? '↑' : '↓'} {Math.abs(change24h).toFixed(2)}% (24h)
					</span>
				</div>

				{/* ── Best yield label (above core) ── */}
				{bestAPY > 0 && (
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-158px)',
							textAlign: 'center',
							zIndex: 20,
							pointerEvents: 'none',
						}}
					>
						<div
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								letterSpacing: '0.12em',
								marginBottom: 2,
							}}
						>
							BEST YIELD
						</div>
						<div
							style={{
								fontSize: 20,
								fontWeight: 900,
								color: 'var(--accent-blue)',
								letterSpacing: '-0.5px',
							}}
						>
							{bestAPY.toFixed(2)}%
						</div>
						<div
							style={{
								fontSize: 8,
								color: 'var(--text-tertiary)',
								letterSpacing: '0.08em',
							}}
						>
							Aave V3 · APY
						</div>
					</div>
				)}

				{/* ── Planets ── */}
				{planetPositions.map(pos => {
					const cfg = PLANET_MAP[pos.protocol]
					if (!cfg) return null
					return <Planet key={pos.id} position={pos} cfg={cfg} />
				})}
			</div>
		</div>
	)
}
