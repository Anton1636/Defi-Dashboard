'use client'

import { useMemo, useState } from 'react'
import { usePortfolio } from '@/hooks/usePortfolio'
import { calcRisk, type RiskNode } from '@/lib/riskEngine'

const LEVEL_COLORS = {
	safe: '#4ade80',
	moderate: '#fbbf24',
	high: '#f97316',
	critical: '#f87171',
}

const LEVEL_LABELS = {
	safe: 'Safe',
	moderate: 'Moderate',
	high: 'High Risk',
	critical: 'Critical',
}

const ZONE_CONFIG = [
	{
		label: 'SAFE ZONE',
		size: 22,
		color: 'rgba(74,222,128,.18)',
		border: 'rgba(74,222,128,.25)',
	},
	{
		label: 'MODERATE',
		size: 40,
		color: 'rgba(251,191,36,.10)',
		border: 'rgba(251,191,36,.2)',
	},
	{
		label: 'HIGH RISK',
		size: 60,
		color: 'rgba(249,115,22,.07)',
		border: 'rgba(249,115,22,.15)',
	},
	{
		label: 'CRITICAL',
		size: 80,
		color: 'rgba(248,113,113,.05)',
		border: 'rgba(248,113,113,.1)',
	},
]

function NodeTooltip({ node }: { node: RiskNode }) {
	const col = LEVEL_COLORS[node.riskLevel]
	return (
		<div
			style={{
				position: 'absolute',
				zIndex: 30,
				background: 'rgba(5,6,10,.97)',
				border: `1px solid rgba(255,255,255,.12)`,
				borderRadius: 12,
				padding: '12px 14px',
				minWidth: 160,
				pointerEvents: 'none',
				boxShadow: '0 8px 24px rgba(0,0,0,.6)',
				bottom: 'calc(100% + 8px)',
				left: '50%',
				transform: 'translateX(-50%)',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 7,
					marginBottom: 8,
				}}
			>
				<span style={{ fontSize: 16 }}>{node.icon}</span>
				<p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>
					{node.label}
				</p>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 11,
					}}
				>
					<span style={{ color: 'rgba(255,255,255,.4)' }}>Value</span>
					<span style={{ fontWeight: 700 }}>
						${(node.valueUSD / 1000).toFixed(2)}K
					</span>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 11,
					}}
				>
					<span style={{ color: 'rgba(255,255,255,.4)' }}>Risk Score</span>
					<span style={{ fontWeight: 800, color: col }}>
						{node.riskScore}/10
					</span>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 11,
					}}
				>
					<span style={{ color: 'rgba(255,255,255,.4)' }}>Level</span>
					<span style={{ fontWeight: 700, color: col }}>
						{LEVEL_LABELS[node.riskLevel]}
					</span>
				</div>
				{node.riskFactors.length > 0 && (
					<div
						style={{
							marginTop: 4,
							paddingTop: 4,
							borderTop: '1px solid rgba(255,255,255,.08)',
						}}
					>
						{node.riskFactors.map(f => (
							<p
								key={f}
								style={{
									fontSize: 10,
									color: 'rgba(255,255,255,.4)',
									marginTop: 2,
								}}
							>
								· {f}
							</p>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export function RiskTopology() {
	const { data: portfolio } = usePortfolio()
	const [hoveredId, setHoveredId] = useState<string | null>(null)

	const risk = useMemo(() => {
		if (!portfolio) return null
		return calcRisk(portfolio.positions, portfolio.totalValueUSD)
	}, [portfolio])

	if (!portfolio || !risk) {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: 400,
				}}
			>
				<div
					className='skeleton'
					style={{ width: 400, height: 400, borderRadius: '50%' }}
				/>
			</div>
		)
	}

	const levelColor = LEVEL_COLORS[risk.level]

	return (
		<div className='layout-analytics fade-in'>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					marginBottom: 22,
					flexWrap: 'wrap',
					gap: 12,
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
						🛡 Risk Topology
					</h1>
					<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
						Visual risk map — position size vs risk level
					</p>
				</div>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<div
						style={{
							padding: '8px 16px',
							borderRadius: 'var(--card-radius-sm)',
							background: `${levelColor}12`,
							border: `1px solid ${levelColor}30`,
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: levelColor,
								fontWeight: 700,
								letterSpacing: '.1em',
								marginBottom: 2,
							}}
						>
							PORTFOLIO RISK
						</p>
						<p style={{ fontSize: 20, fontWeight: 900, color: levelColor }}>
							{risk.totalScore}
							<span style={{ fontSize: 11, opacity: 0.6 }}>/10</span>
						</p>
					</div>
					<div
						style={{
							padding: '8px 14px',
							borderRadius: 'var(--card-radius-sm)',
							background: 'var(--surface-2)',
							border: '1px solid var(--border-1)',
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								letterSpacing: '.1em',
								marginBottom: 2,
							}}
						>
							STATUS
						</p>
						<p style={{ fontSize: 13, fontWeight: 800, color: levelColor }}>
							{LEVEL_LABELS[risk.level]}
						</p>
					</div>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					gap: 16,
					flexWrap: 'wrap',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				{/* MAP */}
				<div
					style={{
						flex: '1 1 300px',
						minWidth: 0,
						background: 'var(--card-bg)',
						border: '1px solid var(--card-border)',
						borderRadius: 'var(--card-radius)',
						padding: 20,
						boxShadow: 'var(--shadow-card)',
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: 2,
							background: `linear-gradient(90deg,${levelColor},transparent)`,
						}}
					/>

					{/* Axis labels */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: 8,
						}}
					>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								letterSpacing: '.1em',
							}}
						>
							↑ RISK LEVEL
						</p>
						<p
							style={{
								fontSize: 9,
								color: 'var(--text-tertiary)',
								fontWeight: 700,
								letterSpacing: '.1em',
							}}
						>
							Node size = position value
						</p>
					</div>

					{/* Map area */}
					<div style={{ position: 'relative', width: '100%', height: '500px' }}>
						<div style={{ position: 'absolute', inset: 0 }}>
							{/* Background ambient */}
							<div
								style={{
									position: 'absolute',
									inset: 0,
									background:
										'radial-gradient(circle at 50% 80%,rgba(74,222,128,.04) 0%,rgba(248,113,113,.03) 60%,transparent 100%)',
									borderRadius: 8,
								}}
							/>

							{/* Concentric zones */}
							{ZONE_CONFIG.map((zone, i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										width: `${zone.size}%`,
										height: `${zone.size * 1.1}%`,
										transform: 'translate(-50%,-50%)',
										borderRadius: '50%',
										background: zone.color,
										border: `1px dashed ${zone.border}`,
									}}
								>
									{i === ZONE_CONFIG.length - 1 && (
										<p
											style={{
												position: 'absolute',
												top: 4,
												left: '50%',
												transform: 'translateX(-50%)',
												fontSize: 8,
												fontWeight: 700,
												color: 'rgba(248,113,113,.5)',
												letterSpacing: '.1em',
												whiteSpace: 'nowrap',
											}}
										>
											{zone.label}
										</p>
									)}
								</div>
							))}

							{/* Safe zone label */}
							<p
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%,-50%)',
									fontSize: 8,
									fontWeight: 700,
									color: 'rgba(74,222,128,.5)',
									letterSpacing: '.12em',
									textAlign: 'center',
									zIndex: 1,
									pointerEvents: 'none',
								}}
							>
								SAFE
							</p>

							{/* Grid lines */}
							{[25, 50, 75].map(v => (
								<div
									key={`h${v}`}
									style={{
										position: 'absolute',
										left: 0,
										right: 0,
										top: `${v}%`,
										height: '1px',
										background: 'rgba(255,255,255,.04)',
									}}
								/>
							))}
							{[25, 50, 75].map(v => (
								<div
									key={`v${v}`}
									style={{
										position: 'absolute',
										top: 0,
										bottom: 0,
										left: `${v}%`,
										width: '1px',
										background: 'rgba(255,255,255,.04)',
									}}
								/>
							))}

							{/* Nodes */}
							{risk.nodes.map(node => {
								const size = Math.max(
									48,
									Math.min(80, (node.valueUSD / 5000) * 20 + 48),
								)
								const isHovered = hoveredId === node.id
								return (
									<div
										key={node.id}
										onMouseEnter={() => setHoveredId(node.id)}
										onMouseLeave={() => setHoveredId(null)}
										style={{
											position: 'absolute',
											left: `${Math.min(88, Math.max(8, node.x))}%`,
											top: `${Math.min(88, Math.max(8, node.y))}%`,
											transform: `translate(-50%,-50%) scale(${isHovered ? 1.15 : 1})`,
											width: size,
											height: size,
											borderRadius: '50%',
											background: `radial-gradient(circle,${node.color}22,${node.color}08)`,
											border: `2px solid ${node.color}60`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
											zIndex: isHovered ? 20 : 5,
											transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)',
											boxShadow: isHovered
												? `0 0 20px ${node.color}40`
												: 'none',
										}}
									>
										<span style={{ fontSize: size > 60 ? 24 : 18 }}>
											{node.icon}
										</span>
										{isHovered && <NodeTooltip node={node} />}
									</div>
								)
							})}

							{/* X axis label */}
							<p
								style={{
									position: 'absolute',
									bottom: 4,
									right: 8,
									fontSize: 8,
									color: 'var(--text-tertiary)',
									fontWeight: 600,
									letterSpacing: '.08em',
								}}
							>
								EXPOSURE SIZE →
							</p>
						</div>
					</div>

					{/* Legend */}
					<div
						style={{
							display: 'flex',
							gap: 14,
							marginTop: 12,
							flexWrap: 'wrap',
						}}
					>
						{Object.entries(LEVEL_COLORS).map(([level, color]) => (
							<div
								key={level}
								style={{ display: 'flex', alignItems: 'center', gap: 5 }}
							>
								<div
									style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										background: color,
									}}
								/>
								<span
									style={{
										fontSize: 9,
										color: 'rgba(255,255,255,.4)',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '.06em',
									}}
								>
									{LEVEL_LABELS[level as keyof typeof LEVEL_LABELS]}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* RIGHT PANEL */}
				<div
					className='risk-right-panel'
					style={{
						flex: '0 1 280px',
						display: 'flex',
						flexDirection: 'column',
						gap: 12,
						minWidth: 0,
						width: '100%',
					}}
				>
					{/* Risk breakdown */}
					<div
						style={{
							background: 'var(--card-bg)',
							border: '1px solid var(--card-border)',
							borderRadius: 'var(--card-radius)',
							padding: 16,
							boxShadow: 'var(--shadow-card)',
						}}
					>
						<p
							style={{
								fontSize: 9,
								fontWeight: 800,
								color: 'var(--text-tertiary)',
								letterSpacing: '.16em',
								textTransform: 'uppercase',
								marginBottom: 12,
							}}
						>
							Risk Breakdown
						</p>
						{risk.nodes.map(node => {
							const col = LEVEL_COLORS[node.riskLevel]
							return (
								<div
									key={node.id}
									onMouseEnter={() => setHoveredId(node.id)}
									onMouseLeave={() => setHoveredId(null)}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 10,
										padding: '8px 0',
										borderBottom: '1px solid var(--border-1)',
										cursor: 'pointer',
										opacity: hoveredId && hoveredId !== node.id ? 0.5 : 1,
										transition: 'opacity .15s',
									}}
								>
									<span style={{ fontSize: 16, flexShrink: 0 }}>
										{node.icon}
									</span>
									<div style={{ flex: 1, minWidth: 0 }}>
										<p
											style={{
												fontSize: 12,
												fontWeight: 700,
												color: 'var(--text-primary)',
												marginBottom: 4,
											}}
										>
											{node.label}
										</p>
										<div
											style={{
												height: 4,
												background: 'var(--surface-3)',
												borderRadius: 2,
												overflow: 'hidden',
											}}
										>
											<div
												style={{
													height: '100%',
													width: `${node.riskScore * 10}%`,
													background: col,
													borderRadius: 2,
													transition: 'width .4s ease',
												}}
											/>
										</div>
									</div>
									<span
										style={{
											fontSize: 13,
											fontWeight: 900,
											color: col,
											flexShrink: 0,
											minWidth: 30,
											textAlign: 'right',
										}}
									>
										{node.riskScore}
									</span>
								</div>
							)
						})}
					</div>

					{/* Portfolio risk score */}
					<div
						style={{
							background: 'var(--card-bg)',
							border: '1px solid var(--card-border)',
							borderRadius: 'var(--card-radius)',
							padding: 16,
							boxShadow: 'var(--shadow-card)',
						}}
					>
						<p
							style={{
								fontSize: 9,
								fontWeight: 800,
								color: 'var(--text-tertiary)',
								letterSpacing: '.16em',
								textTransform: 'uppercase',
								marginBottom: 10,
							}}
						>
							Portfolio Risk Score
						</p>
						<p
							style={{
								fontSize: 48,
								fontWeight: 900,
								color: levelColor,
								letterSpacing: '-2px',
								lineHeight: 1,
							}}
						>
							{risk.totalScore}
							<span style={{ fontSize: 18, opacity: 0.5 }}>/10</span>
						</p>
						<div
							style={{
								height: 6,
								background: 'var(--surface-3)',
								borderRadius: 3,
								margin: '10px 0',
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									height: '100%',
									width: `${risk.totalScore * 10}%`,
									background: `linear-gradient(90deg,var(--accent-green),${levelColor})`,
									borderRadius: 3,
									transition: 'width .6s ease',
								}}
							/>
						</div>
						<p
							style={{
								fontSize: 11,
								fontWeight: 700,
								color: levelColor,
								marginBottom: 6,
							}}
						>
							● {LEVEL_LABELS[risk.level]}
						</p>
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								lineHeight: 1.6,
							}}
						>
							{risk.suggestion}
						</p>
					</div>

					{/* Risk factors */}
					<div
						style={{
							background: 'var(--card-bg)',
							border: '1px solid var(--card-border)',
							borderRadius: 'var(--card-radius)',
							padding: 16,
							boxShadow: 'var(--shadow-card)',
						}}
					>
						<p
							style={{
								fontSize: 9,
								fontWeight: 800,
								color: 'var(--text-tertiary)',
								letterSpacing: '.16em',
								textTransform: 'uppercase',
								marginBottom: 10,
							}}
						>
							Top Risk
						</p>
						<div
							style={{
								display: 'flex',
								alignItems: 'flex-start',
								gap: 8,
								padding: '10px 12px',
								background: 'var(--surface-2)',
								borderRadius: 'var(--card-radius-xs)',
								border: `1px solid ${levelColor}20`,
							}}
						>
							<span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
							<p
								style={{
									fontSize: 11,
									color: 'var(--text-secondary)',
									lineHeight: 1.5,
								}}
							>
								{risk.topRisk}
							</p>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 6,
								marginTop: 10,
							}}
						>
							{[
								{
									label: 'Liquidation risk',
									val: risk.nodes.some(n => n.riskLevel === 'critical')
										? 'Yes ⚠'
										: 'None',
									col: risk.nodes.some(n => n.riskLevel === 'critical')
										? 'var(--accent-red)'
										: 'var(--accent-green)',
								},
								{
									label: 'IL exposure',
									val: risk.nodes.some(n => n.protocol === 'uniswap')
										? 'Medium'
										: 'None',
									col: 'var(--accent-amber)',
								},
								{
									label: 'Protocols',
									val: `${risk.nodes.length} active`,
									col: 'var(--text-secondary)',
								},
								{
									label: 'Smart contract',
									val: 'Audited ✓',
									col: 'var(--accent-green)',
								},
							].map(f => (
								<div
									key={f.label}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										fontSize: 11,
									}}
								>
									<span style={{ color: 'var(--text-tertiary)' }}>
										{f.label}
									</span>
									<span style={{ fontWeight: 700, color: f.col }}>{f.val}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
