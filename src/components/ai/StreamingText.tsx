'use client'

import { useEffect, useRef } from 'react'

interface StreamingTextProps {
	text: string
	isStreaming: boolean
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

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
	const endRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isStreaming) {
			endRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}, [text, isStreaming])

	if (!text) return null

	return (
		<div
			style={{
				fontSize: '14px',
				lineHeight: '1.7',
				color: 'var(--text-secondary)',
			}}
		>
			<p
				dangerouslySetInnerHTML={{
					__html: parseMarkdown(text),
				}}
			/>
			{isStreaming && (
				<span
					style={{
						display: 'inline-block',
						width: '2px',
						height: '16px',
						background: 'var(--accent-blue)',
						marginLeft: '2px',
						verticalAlign: 'middle',
						animation: 'blink 1s infinite',
					}}
				/>
			)}
			<div ref={endRef} />
		</div>
	)
}
