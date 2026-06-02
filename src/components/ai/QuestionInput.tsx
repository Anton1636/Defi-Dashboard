'use client'

import { useState, type KeyboardEvent } from 'react'

interface QuestionInputProps {
	onSubmit: (question: string) => void
	isLoading: boolean
	placeholder?: string
}

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
			{/* Input area */}
			<div
				style={{
					display: 'flex',
					gap: 10,
					background: 'var(--surface-2)',
					border: '1px solid var(--border-1)',
					borderRadius: 'var(--card-radius-sm)',
					padding: 12,
					transition: 'border-color .2s',
				}}
				onFocus={e => {
					e.currentTarget.style.borderColor = 'rgba(0,229,255,.25)'
				}}
				onBlur={e => {
					e.currentTarget.style.borderColor = 'var(--border-1)'
				}}
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
						fontSize: 14,
						resize: 'none',
						lineHeight: '1.5',
						fontFamily: 'inherit',
					}}
				/>
				<button
					onClick={handleSubmit}
					disabled={!value.trim() || isLoading}
					style={{
						width: 36,
						height: 36,
						borderRadius: 8,
						border: 'none',
						flexShrink: 0,
						cursor: !value.trim() || isLoading ? 'not-allowed' : 'pointer',
						background:
							!value.trim() || isLoading
								? 'var(--surface-3)'
								: 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transition: 'all .15s',
						boxShadow: value.trim() && !isLoading ? 'var(--glow-blue)' : 'none',
					}}
				>
					{isLoading ? (
						<div
							style={{
								width: 16,
								height: 16,
								border: '2px solid var(--text-tertiary)',
								borderTopColor: 'var(--accent-blue)',
								borderRadius: '50%',
								animation: 'spin .8s linear infinite',
							}}
						/>
					) : (
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke={value.trim() ? '#fff' : 'var(--text-tertiary)'}
							strokeWidth='2'
						>
							<path d='M22 2L11 13M22 2L15 22L11 13M11 13L2 9' />
						</svg>
					)}
				</button>
			</div>

			<p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
				Press Enter to send · Shift+Enter for new line
			</p>
		</div>
	)
}
