'use client'

import { useEffect } from 'react'
import { useAI } from '@/hooks/useAI'
import { useWallet } from '@/hooks/useWallet'
import { StreamingText } from '@/components/ai/StreamingText'
import { QuestionInput } from '@/components/ai/QuestionInput'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const QUICK_Q = [
	{ icon: '🛡', label: 'What are my highest risk positions?' },
	{ icon: '📈', label: 'How can I improve my yield?' },
	{ icon: '🔒', label: 'Is my Aave position safe?' },
	{ icon: '⚖', label: 'Should I rebalance my portfolio?' },
]

const HISTORY_ICONS = [
	{
		icon: '📊',
		bg: 'linear-gradient(135deg,rgba(0,229,255,.3),rgba(0,229,255,.1))',
	},
	{
		icon: '🛡',
		bg: 'linear-gradient(135deg,rgba(123,97,255,.3),rgba(123,97,255,.1))',
	},
	{
		icon: '🥧',
		bg: 'linear-gradient(135deg,rgba(0,229,255,.2),rgba(74,222,128,.2))',
	},
]

const SPARK_PATHS_AI = [
	'M0,18 C30,14 60,10 90,12 C120,14 150,8 170,5',
	'M0,14 C30,18 60,10 90,16 C120,19 150,8 170,6',
	'M0,12 C30,16 60,18 90,12 C120,8 150,14 170,8',
]

function formatDate(d: string) {
	const date = new Date(d),
		now = new Date()
	const h = Math.floor((now.getTime() - date.getTime()) / 3_600_000)
	if (h < 24)
		return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	if (h < 48)
		return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

export default function AIInsightsPage() {
	const { isConnected } = useWallet()
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
						background: 'var(--accent-purple-glow)',
						border: '1px solid rgba(123,97,255,.25)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 22,
					}}
				>
					✦
				</div>
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
				<p
					style={{
						fontSize: 14,
						color: 'var(--text-secondary)',
						marginBottom: 8,
					}}
				>
					Get AI-powered portfolio insights
				</p>
				<ConnectButton />
			</div>
		)
	}

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
				<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
					<div
						style={{
							width: 44,
							height: 44,
							borderRadius: 12,
							background:
								'linear-gradient(135deg,rgba(0,229,255,.12),rgba(123,97,255,.12))',
							border: '1px solid rgba(123,97,255,.2)',
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
									fontSize: 22,
									fontWeight: 900,
									color: 'var(--text-primary)',
									letterSpacing: '-.8px',
								}}
							>
								AI Insights
							</h1>
							<span
								style={{
									padding: '2px 9px',
									borderRadius: 20,
									background: 'var(--accent-purple-glow)',
									border: '1px solid rgba(123,97,255,.22)',
									fontSize: 10,
									fontWeight: 800,
									color: 'var(--accent-blue)',
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
				{/* PRO/SIMPLE toggle */}
				<div
					style={{
						display: 'flex',
						background: 'var(--surface-2)',
						border: '1px solid var(--border-1)',
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
							background: 'var(--gradient-purple)',
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

			{/* Analysis card */}
			<div
				style={{
					background: 'var(--card-bg)',
					border: '1px solid var(--card-border)',
					borderRadius: 'var(--card-radius)',
					padding: 'var(--card-padding-lg)',
					marginBottom: 20,
					position: 'relative',
					overflow: 'hidden',
					boxShadow: 'var(--shadow-card)',
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

				{/* Wave decoration */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: 200,
						height: 110,
						pointerEvents: 'none',
						opacity: 0.2,
					}}
				>
					<svg viewBox='0 0 200 110' style={{ width: '100%', height: '100%' }}>
						<defs>
							<radialGradient id='wg2' cx='70%' cy='30%' r='60%'>
								<stop offset='0%' stopColor='#7b61ff' stopOpacity='.8' />
								<stop offset='100%' stopColor='#00e5ff' stopOpacity='0' />
							</radialGradient>
						</defs>
						<path
							d='M30,100 Q80,20 140,50 Q180,70 200,10'
							fill='none'
							stroke='url(#wg2)'
							strokeWidth='1.5'
						/>
						<path
							d='M50,110 Q100,40 160,60 Q195,74 200,30'
							fill='none'
							stroke='#7b61ff'
							strokeWidth='1'
							opacity='.5'
						/>
						<circle cx='140' cy='50' r='3' fill='#00e5ff' opacity='.6' />
						<circle cx='80' cy='20' r='2' fill='#7b61ff' opacity='.5' />
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
								fontSize: 15,
								fontWeight: 800,
								color: 'var(--text-primary)',
								marginBottom: 3,
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
							borderRadius: 'var(--card-radius-sm)',
							fontSize: 13,
							fontWeight: 800,
							flexShrink: 0,
							color: canAnalyze ? '#fff' : 'var(--text-tertiary)',
							background: canAnalyze
								? 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))'
								: 'var(--surface-3)',
							border: 'none',
							cursor: canAnalyze ? 'pointer' : 'not-allowed',
							boxShadow: canAnalyze ? 'var(--glow-blue)' : 'none',
							transition: 'all .2s',
							display: 'flex',
							alignItems: 'center',
							gap: 7,
						}}
					>
						<span style={{ fontSize: 14 }}>✦</span>
						{isStreaming ? 'Analyzing...' : 'Analyze Now →'}
					</button>
				</div>

				{/* Streaming */}
				{(streamingText || isStreaming) && (
					<div
						style={{
							background: 'var(--surface-2)',
							borderRadius: 'var(--card-radius-sm)',
							padding: 16,
							marginBottom: 14,
							animation: 'fadeIn .3s ease-out',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
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
							background: 'var(--accent-red-glow)',
							border: '1px solid rgba(248,113,113,.2)',
							borderRadius: 'var(--card-radius-xs)',
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
					{QUICK_Q.map(q => (
						<button
							key={q.label}
							onClick={() => analyze(q.label)}
							disabled={isStreaming}
							style={{
								padding: '5px 12px',
								borderRadius: 20,
								fontSize: 11,
								fontWeight: 600,
								background: 'var(--surface-2)',
								border: '1px solid var(--border-1)',
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
								e.currentTarget.style.borderColor = 'var(--border-1)'
								e.currentTarget.style.color = 'var(--text-secondary)'
							}}
						>
							{q.icon} {q.label}
						</button>
					))}
				</div>

				<QuestionInput onSubmit={q => analyze(q)} isLoading={isStreaming} />
			</div>

			{/* History */}
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
						⏱ {history.length} saved
					</div>
				</div>

				{isLoadingHistory ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{[0, 1, 2].map(i => (
							<div
								key={i}
								style={{
									background: 'var(--card-bg)',
									border: '1px solid var(--card-border)',
									borderRadius: 'var(--card-radius)',
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
						<div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
						<p style={{ fontSize: 13 }}>No analyses yet</p>
						<p style={{ fontSize: 12, marginTop: 4 }}>
							{'"Click "Analyze Now" to get your first AI insights"'}
						</p>
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{history.map((analysis, i) => {
							const iconCfg = HISTORY_ICONS[i % HISTORY_ICONS.length]
							const colors = [
								'var(--accent-blue)',
								'var(--accent-purple)',
								'var(--accent-green)',
							]
							const col = colors[i % colors.length]
							const isYield = analysis.prompt.toLowerCase().includes('yield')
							const isRisk =
								analysis.prompt.toLowerCase().includes('risk') ||
								analysis.prompt.toLowerCase().includes('safe')
							const label = isYield
								? 'Yield Optimization'
								: isRisk
									? 'Risk Assessment'
									: 'Portfolio Rebalance'
							const metric = isYield ? '+2.34%' : isRisk ? 'Low Risk' : '+1.87%'
							const metricSub = isYield
								? 'Potential uplift'
								: isRisk
									? 'Health factor 2.45'
									: 'Expected yield boost'

							return (
								<div
									key={analysis.id}
									style={{
										background: 'var(--card-bg)',
										border: '1px solid var(--card-border)',
										borderRadius: 'var(--card-radius)',
										padding: '13px 16px',
										display: 'flex',
										alignItems: 'center',
										gap: 12,
										cursor: 'pointer',
										transition: 'all .15s',
										boxShadow: 'var(--shadow-card)',
									}}
									onMouseEnter={e => {
										e.currentTarget.style.borderColor = 'rgba(0,229,255,.15)'
										e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
									}}
									onMouseLeave={e => {
										e.currentTarget.style.borderColor = 'var(--card-border)'
										e.currentTarget.style.boxShadow = 'var(--shadow-card)'
									}}
								>
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
													background: 'var(--accent-purple-glow)',
													border: '1px solid rgba(123,97,255,.2)',
													fontSize: 9,
													fontWeight: 800,
													color: 'var(--accent-blue)',
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
									<svg
										viewBox='0 0 170 24'
										style={{
											width: 100,
											height: 22,
											flexShrink: 0,
											opacity: 0.8,
										}}
									>
										<path
											d={SPARK_PATHS_AI[i % SPARK_PATHS_AI.length]}
											fill='none'
											stroke={col}
											strokeWidth='1.5'
											strokeLinecap='round'
										/>
									</svg>
									<div
										style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}
									>
										<p
											style={{
												fontSize: 13,
												fontWeight: 800,
												color: 'var(--accent-green)',
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
											{metricSub}
										</p>
									</div>
									<div
										style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}
									>
										<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
											{formatDate(analysis.createdAt)}
										</p>
									</div>
									<div
										style={{
											width: 28,
											height: 28,
											borderRadius: 8,
											background: 'var(--surface-2)',
											border: '1px solid var(--border-1)',
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
