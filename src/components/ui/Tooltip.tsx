'use client'

import { useState, useRef, type ReactNode } from 'react'

interface TooltipProps {
	content: string
	children: ReactNode
	position?: 'top' | 'bottom'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
	const [visible, setVisible] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	return (
		<div
			ref={ref}
			style={{ position: 'relative', display: 'inline-flex' }}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
		>
			{children}

			{visible && (
				<div
					style={{
						position: 'absolute',
						[position === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
						left: '50%',
						transform: 'translateX(-50%)',
						background: 'var(--bg-elevated)',
						border: '1px solid var(--border-secondary)',
						borderRadius: 8,
						padding: '6px 10px',
						fontSize: 'var(--text-2xs)',
						color: 'var(--text-secondary)',
						whiteSpace: 'nowrap',
						zIndex: 200,
						boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
						pointerEvents: 'none',
						animation: 'fadeIn 0.15s ease-out',
					}}
				>
					{content}
					{/* Arrow */}
					<div
						style={{
							position: 'absolute',
							[position === 'top' ? 'bottom' : 'top']: -4,
							left: '50%',
							transform: 'translateX(-50%) rotate(45deg)',
							width: 8,
							height: 8,
							background: 'var(--bg-elevated)',
							borderRight: '1px solid var(--border-secondary)',
							borderBottom:
								position === 'top'
									? '1px solid var(--border-secondary)'
									: 'none',
							borderTop:
								position === 'bottom'
									? '1px solid var(--border-secondary)'
									: 'none',
						}}
					/>
				</div>
			)}
		</div>
	)
}
