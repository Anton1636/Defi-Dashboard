'use client'

import { useAIStore } from '@/store/aiStore'

interface SmartInsightsBannerProps {
	onViewFull?: () => void
}

export function SmartInsightsBanner({ onViewFull }: SmartInsightsBannerProps) {
	const {
		autoStreamingText,
		isAutoAnalyzing,
		latestInsight,
		insightDismissed,
		dismissInsight,
	} = useAIStore()

	const text = latestInsight || autoStreamingText

	if (insightDismissed || (!isAutoAnalyzing && !text)) return null

	return (
		<div
			className='stagger-1'
			style={{
				background:
					'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)',
				border: '1px solid rgba(99,102,241,0.25)',
				borderRadius: 14,
				padding: '14px 18px',
				marginBottom: 16,
				display: 'flex',
				alignItems: 'flex-start',
				gap: 12,
				animation: 'fadeIn 0.4s ease-out',
			}}
		>
			{/* Icon */}
			<div
				style={{
					width: 32,
					height: 32,
					borderRadius: 8,
					background: 'var(--gradient-blue)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 14,
					flexShrink: 0,
					boxShadow: '0 0 16px var(--accent-blue-glow)',
				}}
			>
				✦
			</div>

			{/* Content */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						marginBottom: 4,
					}}
				>
					<p
						style={{
							fontSize: 11,
							fontWeight: 600,
							color: 'var(--accent-blue)',
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
						}}
					>
						Smart Insights
					</p>
					{isAutoAnalyzing && (
						<span
							style={{
								fontSize: 10,
								color: 'var(--accent-green)',
								display: 'flex',
								alignItems: 'center',
								gap: 3,
							}}
						>
							<span
								style={{
									animation: 'pulse 1.5s infinite',
									display: 'inline-block',
								}}
							>
								●
							</span>
							Analyzing...
						</span>
					)}
				</div>

				<p
					style={{
						fontSize: 13,
						color: 'var(--text-secondary)',
						lineHeight: 1.5,
					}}
				>
					{text || ''}
					{isAutoAnalyzing && (
						<span
							style={{
								display: 'inline-block',
								width: 2,
								height: 12,
								background: 'var(--accent-blue)',
								marginLeft: 2,
								animation: 'blink 1s infinite',
								verticalAlign: 'middle',
							}}
						/>
					)}
				</p>

				{/* Показуємо завжди коли є текст і не аналізуємо */}
				{!isAutoAnalyzing && text && (
					<button
						onClick={onViewFull}
						style={{
							marginTop: 8,
							fontSize: 12,
							color: onViewFull ? 'var(--accent-blue)' : 'var(--accent-green)',
							background: 'transparent',
							border: 'none',
							cursor: onViewFull ? 'pointer' : 'default',
							padding: 0,
							fontWeight: 500,
							textDecoration: onViewFull ? 'underline' : 'none',
							textUnderlineOffset: 3,
						}}
					>
						{onViewFull ? 'View full analysis →' : '✓ Analysis complete'}
					</button>
				)}
			</div>

			{/* Dismiss — тільки після завершення */}
			{!isAutoAnalyzing && (
				<button
					onClick={dismissInsight}
					style={{
						width: 24,
						height: 24,
						borderRadius: 6,
						background: 'transparent',
						border: '1px solid var(--border-primary)',
						color: 'var(--text-tertiary)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						fontSize: 12,
						flexShrink: 0,
						transition: 'all 0.15s',
					}}
					onMouseEnter={e => {
						e.currentTarget.style.borderColor = 'var(--border-secondary)'
						e.currentTarget.style.color = 'var(--text-secondary)'
					}}
					onMouseLeave={e => {
						e.currentTarget.style.borderColor = 'var(--border-primary)'
						e.currentTarget.style.color = 'var(--text-tertiary)'
					}}
				>
					✕
				</button>
			)}
		</div>
	)
}
