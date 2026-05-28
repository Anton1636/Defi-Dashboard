'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWallet } from '@/hooks/useWallet'
import { useENS } from '@/hooks/useENS'
import { useTranslation } from '@/hooks/useTranslation'
import { usePriceStore } from '@/store/priceStore'
import { shortAddress } from '@/lib/ens'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ModeToggle } from '@/components/ui/ModeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { AuthModal } from '@/components/auth/AuthModal'
import { PriceProvider } from '@/components/providers/PriceProvider'
import dynamic from 'next/dynamic'

type Tab = 'home' | 'portfolio' | 'positions' | 'analytics' | 'ai-insights'

interface LandingClientProps {
	autoOpen: boolean
}

const PortfolioPage = dynamic(
	() => import('@/app/(dashboard)/portfolio/page'),
	{
		loading: () => (
			<div className='skeleton' style={{ height: 400, borderRadius: 14 }} />
		),
		ssr: false,
	},
)
const PositionsPage = dynamic(
	() => import('@/app/(dashboard)/positions/page'),
	{ ssr: false },
)
const AnalyticsPage = dynamic(
	() => import('@/app/(dashboard)/analytics/page'),
	{ ssr: false },
)
const AIInsightsPage = dynamic(
	() => import('@/app/(dashboard)/ai-insights/page'),
	{ ssr: false },
)

function TickerStrip() {
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

export function LandingClient({ autoOpen }: LandingClientProps) {
	const [modalOpen, setModalOpen] = useState(autoOpen)
	const [activeTab, setActiveTab] = useState<Tab>('home')
	const { data: session, status } = useSession()
	const isLoggedIn = status === 'authenticated' && !!session
	const { address } = useWallet()
	const { name: ensName } = useENS(address)
	const { t } = useTranslation()

	const NAV_LINKS: { tab: Tab; label: string }[] = [
		{ tab: 'portfolio', label: t.nav.portfolio },
		{ tab: 'positions', label: t.nav.positions },
		{ tab: 'analytics', label: t.nav.analytics },
		{ tab: 'ai-insights', label: t.nav.aiInsights },
	]

	const STATS = [
		{ label: t.landing.stats.tvl, value: '$84.4B', change: '+2.1%' },
		{ label: t.landing.stats.protocols, value: '3,200+', change: '+12' },
		{ label: t.landing.stats.volume, value: '$3.7B', change: '+8.4%' },
	]

	const FEATURES = [
		{
			icon: '⬡',
			title: t.landing.features.multichain.title,
			desc: t.landing.features.multichain.desc,
		},
		{
			icon: '⚡',
			title: t.landing.features.realtime.title,
			desc: t.landing.features.realtime.desc,
		},
		{
			icon: '◎',
			title: t.landing.features.ai.title,
			desc: t.landing.features.ai.desc,
		},
	]

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'var(--bg-primary)',
				color: 'var(--text-primary)',
			}}
		>
			{isLoggedIn && <PriceProvider />}

			{/* Topbar */}
			<div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
				<nav
					style={{
						height: 56,
						background: 'var(--topbar-bg)',
						backdropFilter: 'blur(20px)',
						WebkitBackdropFilter: 'blur(20px)',
						borderBottom: '1px solid var(--border-primary)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 24px',
						gap: 16,
					}}
				>
					{/* Logo */}
					<div
						onClick={() => setActiveTab('home')}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							cursor: 'pointer',
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
							style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}
						>
							DEFI<span style={{ color: 'var(--accent-blue)' }}>.</span>IO
						</span>
					</div>

					{/* Center tabs — logged in */}
					{isLoggedIn && (
						<div
							style={{
								position: 'absolute',
								left: '50%',
								transform: 'translateX(-50%)',
								display: 'flex',
								gap: 2,
							}}
						>
							{NAV_LINKS.map(link => {
								const isActive = activeTab === link.tab
								return (
									<button
										key={link.tab}
										onClick={() => setActiveTab(link.tab)}
										onMouseEnter={() => {
											if (!isActive)
												import(
													`@/app/(dashboard)/${link.tab === 'ai-insights' ? 'ai-insights' : link.tab}/page`
												)
										}}
										style={{
											background: isActive ? 'var(--bg-card)' : 'transparent',
											border: `1px solid ${isActive ? 'var(--border-primary)' : 'transparent'}`,
											borderRadius: 8,
											padding: '6px 14px',
											fontSize: 13,
											fontWeight: isActive ? 600 : 400,
											color: isActive
												? 'var(--text-primary)'
												: 'var(--text-secondary)',
											cursor: 'pointer',
											transition: 'all 0.15s',
											whiteSpace: 'nowrap',
										}}
									>
										{link.label}
									</button>
								)
							})}
						</div>
					)}

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

						{isLoggedIn ? (
							<>
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
										<span
											style={{
												fontSize: 12,
												color: 'var(--text-secondary)',
												fontFamily: ensName ? 'inherit' : 'monospace',
												fontWeight: ensName ? 600 : 400,
											}}
										>
											{ensName ?? (address ? shortAddress(address) : '')}
										</span>
									</div>
								)}
								<button
									onClick={() => setActiveTab('home')}
									style={{
										background:
											activeTab === 'home' ? 'var(--bg-card)' : 'transparent',
										color: 'var(--text-tertiary)',
										border: '1px solid var(--border-primary)',
										borderRadius: 8,
										padding: '6px 12px',
										fontSize: 12,
										fontWeight: 500,
										cursor: 'pointer',
										transition: 'all 0.15s',
									}}
								>
									{t.nav.home}
								</button>
							</>
						) : (
							<button
								onClick={() => setModalOpen(true)}
								style={{
									background: 'var(--accent-blue)',
									color: '#000',
									border: 'none',
									borderRadius: 8,
									padding: '7px 18px',
									fontSize: 13,
									fontWeight: 800,
									cursor: 'pointer',
									boxShadow: '0 0 20px var(--accent-blue-glow)',
									transition: 'all 0.15s',
								}}
							>
								{t.landing.signIn}
							</button>
						)}
					</div>
				</nav>

				{/* Ticker */}
				<TickerStrip />
			</div>

			{/* Dashboard tabs */}
			{activeTab !== 'home' ? (
				<div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
					{activeTab === 'portfolio' && <PortfolioPage />}
					{activeTab === 'positions' && <PositionsPage />}
					{activeTab === 'analytics' && <AnalyticsPage />}
					{activeTab === 'ai-insights' && <AIInsightsPage />}
				</div>
			) : (
				<>
					{/* Hero */}
					<section
						style={{
							maxWidth: 800,
							margin: '0 auto',
							padding: 'clamp(48px, 8vw, 96px) 24px 64px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 6,
								background: 'rgba(0,212,255,0.08)',
								border: '1px solid rgba(0,212,255,0.2)',
								borderRadius: 20,
								padding: '4px 14px',
								fontSize: 11,
								color: 'var(--accent-blue)',
								fontWeight: 600,
								marginBottom: 28,
								letterSpacing: '0.02em',
							}}
						>
							<span
								style={{
									width: 5,
									height: 5,
									borderRadius: '50%',
									background: 'var(--accent-blue)',
									animation: 'pulse 2s infinite',
									display: 'inline-block',
								}}
							/>
							{t.landing.badge}
						</div>

						<h1
							style={{
								fontSize: 'clamp(40px, 7vw, 68px)',
								fontWeight: 900,
								letterSpacing: '-3px',
								lineHeight: 1.05,
								marginBottom: 20,
								color: 'var(--text-primary)',
							}}
						>
							{t.landing.headline.split('\n').map((line, i) => (
								<span key={i}>
									{i === 0 ? (
										line
									) : (
										<span style={{ color: 'var(--accent-blue)' }}>{line}</span>
									)}
									{i === 0 && <br />}
								</span>
							))}
						</h1>

						<p
							style={{
								fontSize: 16,
								color: 'var(--text-secondary)',
								maxWidth: 480,
								margin: '0 auto 40px',
								lineHeight: 1.65,
							}}
						>
							{t.landing.subtitle}
						</p>

						<div
							style={{
								display: 'flex',
								gap: 10,
								justifyContent: 'center',
								flexWrap: 'wrap',
							}}
						>
							{isLoggedIn ? (
								<button
									onClick={() => setActiveTab('portfolio')}
									style={{
										background: 'var(--accent-blue)',
										color: '#000',
										border: 'none',
										borderRadius: 10,
										padding: '13px 32px',
										fontSize: 15,
										fontWeight: 800,
										cursor: 'pointer',
										boxShadow: '0 0 30px var(--accent-blue-glow)',
										letterSpacing: '-0.3px',
									}}
								>
									{t.landing.goToPortfolio}
								</button>
							) : (
								<>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background: 'var(--accent-blue)',
											color: '#000',
											border: 'none',
											borderRadius: 10,
											padding: '13px 32px',
											fontSize: 15,
											fontWeight: 800,
											cursor: 'pointer',
											boxShadow: '0 0 30px var(--accent-blue-glow)',
										}}
									>
										{t.landing.connectWallet}
									</button>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background: 'var(--bg-card)',
											color: 'var(--text-secondary)',
											border: '1px solid var(--border-secondary)',
											borderRadius: 10,
											padding: '13px 32px',
											fontSize: 15,
											fontWeight: 600,
											cursor: 'pointer',
										}}
									>
										{t.landing.signInGoogle}
									</button>
								</>
							)}
						</div>
					</section>

					{/* Stats */}
					<section
						style={{
							maxWidth: 800,
							margin: '0 auto 72px',
							padding: '0 24px',
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 10,
						}}
					>
						{STATS.map(stat => (
							<div
								key={stat.label}
								style={{
									background: 'var(--bg-card)',
									border: '1px solid var(--border-primary)',
									borderRadius: 12,
									padding: '20px 20px',
									textAlign: 'center',
								}}
							>
								<p
									style={{
										fontSize: 10,
										color: 'var(--text-tertiary)',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: '0.1em',
										marginBottom: 10,
									}}
								>
									{stat.label}
								</p>
								<p
									style={{
										fontSize: 26,
										fontWeight: 800,
										letterSpacing: '-1px',
										color: 'var(--text-primary)',
										marginBottom: 4,
									}}
								>
									{stat.value}
								</p>
								<p
									style={{
										fontSize: 11,
										color: 'var(--accent-green)',
										fontWeight: 600,
									}}
								>
									↑ {stat.change}
								</p>
							</div>
						))}
					</section>

					{/* Features */}
					<section
						style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 24px' }}
					>
						<p
							style={{
								textAlign: 'center',
								fontSize: 10,
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '0.12em',
								color: 'var(--text-tertiary)',
								marginBottom: 24,
							}}
						>
							{t.landing.features.title}
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gap: 10,
							}}
						>
							{FEATURES.map(f => (
								<div
									key={f.title}
									style={{
										background: 'var(--bg-card)',
										border: '1px solid var(--border-primary)',
										borderRadius: 12,
										padding: 20,
										transition: 'border-color 0.2s',
									}}
									onMouseEnter={e => {
										e.currentTarget.style.borderColor = 'var(--border-accent)'
									}}
									onMouseLeave={e => {
										e.currentTarget.style.borderColor = 'var(--border-primary)'
									}}
								>
									<div
										style={{
											width: 36,
											height: 36,
											borderRadius: 10,
											background: 'rgba(0,212,255,0.08)',
											border: '1px solid rgba(0,212,255,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 16,
											marginBottom: 12,
										}}
									>
										{f.icon}
									</div>
									<p
										style={{
											fontSize: 14,
											fontWeight: 700,
											marginBottom: 6,
											color: 'var(--text-primary)',
										}}
									>
										{f.title}
									</p>
									<p
										style={{
											fontSize: 12,
											color: 'var(--text-secondary)',
											lineHeight: 1.5,
										}}
									>
										{f.desc}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Footer */}
					<footer
						style={{
							borderTop: '1px solid var(--border-primary)',
							padding: '20px 24px',
							textAlign: 'center',
						}}
					>
						<p
							style={{
								fontSize: 11,
								color: 'var(--text-tertiary)',
								fontWeight: 500,
							}}
						>
							{t.landing.footer}
						</p>
					</footer>
				</>
			)}

			<AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
