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
import { useIsClient } from '@/hooks/useIsClient'

type Tab = 'home' | 'portfolio' | 'positions' | 'analytics' | 'ai-insights'
interface LandingClientProps {
	autoOpen: boolean
}

const PortfolioPage = dynamic(
	() => import('@/app/(dashboard)/portfolio/page'),
	{
		ssr: false,
		loading: () => (
			<div
				className='skeleton'
				style={{ height: 400, borderRadius: 16, margin: '20px 0' }}
			/>
		),
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

/* Mini orbital SVG animation for hero */
function MiniOrbital() {
	return (
		<div
			style={{
				position: 'relative',
				width: 260,
				height: 260,
				margin: '0 auto',
			}}
		>
			<svg
				viewBox='0 0 260 260'
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					inset: 0,
				}}
			>
				{/* Rings */}
				<circle
					cx='130'
					cy='130'
					r='60'
					fill='none'
					stroke='rgba(255,255,255,0.06)'
					strokeWidth='1'
					strokeDasharray='4 4'
				/>
				<circle
					cx='130'
					cy='130'
					r='95'
					fill='none'
					stroke='rgba(255,255,255,0.04)'
					strokeWidth='1'
					strokeDasharray='4 4'
				/>
				<circle
					cx='130'
					cy='130'
					r='125'
					fill='none'
					stroke='rgba(255,255,255,0.03)'
					strokeWidth='1'
					strokeDasharray='4 4'
				/>
				{/* Ambient glow behind core */}
				<circle cx='130' cy='130' r='40' fill='rgba(0,229,255,0.04)' />
				<circle cx='130' cy='130' r='28' fill='rgba(123,97,255,0.06)' />
			</svg>

			{/* Core */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%,-50%)',
					width: 72,
					height: 72,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(0,229,255,0.10) 0%,rgba(123,97,255,0.07) 50%,transparent 70%)',
					border: '1px solid rgba(0,229,255,0.2)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					animation: 'mobileBreathe 5s ease-in-out infinite',
					zIndex: 5,
				}}
			>
				<span
					style={{
						fontSize: 9,
						color: 'rgba(255,255,255,0.3)',
						letterSpacing: '0.1em',
						marginBottom: 1,
					}}
				>
					TOTAL
				</span>
				<span
					style={{
						fontSize: 14,
						fontWeight: 900,
						color: '#fff',
						letterSpacing: '-0.5px',
					}}
				>
					$24.8K
				</span>
			</div>

			{/* Planet 1 — Uniswap (orbit at 60px, starting top) */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: 0,
					height: 0,
					animation: 'orbitRotate 18s linear infinite',
				}}
			>
				<div
					style={{
						position: 'absolute',
						transform: 'translateX(60px) translate(-50%,-50%)',
						width: 36,
						height: 36,
						borderRadius: '50%',
						background: 'rgba(255,0,122,0.18)',
						border: '1px solid rgba(255,0,122,0.35)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 15,
					}}
				>
					🦄
				</div>
			</div>
			{/* Planet 2 — Aave (orbit at 95px) */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: 0,
					height: 0,
					animation: 'orbitRotate 28s linear infinite reverse',
				}}
			>
				<div
					style={{
						position: 'absolute',
						transform: 'translateX(95px) translate(-50%,-50%)',
						width: 32,
						height: 32,
						borderRadius: '50%',
						background: 'rgba(123,97,255,0.18)',
						border: '1px solid rgba(123,97,255,0.35)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 14,
					}}
				>
					👻
				</div>
			</div>
			{/* Planet 3 — Compound (orbit at 125px) */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: 0,
					height: 0,
					animation: 'orbitRotate 38s linear infinite',
					animationDelay: '-10s',
				}}
			>
				<div
					style={{
						position: 'absolute',
						transform: 'translateX(125px) translate(-50%,-50%)',
						width: 28,
						height: 28,
						borderRadius: '50%',
						background: 'rgba(0,211,149,0.18)',
						border: '1px solid rgba(0,211,149,0.35)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 13,
					}}
				>
					🏦
				</div>
			</div>
		</div>
	)
}

export function LandingClient({ autoOpen }: LandingClientProps) {
	const [modalOpen, setModalOpen] = useState(autoOpen)
	const [activeTab, setActiveTab] = useState<Tab>('home')
	const isClient = useIsClient()
	const { data: session, status } = useSession()
	const { address } = useWallet()
	const { name: ensName } = useENS(address)
	const { t } = useTranslation()

	const isLoggedIn = isClient && status === 'authenticated' && !!session

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
						height: 'var(--topbar-height)',
						background: 'var(--topbar-bg)',
						backdropFilter: 'blur(24px)',
						WebkitBackdropFilter: 'blur(24px)',
						borderBottom: '1px solid var(--border-primary)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 24px',
						gap: 16,
						position: 'relative',
					}}
				>
					{/* Logo */}
					<div
						onClick={() => setActiveTab('home')}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							cursor: 'pointer',
							flexShrink: 0,
							zIndex: 1,
						}}
					>
						<div
							style={{
								width: 26,
								height: 26,
								borderRadius: '50%',
								border: '1.5px solid rgba(0,229,255,0.5)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 0 12px rgba(0,229,255,0.2)',
							}}
						>
							<div
								style={{
									width: 7,
									height: 7,
									borderRadius: '50%',
									background: 'var(--accent-blue)',
									boxShadow: '0 0 8px var(--accent-blue)',
								}}
							/>
						</div>
						<div>
							<p
								style={{
									fontSize: 13,
									fontWeight: 900,
									letterSpacing: '0.05em',
									lineHeight: 1,
								}}
							>
								NEXORA
							</p>
							<p
								style={{
									fontSize: 8,
									color: 'var(--text-tertiary)',
									letterSpacing: '0.14em',
								}}
							>
								LIQUIDITY GALAXY
							</p>
						</div>
					</div>

					{/* Right */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							flexShrink: 0,
							zIndex: 1,
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
											background: 'rgba(123,97,255,0.07)',
											border: '1px solid rgba(123,97,255,0.18)',
											borderRadius: 10,
											padding: '5px 10px',
										}}
									>
										<div
											style={{
												width: 5,
												height: 5,
												borderRadius: '50%',
												background: 'var(--accent-lime)',
												boxShadow: '0 0 6px var(--accent-lime)',
												animation: 'pulse 2s infinite',
											}}
										/>
										<span
											style={{
												fontSize: 12,
												color: 'rgba(255,255,255,0.65)',
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
										background: 'transparent',
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
									background:
										'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
									color: '#fff',
									border: 'none',
									borderRadius: 10,
									padding: '8px 20px',
									fontSize: 13,
									fontWeight: 800,
									cursor: 'pointer',
									boxShadow: '0 0 20px rgba(0,229,255,0.2)',
								}}
							>
								{t.landing.signIn}
							</button>
						)}
					</div>
				</nav>
				<TickerStrip />
			</div>

			{/* Dashboard tabs */}
			{activeTab !== 'home' ? (
				<div
					className='warp-in'
					style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}
				>
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
							maxWidth: 760,
							margin: '0 auto',
							padding: 'clamp(40px,6vw,80px) 24px 40px',
							textAlign: 'center',
							position: 'relative',
						}}
					>
						{/* Background glow */}
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%,-60%)',
								width: 500,
								height: 500,
								borderRadius: '50%',
								background:
									'radial-gradient(circle,rgba(123,97,255,0.06) 0%,transparent 60%)',
								pointerEvents: 'none',
							}}
						/>

						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 6,
								padding: '5px 14px',
								borderRadius: 20,
								fontSize: 11,
								fontWeight: 700,
								background: 'rgba(0,229,255,0.07)',
								border: '1px solid rgba(0,229,255,0.18)',
								color: 'var(--accent-blue)',
								marginBottom: 24,
								letterSpacing: '0.04em',
								position: 'relative',
							}}
						>
							<div
								style={{
									width: 5,
									height: 5,
									borderRadius: '50%',
									background: 'var(--accent-blue)',
									animation: 'pulse 2s infinite',
								}}
							/>
							{t.landing.badge}
						</div>

						<h1
							style={{
								fontSize: 'clamp(38px,6vw,60px)',
								fontWeight: 900,
								letterSpacing: '-2.5px',
								lineHeight: 1.05,
								marginBottom: 18,
								position: 'relative',
							}}
						>
							{t.landing.headline.split('\n').map((line, i) => (
								<span key={i}>
									{i === 0 ? (
										line
									) : (
										<span
											style={{
												background:
													'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
												WebkitBackgroundClip: 'text',
												WebkitTextFillColor: 'transparent',
											}}
										>
											{line}
										</span>
									)}
									{i === 0 && <br />}
								</span>
							))}
						</h1>

						<p
							style={{
								fontSize: 16,
								color: 'var(--text-secondary)',
								maxWidth: 460,
								margin: '0 auto 32px',
								lineHeight: 1.65,
								position: 'relative',
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
								marginBottom: 40,
								position: 'relative',
							}}
						>
							{isLoggedIn ? (
								<button
									onClick={() => setActiveTab('portfolio')}
									style={{
										background:
											'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
										color: '#fff',
										border: 'none',
										borderRadius: 12,
										padding: '13px 32px',
										fontSize: 15,
										fontWeight: 800,
										cursor: 'pointer',
										boxShadow: '0 0 28px rgba(0,229,255,0.2)',
										letterSpacing: '-0.3px',
									}}
								>
									⬡ {t.landing.goToPortfolio}
								</button>
							) : (
								<>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background:
												'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
											color: '#fff',
											border: 'none',
											borderRadius: 12,
											padding: '13px 32px',
											fontSize: 15,
											fontWeight: 800,
											cursor: 'pointer',
											boxShadow: '0 0 28px rgba(0,229,255,0.2)',
										}}
									>
										⬡ {t.landing.connectWallet}
									</button>
									<button
										onClick={() => setModalOpen(true)}
										style={{
											background: 'rgba(255,255,255,0.04)',
											color: 'var(--text-secondary)',
											border: '1px solid var(--border-secondary)',
											borderRadius: 12,
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

						{/* Mini orbital */}
						<MiniOrbital />
					</section>

					{/* Stats */}
					<section
						style={{
							maxWidth: 720,
							margin: '0 auto 56px',
							padding: '0 24px',
							display: 'grid',
							gridTemplateColumns: 'repeat(3,1fr)',
							gap: 10,
						}}
					>
						{[
							{ label: t.landing.stats.tvl, value: '$84.4B', chg: '+2.1%' },
							{
								label: t.landing.stats.protocols,
								value: '3,200+',
								chg: 'Active',
							},
							{ label: t.landing.stats.volume, value: '$3.7B', chg: '+8.4%' },
						].map(s => (
							<div
								key={s.label}
								style={{
									background: 'rgba(255,255,255,0.02)',
									border: '1px solid var(--border-primary)',
									borderRadius: 14,
									padding: '18px 20px',
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
										marginBottom: 8,
									}}
								>
									{s.label}
								</p>
								<p
									style={{
										fontSize: 26,
										fontWeight: 900,
										letterSpacing: '-1px',
										marginBottom: 4,
									}}
								>
									{s.value}
								</p>
								<p
									style={{
										fontSize: 11,
										color: 'var(--accent-lime)',
										fontWeight: 600,
									}}
								>
									↑ {s.chg}
								</p>
							</div>
						))}
					</section>

					{/* Features */}
					<section
						style={{ maxWidth: 720, margin: '0 auto 64px', padding: '0 24px' }}
					>
						<p
							style={{
								textAlign: 'center',
								fontSize: 10,
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '0.14em',
								color: 'var(--text-tertiary)',
								marginBottom: 20,
							}}
						>
							{t.landing.features.title}
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
								gap: 10,
							}}
						>
							{[
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
							].map(f => (
								<div
									key={f.title}
									style={{
										background: 'rgba(255,255,255,0.02)',
										border: '1px solid var(--border-primary)',
										borderRadius: 14,
										padding: 20,
										transition: 'border-color 0.2s',
									}}
									onMouseEnter={e => {
										e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)'
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
											background: 'rgba(0,229,255,0.07)',
											border: '1px solid rgba(0,229,255,0.14)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 16,
											marginBottom: 12,
										}}
									>
										{f.icon}
									</div>
									<p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
										{f.title}
									</p>
									<p
										style={{
											fontSize: 12,
											color: 'var(--text-secondary)',
											lineHeight: 1.55,
										}}
									>
										{f.desc}
									</p>
								</div>
							))}
						</div>
					</section>

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
