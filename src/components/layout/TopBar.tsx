'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useWallet } from '@/hooks/useWallet'
import { ChainSelector } from './ChainSelector'

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()

	return (
		<header
			style={{
				height: 60,
				background: 'var(--topbar-bg)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				borderBottom: '1px solid var(--border-primary)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 24px',
				position: 'sticky',
				top: 0,
				zIndex: 50,
				transition: 'background 0.25s ease',
			}}
		>
			{/* Left — ETH balance pill */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				{address && (
					<div
						className='topbar-balance'
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							borderRadius: 10,
							padding: '6px 12px',
							transition: 'background 0.25s ease, border-color 0.25s ease',
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: '50%',
								background: 'var(--accent-green)',
								boxShadow: '0 0 8px var(--accent-green)',
								display: 'inline-block',
								animation: 'pulse 2s infinite',
								flexShrink: 0,
							}}
						/>
						<span
							style={{
								fontSize: 13,
								color: 'var(--text-secondary)',
								fontFamily: 'monospace',
							}}
						>
							{isLoadingBalance ? '...' : `${ethBalance ?? '0.0000'} ETH`}
						</span>
					</div>
				)}
			</div>

			{/* Right — controls */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				{/* Theme toggle */}
				<ThemeToggle />

				{/* Chain selector — only if connected */}
				{address && <ChainSelector />}

				<ConnectButton
					showBalance={false}
					accountStatus='avatar'
					chainStatus='none'
				/>

				<button
					className='topbar-signout'
					onClick={() => signOut({ callbackUrl: '/login' })}
					style={{
						fontSize: 13,
						color: 'var(--text-tertiary)',
						background: 'transparent',
						border: '1px solid var(--border-primary)',
						borderRadius: 8,
						padding: '6px 12px',
						cursor: 'pointer',
						transition: 'all 0.15s',
						whiteSpace: 'nowrap',
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
