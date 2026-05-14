'use client'

import { useState, type KeyboardEvent } from 'react'

interface QuestionInputProps {
	onSubmit: (question: string) => void
	isLoading: boolean
	placeholder?: string
}

const QUICK_QUESTIONS = [
	'What are my biggest risks right now?',
	'How can I improve my yield?',
	'Is my Aave position safe?',
	'Should I rebalance my portfolio?',
]

export function QuestionInput({
	onSubmit,
	isLoading,
	placeholder = 'Ask about your portfolio...',
}: QuestionInputProps) {
	const [value, setValue] = useState('')

	const handleSubmit = () => {
		const trimmed = value.trim()
		if (!trimmed || isLoading) return
		onSubmit(trimmed)
		setValue('')
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<div>
			{/* Quick question chips */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '8px',
					marginBottom: '12px',
				}}
			>
				{QUICK_QUESTIONS.map(q => (
					<button
						key={q}
						onClick={() => onSubmit(q)}
						disabled={isLoading}
						style={{
							fontSize: '12px',
							color: 'var(--text-secondary)',
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							borderRadius: '20px',
							padding: '5px 12px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.5 : 1,
							transition: 'all 0.15s',
						}}
						onMouseEnter={e => {
							if (!isLoading) {
								e.currentTarget.style.borderColor = 'var(--accent-blue)44'
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

			{/* Input area */}
			<div
				style={{
					display: 'flex',
					gap: '10px',
					background: 'var(--bg-elevated)',
					border: '1px solid var(--border-primary)',
					borderRadius: '12px',
					padding: '12px',
					transition: 'border-color 0.2s',
				}}
				onFocus={() => {}}
			>
				<textarea
					value={value}
					onChange={e => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={isLoading}
					rows={1}
					style={{
						flex: 1,
						background: 'transparent',
						border: 'none',
						outline: 'none',
						color: 'var(--text-primary)',
						fontSize: '14px',
						resize: 'none',
						lineHeight: '1.5',
						fontFamily: 'inherit',
					}}
				/>
				<button
					onClick={handleSubmit}
					disabled={!value.trim() || isLoading}
					style={{
						width: '36px',
						height: '36px',
						borderRadius: '8px',
						background:
							!value.trim() || isLoading
								? 'var(--bg-card)'
								: 'var(--gradient-blue)',
						border: 'none',
						cursor: !value.trim() || isLoading ? 'not-allowed' : 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexShrink: 0,
						transition: 'all 0.15s',
						boxShadow:
							value.trim() && !isLoading
								? '0 0 16px var(--accent-blue-glow)'
								: 'none',
					}}
				>
					{isLoading ? (
						// Loading spinner
						<div
							style={{
								width: '16px',
								height: '16px',
								border: '2px solid var(--text-tertiary)',
								borderTopColor: 'var(--accent-blue)',
								borderRadius: '50%',
								animation: 'spin 0.8s linear infinite',
							}}
						/>
					) : (
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke={value.trim() ? 'white' : 'var(--text-tertiary)'}
							strokeWidth='2'
						>
							<path d='M22 2L11 13M22 2L15 22L11 13M11 13L2 9' />
						</svg>
					)}
				</button>
			</div>
			<p
				style={{
					fontSize: '11px',
					color: 'var(--text-tertiary)',
					marginTop: '6px',
				}}
			>
				Press Enter to send · Shift+Enter for new line
			</p>
		</div>
	)
}
