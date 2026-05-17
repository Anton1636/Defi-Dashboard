'use client'

import { useState } from 'react'
import { AuthModal } from '@/components/auth/AuthModal'

interface LandingClientProps {
	autoOpen: boolean
}

const STATS = [
	{ label: 'Total Value Locked', value: '$84.4B', change: '+2.1%' },
	{ label: 'Active Protocols', value: '3,200+', change: '+12' },
	{ label: 'Daily Volume', value: '$3.7B', change: '+8.4%' },
]

const FEATURES = [
	{
		icon: '⬡',
		title: 'Multi-chain',
		desc: 'Track positions across Ethereum, Arbitrum, Base, Optimism, Polygon and more in one place.',
	},
	{
		icon: '⚡',
		title: 'Real-time prices',
		desc: 'Live WebSocket price feeds from Binance. Flash animations on every tick.',
	},
	{
		icon: '◎',
		title: 'AI Insights',
		desc: 'Gemini-powered analysis of your portfolio. Ask anything about your positions.',
	},
]

export function LandingClient({ autoOpen }: LandingClientProps) {
	const [modalOpen, setModalOpen] = useState(autoOpen)

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'var(--bg-primary)',
				color: 'var(--text-primary)',
				fontFamily: 'var(--font-inter), system-ui, sans-serif',
			}}
		>
			{/* ─── Nav ──────────────────────────────────────────────────────── */}
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
				}}
			>
				{/* Logo */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

				{/* Sign in button */}
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
						transition: 'opacity 0.15s, transform 0.15s',
						boxShadow: '0 0 20px var(--accent-blue-glow)',
					}}
					onMouseEnter={e => {
						e.currentTarget.style.opacity = '0.88'
						e.currentTarget.style.transform = 'translateY(-1px)'
					}}
					onMouseLeave={e => {
						e.currentTarget.style.opacity = '1'
						e.currentTarget.style.transform = 'translateY(0)'
					}}
				>
					Sign In
				</button>
			</nav>

			{/* ─── Hero ─────────────────────────────────────────────────────── */}
			<section
				style={{
					maxWidth: 900,
					margin: '0 auto',
					padding: '80px 32px 60px',
					textAlign: 'center',
				}}
			>
				{/* Badge */}
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
					Live across 6 chains
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
					Your DeFi portfolio,
					<br />
					all in one place
				</h1>

				<p
					style={{
						fontSize: 17,
						color: 'var(--text-secondary)',
						marginBottom: 36,
						maxWidth: 520,
						margin: '0 auto 36px',
						lineHeight: 1.6,
					}}
				>
					Track positions across Uniswap, Aave and Compound. Real-time prices,
					AI insights, multi-chain support.
				</p>

				{/* CTA */}
				<div
					style={{
						display: 'flex',
						gap: 12,
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
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
							transition: 'all 0.2s',
							boxShadow: '0 0 30px var(--accent-blue-glow)',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.transform = 'translateY(-2px)'
							e.currentTarget.style.boxShadow =
								'0 8px 40px var(--accent-blue-glow)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow =
								'0 0 30px var(--accent-blue-glow)'
						}}
					>
						Connect Wallet
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
							transition: 'all 0.2s',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.borderColor = 'var(--border-accent)'
							e.currentTarget.style.color = 'var(--text-primary)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.borderColor = 'var(--border-secondary)'
							e.currentTarget.style.color = 'var(--text-secondary)'
						}}
					>
						Sign in with Google
					</button>
				</div>
			</section>

			{/* ─── Live stats bar ───────────────────────────────────────────── */}
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

			{/* ─── Features ─────────────────────────────────────────────────── */}
			<section
				style={{
					maxWidth: 900,
					margin: '0 auto 80px',
					padding: '0 32px',
				}}
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
					Everything you need
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

			{/* ─── Footer ───────────────────────────────────────────────────── */}
			<footer
				style={{
					borderTop: '1px solid var(--border-primary)',
					padding: '24px 32px',
					textAlign: 'center',
				}}
			>
				<p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
					DeFi Dashboard · Built with Next.js, Prisma, RainbowKit
				</p>
			</footer>

			{/* ─── Auth Modal ───────────────────────────────────────────────── */}
			<AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	)
}
