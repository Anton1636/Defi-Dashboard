'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/hooks/useWallet'
import { signOut } from 'next-auth/react'

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()

	return (
		<header
			style={{
				height: '60px',
				background: 'rgba(17, 17, 24, 0.8)',
				backdropFilter: 'blur(20px)',
				borderBottom: '1px solid var(--border-primary)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 24px',
				position: 'sticky',
				top: 0,
				zIndex: 50,
			}}
		>
			{/* ETH balance */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				{address && (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							borderRadius: '10px',
							padding: '6px 12px',
						}}
					>
						{/* Pulse dot */}
						<span
							style={{
								width: '6px',
								height: '6px',
								borderRadius: '50%',
								background: 'var(--accent-green)',
								boxShadow: '0 0 8px var(--accent-green)',
								display: 'inline-block',
								animation: 'pulse 2s infinite',
							}}
						/>
						<span
							style={{
								fontSize: '13px',
								color: 'var(--text-secondary)',
								fontFamily: 'var(--font-mono)',
							}}
						>
							{isLoadingBalance ? '...' : `${ethBalance ?? '0.0000'} ETH`}
						</span>
					</div>
				)}
			</div>

			{/* Right side */}
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<ConnectButton
					showBalance={false}
					accountStatus='avatar'
					chainStatus='icon'
				/>
				<button
					onClick={() => signOut({ callbackUrl: '/login' })}
					style={{
						fontSize: '13px',
						color: 'var(--text-tertiary)',
						background: 'transparent',
						border: '1px solid var(--border-primary)',
						borderRadius: '8px',
						padding: '6px 12px',
						cursor: 'pointer',
						transition: 'all 0.15s',
					}}
					onMouseEnter={e => {
						e.currentTarget.style.color = 'var(--text-secondary)'
						e.currentTarget.style.borderColor = 'var(--border-secondary)'
					}}
					onMouseLeave={e => {
						e.currentTarget.style.color = 'var(--text-tertiary)'
						e.currentTarget.style.borderColor = 'var(--border-primary)'
					}}
				>
					Sign out
				</button>
			</div>
		</header>
	)
}
