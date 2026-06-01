'use client'

import { useEffect } from 'react'
import { useAI } from '@/hooks/useAI'
import { useWallet } from '@/hooks/useWallet'
import { StreamingText } from '@/components/ai/StreamingText'
import { AnalysisCard } from '@/components/ai/AnalysisCard'
import { QuestionInput } from '@/components/ai/QuestionInput'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const QUICK_QUESTIONS = [
	'What are my biggest risks right now?',
	'How can I improve my yield?',
	'Is my Aave position safe?',
	'Should I rebalance my portfolio?',
]

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
				}}
			>
				<div style={{ fontSize: 48 }}>◎</div>
				<h2
					style={{
						fontSize: 20,
						fontWeight: 800,
						letterSpacing: '-0.5px',
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
					Connect to get AI-powered portfolio insights
				</p>
				<ConnectButton />
			</div>
		)
	}

	return (
		<div style={{ maxWidth: 860 }} className='fade-in'>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 24,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							width: 36,
							height: 36,
							borderRadius: 10,
							background: 'var(--accent-blue-glow)',
							border: '1px solid var(--border-accent)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 18,
						}}
					>
						◎
					</div>
					<div>
						<h1
							style={{
								fontSize: 24,
								fontWeight: 900,
								color: 'var(--text-primary)',
								letterSpacing: '-1px',
							}}
						>
							AI Insights
						</h1>
						<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
							Powered by Gemini
						</p>
					</div>
				</div>
				<ModeToggle />
			</div>

			{/* Main card */}
			<div
				style={{
					background: 'var(--bg-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: 14,
					padding: 20,
					marginBottom: 20,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Cyan top line */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 2,
						background: 'linear-gradient(90deg, var(--accent-blue), #0066cc)',
					}}
				/>

				{/* Top row */}
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						marginBottom: 16,
					}}
				>
					<div>
						<p
							style={{
								fontSize: 14,
								fontWeight: 700,
								color: 'var(--text-primary)',
								marginBottom: 3,
							}}
						>
							Portfolio Analysis
						</p>
						<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							Full breakdown of positions, risks and opportunities
						</p>
					</div>
					<button
						onClick={() => analyze()}
						disabled={!canAnalyze}
						style={{
							padding: '9px 20px',
							borderRadius: 10,
							fontSize: 13,
							fontWeight: 800,
							color: canAnalyze ? '#000' : 'var(--text-tertiary)',
							background: canAnalyze
								? 'var(--accent-blue)'
								: 'var(--bg-elevated)',
							border: 'none',
							cursor: canAnalyze ? 'pointer' : 'not-allowed',
							boxShadow: canAnalyze
								? '0 0 20px var(--accent-blue-glow)'
								: 'none',
							transition: 'all 0.2s',
							flexShrink: 0,
						}}
					>
						{isStreaming ? '◎ Analyzing...' : '◎ Analyze Now'}
					</button>
				</div>

				{/* Quick questions */}
				<div
					style={{
						display: 'flex',
						gap: 6,
						flexWrap: 'wrap',
						marginBottom: 16,
					}}
				>
					{QUICK_QUESTIONS.map(q => (
						<button
							key={q}
							onClick={() => analyze(q)}
							disabled={isStreaming}
							style={{
								padding: '5px 12px',
								borderRadius: 20,
								fontSize: 11,
								fontWeight: 600,
								background: 'var(--bg-elevated)',
								border: '1px solid var(--border-primary)',
								color: 'var(--text-secondary)',
								cursor: isStreaming ? 'not-allowed' : 'pointer',
								transition: 'all 0.15s',
							}}
							onMouseEnter={e => {
								if (!isStreaming) {
									e.currentTarget.style.borderColor = 'var(--border-accent)'
									e.currentTarget.style.color = 'var(--accent-blue)'
								}
							}}
							onMouseLeave={e => {
								e.currentTarget.style.borderColor = 'var(--border-primary)'
								e.currentTarget.style.color = 'var(--text-secondary)'
							}}
						>
							{q}
						</button>
					))}
				</div>

				{/* Streaming */}
				{(streamingText || isStreaming) && (
					<div
						style={{
							background: 'var(--bg-elevated)',
							borderRadius: 10,
							padding: 16,
							marginBottom: 16,
							minHeight: 80,
							animation: 'fadeIn 0.3s ease-out',
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
									background: 'var(--accent-blue)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 11,
									color: '#000',
									fontWeight: 900,
								}}
							>
								G
							</div>
							<span
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									fontWeight: 600,
								}}
							>
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

				{/* Error */}
				{error && (
					<div
						style={{
							background: 'var(--accent-red-glow)',
							border: '1px solid rgba(255,69,58,0.2)',
							borderRadius: 8,
							padding: '10px 14px',
							fontSize: 13,
							color: 'var(--accent-red)',
							marginBottom: 14,
						}}
					>
						{error}
					</div>
				)}

				<QuestionInput onSubmit={q => analyze(q)} isLoading={isStreaming} />
			</div>

			{/* History */}
			<div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 12,
					}}
				>
					<p
						style={{
							fontSize: 10,
							fontWeight: 700,
							color: 'var(--text-tertiary)',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
						}}
					>
						Previous analyses
					</p>
					<span
						style={{
							fontSize: 11,
							color: 'var(--text-tertiary)',
							background: 'var(--bg-elevated)',
							padding: '2px 8px',
							borderRadius: 20,
							fontWeight: 600,
						}}
					>
						{history.length} saved
					</span>
				</div>

				{isLoadingHistory ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								style={{
									background: 'var(--bg-card)',
									border: '1px solid var(--border-primary)',
									borderRadius: 12,
									padding: 16,
									height: 72,
								}}
							>
								<div
									className='skeleton'
									style={{ height: 11, width: '40%', marginBottom: 8 }}
								/>
								<div
									className='skeleton'
									style={{ height: 10, width: '70%' }}
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
							padding: '48px 0',
							color: 'var(--text-tertiary)',
						}}
					>
						<p style={{ fontSize: 32, marginBottom: 10 }}>◎</p>
						<p style={{ fontSize: 13 }}>No analyses yet</p>
						<p style={{ fontSize: 12, marginTop: 4 }}>
							{'Click "Analyze Now" to get your first AI insights'}
						</p>
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						{history.map((analysis, index) => (
							<AnalysisCard
								key={analysis.id}
								analysis={analysis}
								index={index}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
