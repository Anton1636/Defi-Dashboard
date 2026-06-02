'use client'

import { useEffect } from 'react'
import { useAI } from '@/hooks/useAI'
import { useWallet } from '@/hooks/useWallet'
import { StreamingText } from '@/components/ai/StreamingText'
import { QuestionInput } from '@/components/ai/QuestionInput'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePortfolio } from '@/hooks/usePortfolio'
import type { AavePosition } from '@/types'

const QUICK_QUESTIONS = [
	{ icon: '🛡', label: 'What are my highest risk positions?' },
	{ icon: '📈', label: 'How can I improve my yield?' },
	{ icon: '🔒', label: 'Is my Aave position safe?' },
	{ icon: '⚖', label: 'Should I rebalance my portfolio?' },
]

/* Decorative sparkline */
function Sparkline({ color, index = 0 }: { color: string; index?: number }) {
	const variants = [
		'M0,18 C20,14 40,10 60,12 C80,14 100,8 120,10 C140,12 155,6 170,4',
		'M0,14 C20,18 40,10 60,16 C80,20 100,12 120,8 C140,6 155,10 170,6',
		'M0,10 C20,14 40,18 60,12 C80,8 100,14 120,10 C140,6 155,12 170,8',
	]
	const path = variants[index % variants.length]
	return (
		<svg
			viewBox='0 0 170 24'
			preserveAspectRatio='none'
			style={{ width: 120, height: 28 }}
		>
			<path
				d={path}
				fill='none'
				stroke={color}
				strokeWidth='1.5'
				opacity='.8'
				strokeLinecap='round'
			/>
		</svg>
	)
}

const ANALYSIS_ICONS = [
	{
		icon: '📊',
		bg: 'linear-gradient(135deg,rgba(0,229,255,.3),rgba(0,229,255,.1))',
		color: '#00e5ff',
	},
	{
		icon: '🛡',
		bg: 'linear-gradient(135deg,rgba(123,97,255,.3),rgba(123,97,255,.1))',
		color: '#7b61ff',
	},
	{
		icon: '🥧',
		bg: 'linear-gradient(135deg,rgba(0,229,255,.2),rgba(74,222,128,.2))',
		color: '#4ade80',
	},
]

function formatDate(d: string) {
	const date = new Date(d)
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const hours = Math.floor(diff / 3_600_000)
	if (hours < 24)
		return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	if (hours < 48)
		return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	return (
		date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}) +
		', ' +
		date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	)
}

export default function AIInsightsPage() {
	const { isConnected } = useWallet()
	const { data: portfolio } = usePortfolio()
	const {
		analyze,
		fetchHistory,
		streamingText,
		isStreaming,
		history,
		isLoadingHistory,
		error,
		canAnalyze,
	} = useAI()

	useEffect(() => {
		if (isConnected) fetchHistory()
	}, [isConnected, fetchHistory])

	const aaveHF = portfolio?.positions.find(p => p.protocol === 'aave')
		? (portfolio.positions.find(p => p.protocol === 'aave') as AavePosition)
				.healthFactor
		: null

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
				<div
					style={{
						width: 48,
						height: 48,
						borderRadius: '50%',
						background: 'rgba(123,97,255,.1)',
						border: '1px solid rgba(123,97,255,.2)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 22,
					}}
				>
					✦
				</div>
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
					Connect to get AI-powered portfolio insights
				</p>
				<ConnectButton />
			</div>
		)
	}

	return (
		<div className='fade-in' style={{ maxWidth: 860 }}>
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
				<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: 12,
							background:
								'linear-gradient(135deg,rgba(0,229,255,.15),rgba(123,97,255,.15))',
							border: '1px solid rgba(123,97,255,.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 20,
						}}
					>
						✦
					</div>
					<div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								marginBottom: 3,
							}}
						>
							<h1
								style={{
									fontSize: 24,
									fontWeight: 900,
									color: 'var(--text-primary)',
									letterSpacing: '-0.8px',
								}}
							>
								AI Insights
							</h1>
							<span
								style={{
									padding: '2px 10px',
									borderRadius: 20,
									background: 'rgba(123,97,255,.12)',
									border: '1px solid rgba(123,97,255,.25)',
									fontSize: 10,
									fontWeight: 800,
									color: 'var(--accent-blue)',
									letterSpacing: '.05em',
								}}
							>
								✦ Powered by GenAI
							</span>
						</div>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Powered by{' '}
							<span style={{ color: 'var(--accent-blue)' }}>NEXORA AI</span>
						</p>
					</div>
				</div>
				{/* PRO / SIMPLE toggle */}
				<div
					style={{
						display: 'flex',
						background: 'rgba(255,255,255,.04)',
						border: '1px solid rgba(255,255,255,.08)',
						borderRadius: 10,
						padding: 3,
					}}
				>
					<button
						style={{
							padding: '6px 18px',
							borderRadius: 8,
							fontSize: 12,
							fontWeight: 800,
							background:
								'linear-gradient(135deg,var(--accent-purple),#5b44d4)',
							color: '#fff',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						PRO
					</button>
					<button
						style={{
							padding: '6px 18px',
							borderRadius: 8,
							fontSize: 12,
							fontWeight: 600,
							background: 'transparent',
							color: 'var(--text-tertiary)',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						SIMPLE
					</button>
				</div>
			</div>

			{/* Portfolio Analysis card */}
			<div
				style={{
					background: 'rgba(255,255,255,.02)',
					border: '1px solid rgba(255,255,255,.08)',
					borderRadius: 16,
					padding: '20px 22px',
					marginBottom: 20,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Top gradient */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background:
							'linear-gradient(90deg,var(--accent-blue),var(--accent-purple),transparent)',
					}}
				/>

				{/* Decorative wave top-right */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: 220,
						height: 120,
						pointerEvents: 'none',
						opacity: 0.25,
					}}
				>
					<svg viewBox='0 0 220 120' style={{ width: '100%', height: '100%' }}>
						<defs>
							<radialGradient id='wg' cx='80%' cy='20%' r='60%'>
								<stop offset='0%' stopColor='#7b61ff' stopOpacity='.6' />
								<stop offset='100%' stopColor='#00e5ff' stopOpacity='0' />
							</radialGradient>
						</defs>
						<path
							d='M40,100 Q80,20 140,50 Q180,70 220,10'
							fill='none'
							stroke='url(#wg)'
							strokeWidth='1.5'
						/>
						<path
							d='M60,110 Q100,40 160,60 Q200,75 220,30'
							fill='none'
							stroke='#7b61ff'
							strokeWidth='1'
							opacity='.4'
						/>
						<circle cx='140' cy='50' r='3' fill='#00e5ff' opacity='.6' />
						<circle cx='80' cy='20' r='2' fill='#7b61ff' opacity='.5' />
						<circle cx='200' cy='35' r='1.5' fill='#00e5ff' opacity='.4' />
					</svg>
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						marginBottom: 16,
						position: 'relative',
					}}
				>
					<div>
						<p
							style={{
								fontSize: 16,
								fontWeight: 800,
								color: 'var(--text-primary)',
								marginBottom: 4,
							}}
						>
							Portfolio Analysis
						</p>
						<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							Get AI-powered insights on your positions, risks, and
							opportunities
						</p>
					</div>
					<button
						onClick={() => analyze()}
						disabled={!canAnalyze}
						style={{
							padding: '10px 22px',
							borderRadius: 10,
							fontSize: 13,
							fontWeight: 800,
							color: canAnalyze ? '#fff' : 'var(--text-tertiary)',
							background: canAnalyze
								? 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))'
								: 'var(--bg-elevated)',
							border: 'none',
							cursor: canAnalyze ? 'pointer' : 'not-allowed',
							boxShadow: canAnalyze ? '0 0 20px rgba(0,229,255,.2)' : 'none',
							transition: 'all .2s',
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							gap: 7,
						}}
					>
						<span style={{ fontSize: 14 }}>✦</span>
						{isStreaming ? 'Analyzing...' : 'Analyze Now'}{' '}
						{!isStreaming && <span>›</span>}
					</button>
				</div>

				{/* Streaming */}
				{(streamingText || isStreaming) && (
					<div
						style={{
							background: 'rgba(255,255,255,.03)',
							borderRadius: 12,
							padding: 16,
							marginBottom: 14,
							animation: 'fadeIn .3s ease-out',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 7,
								marginBottom: 10,
							}}
						>
							<div
								style={{
									width: 22,
									height: 22,
									borderRadius: 6,
									background:
										'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 11,
									color: '#fff',
									fontWeight: 900,
								}}
							>
								G
							</div>
							<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
								Gemini 1.5 Flash
								{isStreaming && (
									<span style={{ color: 'var(--accent-green)', marginLeft: 6 }}>
										● generating...
									</span>
								)}
							</span>
						</div>
						<StreamingText text={streamingText} isStreaming={isStreaming} />
					</div>
				)}

				{error && (
					<div
						style={{
							background: 'rgba(248,113,113,.08)',
							border: '1px solid rgba(248,113,113,.2)',
							borderRadius: 8,
							padding: '10px 14px',
							fontSize: 12,
							color: 'var(--accent-red)',
							marginBottom: 14,
						}}
					>
						{error}
					</div>
				)}

				{/* Quick questions */}
				<div
					style={{
						display: 'flex',
						gap: 6,
						flexWrap: 'wrap',
						marginBottom: 14,
					}}
				>
					{QUICK_QUESTIONS.map(q => (
						<button
							key={q.label}
							onClick={() => analyze(q.label)}
							disabled={isStreaming}
							style={{
								padding: '6px 14px',
								borderRadius: 20,
								fontSize: 11,
								fontWeight: 600,
								background: 'rgba(255,255,255,.04)',
								border: '1px solid rgba(255,255,255,.08)',
								color: 'var(--text-secondary)',
								cursor: isStreaming ? 'not-allowed' : 'pointer',
								transition: 'all .15s',
								display: 'flex',
								alignItems: 'center',
								gap: 5,
							}}
							onMouseEnter={e => {
								if (!isStreaming) {
									e.currentTarget.style.borderColor = 'rgba(0,229,255,.2)'
									e.currentTarget.style.color = 'var(--text-primary)'
								}
							}}
							onMouseLeave={e => {
								e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'
								e.currentTarget.style.color = 'var(--text-secondary)'
							}}
						>
							{q.icon} {q.label}
						</button>
					))}
				</div>

				{/* Input */}
				<QuestionInput onSubmit={q => analyze(q)} isLoading={isStreaming} />
			</div>

			{/* Previous analyses */}
			<div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 14,
					}}
				>
					<p
						style={{
							fontSize: 14,
							fontWeight: 700,
							color: 'var(--text-primary)',
						}}
					>
						Previous analyses
					</p>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 5,
							fontSize: 12,
							color: 'var(--text-tertiary)',
						}}
					>
						<span>⏱</span> {history.length} saved
					</div>
				</div>

				{isLoadingHistory ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{[0, 1, 2].map(i => (
							<div
								key={i}
								style={{
									background: 'rgba(255,255,255,.02)',
									border: '1px solid rgba(255,255,255,.07)',
									borderRadius: 14,
									padding: 16,
									display: 'flex',
									gap: 12,
									alignItems: 'center',
								}}
							>
								<div
									className='skeleton'
									style={{
										width: 44,
										height: 44,
										borderRadius: 12,
										flexShrink: 0,
									}}
								/>
								<div style={{ flex: 1 }}>
									<div
										className='skeleton'
										style={{ height: 12, width: '35%', marginBottom: 6 }}
									/>
									<div
										className='skeleton'
										style={{ height: 10, width: '55%' }}
									/>
								</div>
								<div
									className='skeleton'
									style={{ width: 120, height: 28, borderRadius: 6 }}
								/>
								<div
									className='skeleton'
									style={{ width: 80, height: 10, borderRadius: 4 }}
								/>
							</div>
						))}
					</div>
				) : history.length === 0 ? (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: '56px 0',
							color: 'var(--text-tertiary)',
						}}
					>
						<div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
						<p style={{ fontSize: 13 }}>No analyses yet</p>
						<p style={{ fontSize: 12, marginTop: 4 }}>
							{'Click "Analyze Now" to get your first AI insights'}
						</p>
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{history.map((analysis, i) => {
							const iconCfg = ANALYSIS_ICONS[i % ANALYSIS_ICONS.length]
							const sparkColors = ['#00e5ff', '#7b61ff', '#4ade80']
							const sparkColor = sparkColors[i % sparkColors.length]

							// Parse outcome from prompt
							const isYield = analysis.prompt.toLowerCase().includes('yield')
							const isRisk =
								analysis.prompt.toLowerCase().includes('risk') ||
								analysis.prompt.toLowerCase().includes('safe')
							const isRebalance = analysis.prompt
								.toLowerCase()
								.includes('rebalance')
							const label = isYield
								? 'Yield Optimization'
								: isRisk
									? 'Risk Assessment'
									: isRebalance
										? 'Portfolio Rebalance'
										: 'Portfolio Analysis'
							const metric = isYield
								? '+2.34%'
								: isRisk
									? aaveHF
										? `HF ${aaveHF.toFixed(2)}`
										: 'Low Risk'
									: '+1.87%'
							const metricLabel = isYield
								? 'Potential uplift'
								: isRisk
									? 'Health factor'
									: 'Expected yield boost'
							const metricColor =
								isRisk && aaveHF && aaveHF < 2 ? '#fbbf24' : '#4ade80'

							return (
								<div
									key={analysis.id}
									style={{
										background: 'rgba(255,255,255,.02)',
										border: '1px solid rgba(255,255,255,.07)',
										borderRadius: 14,
										padding: '14px 16px',
										display: 'flex',
										alignItems: 'center',
										gap: 12,
										cursor: 'pointer',
										transition: 'all .15s',
									}}
									onMouseEnter={e => {
										e.currentTarget.style.borderColor = 'rgba(0,229,255,.15)'
										e.currentTarget.style.background = 'rgba(255,255,255,.03)'
									}}
									onMouseLeave={e => {
										e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'
										e.currentTarget.style.background = 'rgba(255,255,255,.02)'
									}}
								>
									{/* Icon */}
									<div
										style={{
											width: 44,
											height: 44,
											borderRadius: 12,
											background: iconCfg.bg,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 20,
											flexShrink: 0,
										}}
									>
										{iconCfg.icon}
									</div>

									{/* Info */}
									<div style={{ flex: 1, minWidth: 0 }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 7,
												marginBottom: 3,
											}}
										>
											<p
												style={{
													fontSize: 13,
													fontWeight: 800,
													color: 'var(--text-primary)',
												}}
											>
												{label}
											</p>
											<span
												style={{
													padding: '1px 7px',
													borderRadius: 10,
													background: 'rgba(123,97,255,.12)',
													border: '1px solid rgba(123,97,255,.2)',
													fontSize: 9,
													fontWeight: 800,
													color: 'var(--accent-blue)',
													letterSpacing: '.04em',
												}}
											>
												PRO
											</span>
										</div>
										<p
											style={{
												fontSize: 11,
												color: 'var(--text-tertiary)',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
										>
											{analysis.prompt}
										</p>
									</div>

									{/* Sparkline */}
									<div style={{ flexShrink: 0 }}>
										<Sparkline color={sparkColor} index={i} />
									</div>

									{/* Metric */}
									<div
										style={{ textAlign: 'right', flexShrink: 0, minWidth: 90 }}
									>
										<p
											style={{
												fontSize: 13,
												fontWeight: 800,
												color: metricColor,
											}}
										>
											{metric}
										</p>
										<p
											style={{
												fontSize: 10,
												color: 'var(--text-tertiary)',
												marginTop: 1,
											}}
										>
											{metricLabel}
										</p>
									</div>

									{/* Date */}
									<div
										style={{ textAlign: 'right', flexShrink: 0, minWidth: 120 }}
									>
										<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
											{formatDate(analysis.createdAt)}
										</p>
									</div>

									{/* Arrow */}
									<div
										style={{
											width: 30,
											height: 30,
											borderRadius: 8,
											background: 'rgba(255,255,255,.04)',
											border: '1px solid rgba(255,255,255,.07)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 14,
											color: 'var(--text-tertiary)',
											flexShrink: 0,
										}}
									>
										›
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
