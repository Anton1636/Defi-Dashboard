'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PriceTicker } from '@/components/ui/PriceTicker'
import { useWallet } from '@/hooks/useWallet'
import { useENS } from '@/hooks/useENS'
import { shortAddress } from '@/lib/ens'
import { ChainSelector } from './ChainSelector'

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()
	const { name: ensName, avatar: ensAvatar } = useENS(address)

	const displayName = ensName ?? (address ? shortAddress(address) : null)

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
			{/* Left */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
						}}
					>
						{ensAvatar ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={ensAvatar}
								alt={ensName ?? address}
								width={18}
								height={18}
								style={{
									width: 18,
									height: 18,
									borderRadius: '50%',
									objectFit: 'cover',
									flexShrink: 0,
								}}
							/>
						) : (
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
						)}
						<span
							style={{
								fontSize: 13,
								color: ensName
									? 'var(--text-primary)'
									: 'var(--text-secondary)',
								fontFamily: ensName ? 'inherit' : 'monospace',
								fontWeight: ensName ? 500 : 400,
							}}
						>
							{displayName}
						</span>
						<span
							style={{
								fontSize: 12,
								color: 'var(--text-tertiary)',
								borderLeft: '1px solid var(--border-primary)',
								paddingLeft: 8,
								fontFamily: 'monospace',
							}}
						>
							{isLoadingBalance ? '...' : `${ethBalance ?? '0.0000'} ETH`}
						</span>
					</div>
				)}

				{/* Live ETH price */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						background: 'var(--bg-elevated)',
						border: '1px solid var(--border-primary)',
						borderRadius: 10,
						padding: '6px 12px',
					}}
				>
					<span
						style={{
							fontSize: 12,
							color: 'var(--text-tertiary)',
							fontWeight: 500,
						}}
					>
						ETH
					</span>
					<PriceTicker symbol='ETH' showChange size='sm' />
				</div>
			</div>

			{/* Right */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<ThemeToggle />
				{address && <ChainSelector />}
				<ConnectButton
					showBalance={false}
					accountStatus='avatar'
					chainStatus='none'
				/>
				<button
					className='topbar-signout'
					onClick={() => signOut({ callbackUrl: '/' })}
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
