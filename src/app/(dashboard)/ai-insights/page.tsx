'use client'

import { useEffect } from 'react'
import { useAI } from '@/hooks/useAI'
import { useWallet } from '@/hooks/useWallet'
import { StreamingText } from '@/components/ai/StreamingText'
import { AnalysisCard } from '@/components/ai/AnalysisCard'
import { QuestionInput } from '@/components/ai/QuestionInput'
import { ConnectButton } from '@rainbow-me/rainbowkit'

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
		if (isConnected) {
			fetchHistory()
		}
	}, [isConnected])

	if (!isConnected) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					gap: '16px',
				}}
			>
				<div style={{ fontSize: '48px' }}>◇</div>
				<h2
					style={{
						fontSize: '20px',
						fontWeight: 600,
						color: 'var(--text-primary)',
					}}
				>
					Connect your wallet
				</h2>
				<p
					style={{
						fontSize: '14px',
						color: 'var(--text-secondary)',
						marginBottom: '8px',
					}}
				>
					Connect to get AI-powered portfolio insights
				</p>
				<ConnectButton />
			</div>
		)
	}

	return (
		<div style={{ maxWidth: '860px' }}>
			{/* Header */}
			<div style={{ marginBottom: '28px' }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						marginBottom: '8px',
					}}
				>
					<div
						style={{
							width: '36px',
							height: '36px',
							borderRadius: '10px',
							background: 'var(--accent-blue-glow)',
							border: '1px solid var(--accent-blue)44',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '18px',
						}}
					>
						◇
					</div>
					<div>
						<h1
							style={{
								fontSize: '24px',
								fontWeight: 700,
								color: 'var(--text-primary)',
								letterSpacing: '-0.5px',
							}}
						>
							AI Insights
						</h1>
						<p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
							Powered by Gemini
						</p>
					</div>
				</div>
			</div>

			{/* Analyze button */}
			<div
				style={{
					background: 'var(--gradient-card)',
					border: '1px solid var(--border-primary)',
					borderRadius: '16px',
					padding: '20px',
					marginBottom: '20px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: '16px',
					}}
				>
					<div>
						<p
							style={{
								fontSize: '14px',
								fontWeight: 500,
								color: 'var(--text-primary)',
								marginBottom: '4px',
							}}
						>
							Portfolio Analysis
						</p>
						<p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
							Get a full breakdown of your positions, risks and opportunities
						</p>
					</div>
					<button
						onClick={() => analyze()}
						disabled={!canAnalyze}
						style={{
							padding: '10px 20px',
							borderRadius: '10px',
							fontSize: '13px',
							fontWeight: 500,
							color: 'white',
							background: canAnalyze
								? 'var(--gradient-blue)'
								: 'var(--bg-elevated)',
							border: 'none',
							cursor: canAnalyze ? 'pointer' : 'not-allowed',
							opacity: canAnalyze ? 1 : 0.5,
							boxShadow: canAnalyze
								? '0 0 20px var(--accent-blue-glow)'
								: 'none',
							transition: 'all 0.2s',
							flexShrink: 0,
						}}
					>
						{isStreaming ? 'Analyzing...' : '✦ Analyze Now'}
					</button>
				</div>

				{/* Streaming response area */}
				{(streamingText || isStreaming) && (
					<div
						style={{
							background: 'var(--bg-elevated)',
							borderRadius: '10px',
							padding: '16px',
							marginBottom: '16px',
							minHeight: '80px',
							animation: 'fadeIn 0.3s ease-out',
						}}
					>
						{/* AI avatar */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								marginBottom: '12px',
							}}
						>
							<div
								style={{
									width: '24px',
									height: '24px',
									borderRadius: '6px',
									background: 'var(--gradient-blue)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '12px',
								}}
							>
								◇
							</div>
							<span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
								Gemini 1.5 Flash
								{isStreaming && (
									<span
										style={{ color: 'var(--accent-green)', marginLeft: '6px' }}
									>
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
							background: 'rgba(239, 68, 68, 0.08)',
							border: '1px solid rgba(239, 68, 68, 0.2)',
							borderRadius: '8px',
							padding: '10px 14px',
							fontSize: '13px',
							color: 'var(--accent-red)',
							marginBottom: '16px',
						}}
					>
						{error}
					</div>
				)}

				{/* Custom question input */}
				<QuestionInput onSubmit={q => analyze(q)} isLoading={isStreaming} />
			</div>

			{/* History */}
			<div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: '14px',
					}}
				>
					<p
						style={{
							fontSize: '13px',
							fontWeight: 500,
							color: 'var(--text-secondary)',
						}}
					>
						Previous analyses
					</p>
					<span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
						{history.length} saved
					</span>
				</div>

				{isLoadingHistory ? (
					// Loading skeleton for history
					<div
						style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
					>
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								style={{
									background: 'var(--gradient-card)',
									border: '1px solid var(--border-primary)',
									borderRadius: '12px',
									padding: '16px',
									height: '80px',
								}}
							>
								<div
									style={{
										height: '12px',
										background: 'var(--bg-elevated)',
										borderRadius: '4px',
										width: '40%',
										marginBottom: '8px',
									}}
								/>
								<div
									style={{
										height: '10px',
										background: 'var(--bg-elevated)',
										borderRadius: '4px',
										width: '70%',
									}}
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
							justifyContent: 'center',
							padding: '48px 0',
							color: 'var(--text-tertiary)',
						}}
					>
						<p style={{ fontSize: '32px', marginBottom: '12px' }}>◇</p>
						<p style={{ fontSize: '13px' }}>No analyses yet</p>
						<p style={{ fontSize: '12px', marginTop: '4px' }}>
							{'Click "Analyze Now" to get your first AI insights'}
						</p>
					</div>
				) : (
					<div
						style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
					>
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
