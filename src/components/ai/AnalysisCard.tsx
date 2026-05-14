'use client'

import { useState } from 'react'
import type { AIAnalysis } from '@/store/aiStore'

interface AnalysisCardProps {
	analysis: AIAnalysis
	index: number
}

function parseMarkdown(text: string): string {
	return text
		.replace(
			/\*\*(.*?)\*\*/g,
			'<strong style="color: var(--text-primary); font-weight: 600">$1</strong>',
		)
		.replace(/\n\n/g, '</p><p style="margin-top: 12px">')
		.replace(/\n/g, '<br/>')
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr)
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function AnalysisCard({ analysis, index }: AnalysisCardProps) {
	// Collapse/expand for long responses.
	const [expanded, setExpanded] = useState(index === 0)
	const isLong = analysis.response.length > 300

	return (
		<div
			className='fade-in'
			style={{
				background: 'var(--gradient-card)',
				border: '1px solid var(--border-primary)',
				borderRadius: '12px',
				padding: '16px',
				transition: 'border-color 0.2s',
			}}
			onMouseEnter={e => {
				e.currentTarget.style.borderColor = 'var(--border-secondary)'
			}}
			onMouseLeave={e => {
				e.currentTarget.style.borderColor = 'var(--border-primary)'
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: '12px',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<div
						style={{
							width: '28px',
							height: '28px',
							borderRadius: '8px',
							background: 'var(--accent-blue-glow)',
							border: '1px solid var(--accent-blue)44',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '14px',
						}}
					>
						◇
					</div>
					<div>
						<p
							style={{
								fontSize: '13px',
								fontWeight: 500,
								color: 'var(--text-primary)',
							}}
						>
							{analysis.prompt.length > 50
								? analysis.prompt.slice(0, 50) + '...'
								: analysis.prompt}
						</p>
						<p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
							{formatDate(analysis.createdAt)} · {analysis.model}
						</p>
					</div>
				</div>

				{isLong && (
					<button
						onClick={() => setExpanded(!expanded)}
						style={{
							fontSize: '12px',
							color: 'var(--accent-blue)',
							background: 'transparent',
							border: 'none',
							cursor: 'pointer',
							padding: '4px 8px',
							borderRadius: '6px',
						}}
					>
						{expanded ? 'Collapse ↑' : 'Expand ↓'}
					</button>
				)}
			</div>

			{/* Response text */}
			<div
				style={{
					fontSize: '13px',
					lineHeight: '1.7',
					color: 'var(--text-secondary)',
					maxHeight: expanded ? 'none' : '80px',
					overflow: 'hidden',
					position: 'relative',
				}}
			>
				<p
					dangerouslySetInnerHTML={{ __html: parseMarkdown(analysis.response) }}
				/>

				{/* Gradient fade for collapsed */}
				{!expanded && isLong && (
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '40px',
							background: 'linear-gradient(transparent, var(--bg-card))',
						}}
					/>
				)}
			</div>
		</div>
	)
}
