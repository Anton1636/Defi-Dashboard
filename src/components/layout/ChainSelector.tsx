'use client'

import { useState, useRef, useEffect } from 'react'
import { useChain } from '@/hooks/useChain'
import { CHAINS, SUPPORTED_CHAIN_IDS } from '@/lib/chains'

export function ChainSelector() {
	const { activeChainId, chainConfig, switchToChain, isSwitching } = useChain()
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div ref={dropdownRef} style={{ position: 'relative' }}>
			{/* Trigger button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				disabled={isSwitching}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					padding: '6px 12px',
					borderRadius: '10px',
					background: 'var(--bg-elevated)',
					border: `1px solid ${chainConfig.color}44`,
					color: 'var(--text-primary)',
					fontSize: '13px',
					fontWeight: 500,
					cursor: isSwitching ? 'not-allowed' : 'pointer',
					opacity: isSwitching ? 0.7 : 1,
					transition: 'all 0.15s',
				}}
			>
				<span style={{ fontSize: '16px' }}>{chainConfig.icon}</span>
				<span style={{ color: chainConfig.color }}>
					{chainConfig.shortName}
				</span>
				{/* Chevron */}
				<svg
					width='12'
					height='12'
					viewBox='0 0 24 24'
					fill='none'
					stroke='var(--text-tertiary)'
					strokeWidth='2'
					style={{
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
						transition: 'transform 0.2s',
					}}
				>
					<path d='M6 9l6 6 6-6' />
				</svg>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div
					style={{
						position: 'absolute',
						top: 'calc(100% + 8px)',
						right: 0,
						width: '200px',
						background: 'var(--bg-elevated)',
						border: '1px solid var(--border-secondary)',
						borderRadius: '12px',
						padding: '6px',
						zIndex: 100,
						boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
					}}
				>
					<p
						style={{
							fontSize: '11px',
							color: 'var(--text-tertiary)',
							padding: '4px 8px 8px',
							fontWeight: 500,
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
						}}
					>
						Select network
					</p>

					{SUPPORTED_CHAIN_IDS.map(chainId => {
						const chain = CHAINS[chainId]
						const isActive = chainId === activeChainId

						return (
							<button
								key={chainId}
								onClick={() => {
									switchToChain(chainId)
									setIsOpen(false)
								}}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
									width: '100%',
									padding: '8px 10px',
									borderRadius: '8px',
									background: isActive ? chain.glow : 'transparent',
									border: 'none',
									cursor: 'pointer',
									transition: 'background 0.15s',
									textAlign: 'left',
								}}
								onMouseEnter={e => {
									if (!isActive) {
										e.currentTarget.style.background = 'var(--bg-card)'
									}
								}}
								onMouseLeave={e => {
									if (!isActive) {
										e.currentTarget.style.background = 'transparent'
									}
								}}
							>
								<span style={{ fontSize: '18px' }}>{chain.icon}</span>
								<div style={{ flex: 1 }}>
									<p
										style={{
											fontSize: '13px',
											fontWeight: 500,
											color: isActive ? chain.color : 'var(--text-primary)',
										}}
									>
										{chain.name}
									</p>
									<p
										style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}
									>
										{chain.supportedProtocols.join(', ')}
									</p>
								</div>
								{/* Active indicator */}
								{isActive && (
									<div
										style={{
											width: '6px',
											height: '6px',
											borderRadius: '50%',
											background: chain.color,
											boxShadow: `0 0 6px ${chain.color}`,
										}}
									/>
								)}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
