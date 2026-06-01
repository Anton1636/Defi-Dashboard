'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { useWallet } from '@/hooks/useWallet'
import { useENS } from '@/hooks/useENS'
import { useTranslation } from '@/hooks/useTranslation'
import { usePriceStore } from '@/store/priceStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { shortAddress } from '@/lib/ens'
import { ChainSelector } from './ChainSelector'

/* ── Ticker strip ── */
function TickerBar() {
	const prices = usePriceStore(s => s.prices)
	const items = ['ETH', 'BTC', 'AAVE', 'UNI', 'LINK', 'COMP']

	const renderItems = () =>
		items.map(name => {
			const p = prices[name]
			const price = p?.price ?? 0
			const change = p?.change24h ?? 0
			const isUp = change >= 0
			return (
				<div key={name} className='ticker-item'>
					<span className='ticker-name'>{name}</span>
					<span className='ticker-val'>
						$
						{price > 1000
							? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
							: price.toFixed(2)}
					</span>
					<span className={isUp ? 'ticker-up' : 'ticker-down'}>
						{isUp ? '↑' : '↓'}
						{Math.abs(change).toFixed(2)}%
					</span>
				</div>
			)
		})

	return (
		<div className='ticker-wrap'>
			<div className='ticker-track'>
				{renderItems()}
				{renderItems()}
			</div>
		</div>
	)
}

/* ── Burger ── */
function Burger() {
	const { toggle } = useSidebarStore()
	return (
		<button
			className='mobile-burger'
			onClick={toggle}
			style={{
				background: 'transparent',
				border: '1px solid var(--border-primary)',
				borderRadius: 8,
				color: 'var(--text-secondary)',
				cursor: 'pointer',
				width: 34,
				height: 34,
				display: 'none',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
				flexShrink: 0,
			}}
		>
			<span
				style={{
					display: 'block',
					width: 14,
					height: 1.5,
					background: 'currentColor',
					borderRadius: 1,
				}}
			/>
			<span
				style={{
					display: 'block',
					width: 14,
					height: 1.5,
					background: 'currentColor',
					borderRadius: 1,
				}}
			/>
			<span
				style={{
					display: 'block',
					width: 9,
					height: 1.5,
					background: 'currentColor',
					borderRadius: 1,
				}}
			/>
		</button>
	)
}

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()
	const { name: ensName, avatar: ensAvatar } = useENS(address)
	const { t } = useTranslation()

	return (
		<div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
			{/* Main bar */}
			<header
				style={{
					height: 'var(--topbar-height)',
					background: 'var(--topbar-bg)',
					backdropFilter: 'blur(24px)',
					WebkitBackdropFilter: 'blur(24px)',
					borderBottom: '1px solid var(--border-primary)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 16px',
					gap: 10,
					position: 'relative',
				}}
			>
				{/* Left */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						flexShrink: 0,
						zIndex: 1,
					}}
				>
					<Burger />
					{/* Search bar */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							background: 'rgba(255,255,255,0.04)',
							border: '1px solid var(--border-primary)',
							borderRadius: 10,
							padding: '7px 14px',
							flex: 1,
							maxWidth: 280,
						}}
					>
						<span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
							⌕
						</span>
						<span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							Search protocols, assets...
						</span>
					</div>
				</div>

				{/* Right */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 7,
						flexShrink: 0,
						zIndex: 1,
					}}
				>
					<ThemeToggle />
					<ModeToggle />
					<LanguageToggle />
					{address && <ChainSelector />}

					{/* Chain indicator */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 6,
							background: 'rgba(255,255,255,0.04)',
							border: '1px solid var(--border-primary)',
							borderRadius: 10,
							padding: '5px 12px',
						}}
					>
						<div
							style={{
								width: 6,
								height: 6,
								borderRadius: '50%',
								background: 'var(--accent-blue)',
								boxShadow: '0 0 6px var(--accent-blue)',
							}}
						/>
						<span
							style={{
								fontSize: 12,
								color: 'var(--text-secondary)',
								fontWeight: 500,
							}}
						>
							Ethereum
						</span>
					</div>

					{/* Wallet */}
					{address && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 7,
								background: 'rgba(123,97,255,0.07)',
								border: '1px solid rgba(123,97,255,0.18)',
								borderRadius: 10,
								padding: '4px 10px',
							}}
						>
							{ensAvatar ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={ensAvatar}
									alt=''
									width={16}
									height={16}
									style={{
										width: 16,
										height: 16,
										borderRadius: '50%',
										objectFit: 'cover',
									}}
								/>
							) : (
								<div
									style={{
										width: 18,
										height: 18,
										borderRadius: '50%',
										background:
											'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
										flexShrink: 0,
									}}
								/>
							)}
							<span
								style={{
									fontSize: 12,
									color: 'rgba(255,255,255,0.7)',
									fontFamily: ensName ? 'inherit' : 'monospace',
									fontWeight: ensName ? 600 : 400,
								}}
							>
								{ensName ?? (address ? shortAddress(address) : '')}
							</span>
							{!ensName && (
								<span
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										borderLeft: '1px solid var(--border-primary)',
										paddingLeft: 6,
										fontFamily: 'monospace',
									}}
								>
									{isLoadingBalance ? '···' : `${ethBalance ?? '0.0000'} ETH`}
								</span>
							)}
						</div>
					)}

					<ConnectButton
						showBalance={false}
						accountStatus='avatar'
						chainStatus='none'
					/>

					<button
						onClick={() => signOut({ callbackUrl: '/' })}
						style={{
							fontSize: 11,
							color: 'var(--text-tertiary)',
							background: 'transparent',
							border: '1px solid var(--border-primary)',
							borderRadius: 7,
							padding: '5px 10px',
							cursor: 'pointer',
							transition: 'all 0.15s',
							whiteSpace: 'nowrap',
							fontWeight: 500,
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
						{t.common.signOut}
					</button>
				</div>
			</header>

			{/* Ticker */}
			<TickerBar />
		</div>
	)
}
