'use client'

import { useState } from 'react'
import type {
	DeFiPosition,
	UniswapPosition,
	AavePosition,
	CompoundPosition,
} from '@/types'

function formatUSD(v: number) {
	if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
	if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`
	return `$${v.toFixed(2)}`
}

const SPARKLINES: Record<string, { points: string; color: string }> = {
	uniswap: {
		points: '0,26 30,22 60,14 90,16 120,10 150,8 170,5',
		color: '#ff007a',
	},
	aave: {
		points: '0,20 30,17 60,12 90,13 120,8 150,6 170,4',
		color: '#7b61ff',
	},
	compound: {
		points: '0,24 30,20 60,21 90,15 120,10 150,12 170,7',
		color: '#00d395',
	},
}

const CAPSULE_STYLE: Record<
	string,
	{ before: string; icon: string; iconBg: string }
> = {
	uniswap: {
		before: 'rgba(255,0,122,0.6)',
		icon: '🦄',
		iconBg: 'rgba(255,0,122,0.12)',
	},
	aave: {
		before: 'rgba(123,97,255,0.6)',
		icon: '👻',
		iconBg: 'rgba(123,97,255,0.12)',
	},
	compound: {
		before: 'rgba(0,211,149,0.6)',
		icon: '🏦',
		iconBg: 'rgba(0,211,149,0.12)',
	},
}

function getSubInfo(pos: DeFiPosition): {
	label: string
	value: string
	color: string
} {
	if (pos.protocol === 'uniswap') {
		const p = pos as UniswapPosition
		return {
			label: 'Fees (24h)',
			value: `+$${p.feesEarned.toFixed(2)}`,
			color: 'var(--accent-lime)',
		}
	}
	if (pos.protocol === 'aave') {
		const p = pos as AavePosition
		return {
			label: 'Net APY',
			value: `${p.netAPY.toFixed(2)}%`,
			color: 'var(--accent-lime)',
		}
	}
	if (pos.protocol === 'compound') {
		const p = pos as CompoundPosition
		return {
			label: 'Supply APR',
			value: `${p.supplyAPR.toFixed(2)}%`,
			color: 'var(--compound)',
		}
	}
	return { label: '', value: '', color: '#fff' }
}

export function PositionCapsule({ position }: { position: DeFiPosition }) {
	const [hovered, setHovered] = useState(false)
	const cfg = CAPSULE_STYLE[position.protocol]
	const spark = SPARKLINES[position.protocol]
	const sub = getSubInfo(position)
	const id = `spark-${position.protocol}`

	if (!cfg) return null

	return (
		<div
			className={`capsule capsule-${position.protocol}`}
			style={{
				flexShrink: 0,
				width: 196,
				padding: 14,
				transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
				boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.5)' : 'none',
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Header */}
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
						width: 26,
						height: 26,
						borderRadius: 7,
						background: cfg.iconBg,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 13,
					}}
				>
					{cfg.icon}
				</div>
				<div>
					<div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>
						{position.protocol.toUpperCase()} V3
					</div>
					<div style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>
						{position.protocol === 'uniswap'
							? 'Concentrated LP'
							: position.protocol === 'aave'
								? 'Lending'
								: 'Lending'}
					</div>
				</div>
				<span
					style={{
						marginLeft: 'auto',
						fontSize: 10,
						color: 'var(--text-tertiary)',
					}}
				>
					→
				</span>
			</div>

			{/* Sparkline */}
			<div style={{ height: 34, marginBottom: 8 }}>
				<svg
					viewBox='0 0 170 32'
					preserveAspectRatio='none'
					style={{ width: '100%', height: '100%' }}
				>
					<defs>
						<linearGradient id={id} x1='0' y1='0' x2='0' y2='1'>
							<stop offset='0%' stopColor={spark.color} stopOpacity='0.3' />
							<stop offset='100%' stopColor={spark.color} stopOpacity='0' />
						</linearGradient>
					</defs>
					<polyline
						points={spark.points}
						fill='none'
						stroke={spark.color}
						strokeWidth='1.5'
						opacity='0.9'
					/>
					<polygon
						points={`${spark.points} 170,32 0,32`}
						fill={`url(#${id})`}
					/>
				</svg>
			</div>

			{/* Bottom */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
				}}
			>
				<div>
					<div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
						{formatUSD(position.valueUSD)}
					</div>
					<div
						style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}
					>
						{sub.label}
					</div>
				</div>
				<div style={{ textAlign: 'right' }}>
					<div style={{ fontSize: 11, fontWeight: 700, color: sub.color }}>
						{sub.value}
					</div>
				</div>
			</div>
		</div>
	)
}

export function AddPositionCapsule() {
	return (
		<div
			className='capsule'
			style={{
				flexShrink: 0,
				width: 160,
				padding: 14,
				borderStyle: 'dashed',
				borderColor: 'rgba(255,255,255,0.1)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
			}}
		>
			<div
				style={{
					fontSize: 28,
					color: 'rgba(255,255,255,0.12)',
					marginBottom: 6,
				}}
			>
				+
			</div>
			<div
				style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 700 }}
			>
				Add Position
			</div>
			<div
				style={{
					fontSize: 9,
					color: 'var(--text-tertiary)',
					marginTop: 3,
					textAlign: 'center',
				}}
			>
				Explore new opportunities
			</div>
		</div>
	)
}
