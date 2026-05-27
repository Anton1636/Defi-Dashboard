'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useWallet } from '@/hooks/useWallet'
import { useENS } from '@/hooks/useENS'
import { useTranslation } from '@/hooks/useTranslation'
import { shortAddress } from '@/lib/ens'
import { PriceTicker } from '@/components/ui/PriceTicker'
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
			<div className='skeleton' style={{ height: 400, borderRadius: 16 }} />
		),
	},
)
const PositionsPage = dynamic(() => import('@/app/(dashboard)/positions/page'))
const AnalyticsPage = dynamic(() => import('@/app/(dashboard)/analytics/page'))
const AIInsightsPage = dynamic(
	() => import('@/app/(dashboard)/ai-insights/page'),
)

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
				fontFamily: 'var(--font-inter), system-ui, sans-serif',
			}}
		>
			{isLoggedIn && <PriceProvider />}

			{/* Nav */}
			<nav
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 50,
					height: 60,
					background: 'var(--topbar-bg)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					borderBottom: '1px solid var(--border-primary)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 32px',
					gap: 16,
				}}
			>
				{/* Logo */}
				<div
					onClick={() => setActiveTab('home')}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						flexShrink: 0,
						cursor: 'pointer',
					}}
				>
					<div
						style={{
							width: 32,
							height: 32,
							borderRadius: 10,
							background: 'var(--gradient-blue)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 20px var(--accent-blue-glow)',
						}}
					>
						<span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
							D
						</span>
					</div>
					<span style={{ fontWeight: 600, fontSize: 15 }}>DeFi Dashboard</span>
				</div>

				{/* Center tabs */}
				{status !== 'loading' && isLoggedIn && (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							display: 'flex',
							alignItems: 'center',
							gap: 2,
						}}
					>
						{NAV_LINKS.map(link => {
							const isActive = activeTab === link.tab
							return (
								<button
									key={link.tab}
									onClick={() => setActiveTab(link.tab)}
									style={{
										background: isActive ? 'var(--bg-elevated)' : 'transparent',
										border: `1px solid ${isActive ? 'var(--border-primary)' : 'transparent'}`,
										borderRadius: 8,
										padding: '7px 14px',
										fontSize: 13,
										fontWeight: isActive ? 600 : 400,
										color: isActive
											? 'var(--text-primary)'
											: 'var(--text-secondary)',
										cursor: 'pointer',
										transition: 'all 0.15s',
										whiteSpace: 'nowrap',
									}}
									onMouseEnter={e => {
										if (!isActive) {
											e.currentTarget.style.color = 'var(--text-primary)'
											e.currentTarget.style.background = 'var(--bg-elevated)'
										}
									}}
									onMouseLeave={e => {
										if (!isActive) {
											e.currentTarget.style.color = 'var(--text-secondary)'
											e.currentTarget.style.background = 'transparent'
										}
									}}
								>
									{link.label}
								</button>
							)
						})}
					</div>
				)}

				{/* Right */}
				{status === 'loading' ? (
					<div style={{ width: 100 }} />
				) : isLoggedIn ? (
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
						{/* ETH price */}
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
						{/* ENS / address */}
						{address && (
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
										fontSize: 12,
										color: 'var(--text-secondary)',
										fontFamily: ensName ? 'inherit' : 'monospace',
										fontWeight: ensName ? 500 : 400,
									}}
								>
									{ensName ?? shortAddress(address)}
								</span>
							</div>
						)}
						<button
							onClick={() => setActiveTab('home')}
							style={{
								background:
									activeTab === 'home' ? 'var(--bg-elevated)' : 'transparent',
								color: 'var(--text-tertiary)',
								border: '1px solid var(--border-primary)',
								borderRadius: 10,
								padding: '7px 16px',
								fontSize: 13,
								fontWeight: 500,
								cursor: 'pointer',
								transition: 'all 0.15s',
								flexShrink: 0,
							}}
						>
							{t.nav.home}
						</button>
					</div>
				) : (
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<ThemeToggle />
						<LanguageToggle />
						<button
							onClick={() => setModalOpen(true)}
							style={{
								background: 'var(--gradient-blue)',
								color: '#fff',
								border: 'none',
								borderRadius: 10,
								padding: '8px 20px',
								fontSize: 14,
								fontWeight: 600,
								cursor: 'pointer',
								boxShadow: '0 0 20px var(--accent-blue-glow)',
								flexShrink: 0,
							}}
						>
							{t.landing.signIn}
						</button>
					</div>
				)}
			</nav>

			{/* Content */}
			{activeTab !== 'home' ? (
				<div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
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
							maxWidth: 900,
							margin: '0 auto',
							padding: '80px 32px 60px',
							textAlign: 'center',
						}}
					>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 6,
								background: 'var(--accent-blue-glow)',
								border: '1px solid var(--border-accent)',
								borderRadius: 20,
								padding: '4px 14px',
								fontSize: 12,
								color: 'var(--accent-blue)',
								fontWeight: 500,
								marginBottom: 28,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
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
								fontSize: 'clamp(36px, 6vw, 64px)',
								fontWeight: 800,
								letterSpacing: '-2px',
								lineHeight: 1.1,
								marginBottom: 20,
								background:
									'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}
						>
							{t.landing.headline.split('\n').map((line, i) => (
								<span key={i}>
									{line}
									{i === 0 && <br />}
								</span>
							))}
						</h1>
						<p
							style={{
								fontSize: 17,
								color: 'var(--text-secondary)',
								maxWidth: 520,
								margin: '0 auto 36px',
								lineHeight: 1.6,
							}}
						>
							{t.landing.subtitle}
						</p>
						<div
							style={{
								display: 'flex',
								gap: 12,
								justifyContent: 'center',
								flexWrap: 'wrap',
							}}
						>
							{isLoggedIn ? (
								<button
									onClick={() => setActiveTab('portfolio')}
									style={{
										background: 'var(--gradient-blue)',
										color: '#fff',
										border: 'none',
										borderRadius: 12,
										padding: '14px 32px',
										fontSize: 15,
										fontWeight: 600,
										cursor: 'pointer',
										boxShadow: '0 0 30px var(--accent-blue-glow)',
									}}
								>
									{t.landing.goToPortfolio}
								</button>
							) : (
								<>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background: 'var(--gradient-blue)',
											color: '#fff',
											border: 'none',
											borderRadius: 12,
											padding: '14px 32px',
											fontSize: 15,
											fontWeight: 600,
											cursor: 'pointer',
											boxShadow: '0 0 30px var(--accent-blue-glow)',
										}}
									>
										{t.landing.connectWallet}
									</button>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background: 'transparent',
											color: 'var(--text-secondary)',
											border: '1px solid var(--border-secondary)',
											borderRadius: 12,
											padding: '14px 32px',
											fontSize: 15,
											fontWeight: 500,
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
							maxWidth: 900,
							margin: '0 auto 64px',
							padding: '0 32px',
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 16,
						}}
					>
						{STATS.map(stat => (
							<div
								key={stat.label}
								className='card'
								style={{ padding: '20px 24px', textAlign: 'center' }}
							>
								<p
									style={{
										fontSize: 11,
										color: 'var(--text-tertiary)',
										fontWeight: 500,
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										marginBottom: 8,
									}}
								>
									{stat.label}
								</p>
								<p
									style={{
										fontSize: 28,
										fontWeight: 700,
										letterSpacing: '-1px',
										marginBottom: 4,
									}}
								>
									{stat.value}
								</p>
								<p
									style={{
										fontSize: 12,
										color: 'var(--accent-green)',
										fontWeight: 500,
									}}
								>
									↑ {stat.change}
								</p>
							</div>
						))}
					</section>

					{/* Features */}
					<section
						style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 32px' }}
					>
						<p
							style={{
								textAlign: 'center',
								fontSize: 11,
								fontWeight: 500,
								textTransform: 'uppercase',
								letterSpacing: '0.1em',
								color: 'var(--text-tertiary)',
								marginBottom: 32,
							}}
						>
							{t.landing.features.title}
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gap: 16,
							}}
						>
							{FEATURES.map(f => (
								<div
									key={f.title}
									className='card card-lift'
									style={{ padding: 24 }}
								>
									<div
										style={{
											width: 40,
											height: 40,
											borderRadius: 10,
											background: 'var(--accent-blue-glow)',
											border: '1px solid var(--border-accent)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 18,
											marginBottom: 14,
										}}
									>
										{f.icon}
									</div>
									<p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
										{f.title}
									</p>
									<p
										style={{
											fontSize: 13,
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
							padding: '24px 32px',
							textAlign: 'center',
						}}
					>
						<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							{t.landing.footer}
						</p>
					</footer>
				</>
			)}

			<AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
