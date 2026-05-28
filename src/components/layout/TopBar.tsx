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
import { shortAddress } from '@/lib/ens'
import { ChainSelector } from './ChainSelector'

function TickerBar() {
	const prices = usePriceStore(s => s.prices)

	const items = [
		{ name: 'ETH', symbol: 'ETH' },
		{ name: 'BTC', symbol: 'BTC' },
		{ name: 'AAVE', symbol: 'AAVE' },
		{ name: 'UNI', symbol: 'UNI' },
		{ name: 'LINK', symbol: 'LINK' },
		{ name: 'COMP', symbol: 'COMP' },
	]

	const renderItems = () =>
		items.map(item => {
			const p = prices[item.name]
			const price = p?.price ?? 0
			const change = p?.change24h ?? 0
			const isUp = change >= 0

			return (
				<div key={item.name} className='ticker-item'>
					<span className='ticker-name'>{item.name}</span>
					<span className='ticker-val'>
						$
						{price > 1000
							? price.toLocaleString('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0,
								})
							: price.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
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

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()
	const { name: ensName, avatar: ensAvatar } = useENS(address)
	const { t } = useTranslation()

	const displayName = ensName ?? (address ? shortAddress(address) : null)

	return (
		<div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
			{/* Main bar */}
			<header
				style={{
					height: 56,
					background: 'var(--topbar-bg)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					borderBottom: '1px solid var(--border-primary)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 20px',
					gap: 12,
				}}
			>
				{/* Left — logo */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						flexShrink: 0,
					}}
				>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 8,
							background:
								'linear-gradient(135deg, var(--accent-blue), #0066cc)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 16px var(--accent-blue-glow)',
						}}
					>
						<span style={{ color: '#000', fontWeight: 800, fontSize: 13 }}>
							D
						</span>
					</div>
					<span
						style={{
							fontWeight: 800,
							fontSize: 16,
							letterSpacing: '-0.5px',
							color: 'var(--text-primary)',
						}}
					>
						DEFI<span style={{ color: 'var(--accent-blue)' }}>.</span>IO
					</span>
				</div>

				{/* Right */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						flexShrink: 0,
					}}
				>
					<ThemeToggle />
					<ModeToggle />
					<LanguageToggle />

					{address && <ChainSelector />}

					{/* Balance */}
					{address && (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 6,
								background: 'var(--bg-card)',
								border: '1px solid var(--border-primary)',
								borderRadius: 8,
								padding: '5px 10px',
							}}
						>
							{ensAvatar ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={ensAvatar}
									alt={ensName ?? address}
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
								<span
									style={{
										width: 5,
										height: 5,
										borderRadius: '50%',
										background: 'var(--accent-green)',
										boxShadow: '0 0 6px var(--accent-green)',
										display: 'inline-block',
										animation: 'pulse 2s infinite',
									}}
								/>
							)}
							<span
								style={{
									fontSize: 12,
									color: 'var(--text-secondary)',
									fontFamily: ensName ? 'inherit' : 'monospace',
									fontWeight: ensName ? 600 : 400,
								}}
							>
								{displayName}
							</span>
							<span
								style={{
									fontSize: 11,
									color: 'var(--text-tertiary)',
									borderLeft: '1px solid var(--border-primary)',
									paddingLeft: 7,
									fontFamily: 'monospace',
								}}
							>
								{isLoadingBalance ? '···' : `${ethBalance ?? '0.0000'} ETH`}
							</span>
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
							fontSize: 12,
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

			{/* Ticker strip */}
			<TickerBar />
		</div>
	)
}
