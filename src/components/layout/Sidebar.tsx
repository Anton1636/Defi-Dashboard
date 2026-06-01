'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useSidebarStore } from '@/store/sidebarStore'

/* ── Nav icons ── */
const ICONS = {
	portfolio: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.6'
		>
			<rect x='3' y='3' width='7' height='7' rx='1.5' />
			<rect x='14' y='3' width='7' height='7' rx='1.5' />
			<rect x='3' y='14' width='7' height='7' rx='1.5' />
			<rect x='14' y='14' width='7' height='7' rx='1.5' />
		</svg>
	),
	positions: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.6'
		>
			<path d='M3 9h18M3 15h18M9 3v18M15 3v18' strokeLinecap='round' />
		</svg>
	),
	analytics: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.6'
		>
			<path d='M3 20h18M5 20V14m4 6V10m4 10V6m4 14v-8' strokeLinecap='round' />
		</svg>
	),
	ai: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.6'
		>
			<circle cx='12' cy='12' r='10' />
			<path d='M12 8v4l3 3' strokeLinecap='round' />
		</svg>
	),
}

function RailItems({ onClose }: { onClose?: () => void }) {
	const pathname = usePathname()
	const { t } = useTranslation()

	const items = [
		{
			href: '/portfolio',
			label: t.nav.portfolio,
			icon: ICONS.portfolio,
			badge: null,
		},
		{
			href: '/positions',
			label: t.nav.positions,
			icon: ICONS.positions,
			badge: null,
		},
		{
			href: '/analytics',
			label: t.nav.analytics,
			icon: ICONS.analytics,
			badge: null,
		},
		{
			href: '/ai-insights',
			label: t.nav.aiInsights,
			icon: ICONS.ai,
			badge: '3',
		},
	]

	return (
		<nav style={{ flex: 1, padding: '8px' }}>
			<p
				style={{
					fontSize: 9,
					color: 'var(--text-tertiary)',
					fontWeight: 700,
					textTransform: 'uppercase',
					letterSpacing: '0.18em',
					padding: '0 10px',
					marginBottom: 8,
				}}
			>
				Navigate
			</p>
			{items.map(item => {
				const isActive = pathname === item.href
				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={onClose}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 9,
							padding: '9px 10px',
							borderRadius: 10,
							fontSize: 12,
							fontWeight: isActive ? 600 : 400,
							color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
							background: isActive ? 'rgba(0,229,255,0.07)' : 'transparent',
							border: `1px solid ${isActive ? 'rgba(0,229,255,0.14)' : 'transparent'}`,
							transition: 'all 0.15s',
							textDecoration: 'none',
							marginBottom: 2,
							position: 'relative',
						}}
						onMouseEnter={e => {
							if (!isActive) {
								e.currentTarget.style.color = 'var(--text-primary)'
								e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
							}
						}}
						onMouseLeave={e => {
							if (!isActive) {
								e.currentTarget.style.color = 'var(--text-secondary)'
								e.currentTarget.style.background = 'transparent'
							}
						}}
					>
						<span style={{ opacity: isActive ? 1 : 0.45, flexShrink: 0 }}>
							{item.icon}
						</span>
						{item.label}
						{item.badge && (
							<span
								style={{
									marginLeft: 'auto',
									fontSize: 9,
									fontWeight: 800,
									padding: '1px 5px',
									borderRadius: 6,
									background: 'rgba(0,229,255,0.12)',
									color: 'var(--accent-blue)',
								}}
							>
								{item.badge}
							</span>
						)}
					</Link>
				)
			})}
		</nav>
	)
}

/* ── Desktop sidebar ── */
export function Sidebar() {
	return (
		<aside
			className='sidebar'
			style={{
				width: 'var(--sidebar-width)',
				minHeight: '100vh',
				background: 'var(--sidebar-bg)',
				borderRight: '1px solid var(--border-primary)',
				flexDirection: 'column',
				flexShrink: 0,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{/* Ambient glow */}
			<div
				style={{
					position: 'absolute',
					top: -40,
					left: -40,
					width: 160,
					height: 160,
					borderRadius: '50%',
					background:
						'radial-gradient(circle,rgba(123,97,255,0.07) 0%,transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Ring logo */}
			<div
				style={{
					padding: '20px 16px 14px',
					borderBottom: '1px solid var(--border-primary)',
				}}
			>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: '50%',
						border: '1.5px solid rgba(0,229,255,0.5)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 8,
						boxShadow: '0 0 12px rgba(0,229,255,0.2)',
					}}
				>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: 'var(--accent-blue)',
							boxShadow: '0 0 8px var(--accent-blue)',
						}}
					/>
				</div>
				<p
					style={{
						fontSize: 13,
						fontWeight: 900,
						letterSpacing: '0.05em',
						color: 'var(--text-primary)',
					}}
				>
					NEXORA
				</p>
				<p
					style={{
						fontSize: 9,
						color: 'var(--text-tertiary)',
						letterSpacing: '0.14em',
						marginTop: 1,
					}}
				>
					LIQUIDITY GALAXY
				</p>
			</div>

			<RailItems />

			{/* PRO upgrade */}
			<div
				style={{
					margin: '8px',
					background: 'var(--gradient-pro)',
					border: '1px solid rgba(123,97,255,0.2)',
					borderRadius: 12,
					padding: 12,
				}}
			>
				<p
					style={{
						fontSize: 10,
						fontWeight: 900,
						color: 'var(--accent-purple)',
						letterSpacing: '0.1em',
						marginBottom: 4,
						display: 'flex',
						alignItems: 'center',
						gap: 4,
					}}
				>
					✦ NEXORA PRO
				</p>
				<p
					style={{
						fontSize: 10,
						color: 'var(--text-tertiary)',
						lineHeight: 1.4,
						marginBottom: 8,
					}}
				>
					Strategy builder & auto-compounding.
				</p>
				<button
					style={{
						width: '100%',
						padding: '7px',
						borderRadius: 8,
						fontSize: 11,
						fontWeight: 800,
						background: 'var(--gradient-purple)',
						color: '#fff',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Upgrade Now
				</button>
			</div>

			{/* XP bar */}
			<div
				style={{
					padding: '10px 12px 16px',
					borderTop: '1px solid var(--border-primary)',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontSize: 9,
						color: 'var(--text-tertiary)',
						letterSpacing: '0.1em',
						marginBottom: 5,
					}}
				>
					<span>XP LEVEL 42</span>
					<span style={{ color: 'var(--accent-purple)' }}>65%</span>
				</div>
				<div
					style={{
						height: 3,
						background: 'rgba(255,255,255,0.06)',
						borderRadius: 2,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: '65%',
							background:
								'linear-gradient(90deg,var(--accent-purple),var(--accent-blue))',
							borderRadius: 2,
							animation: 'xpFill 1s ease-out',
						}}
					/>
				</div>
				<p
					style={{
						fontSize: 9,
						color: 'var(--text-tertiary)',
						textAlign: 'center',
						marginTop: 4,
					}}
				>
					3,240 / 5,000 XP
				</p>
			</div>
		</aside>
	)
}

/* ── Mobile drawer ── */
export function MobileDrawer() {
	const { isOpen, close } = useSidebarStore()
	if (!isOpen) return null

	return (
		<>
			<div
				className='sidebar-overlay'
				style={{ display: 'block' }}
				onClick={close}
			/>
			<div className='sidebar-drawer'>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '16px 18px',
						borderBottom: '1px solid var(--border-primary)',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div
							style={{
								width: 26,
								height: 26,
								borderRadius: '50%',
								border: '1.5px solid rgba(0,229,255,0.5)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 0 10px rgba(0,229,255,0.2)',
							}}
						>
							<div
								style={{
									width: 7,
									height: 7,
									borderRadius: '50%',
									background: 'var(--accent-blue)',
									boxShadow: '0 0 6px var(--accent-blue)',
								}}
							/>
						</div>
						<div>
							<p
								style={{
									fontSize: 13,
									fontWeight: 900,
									letterSpacing: '0.05em',
								}}
							>
								NEXORA
							</p>
							<p
								style={{
									fontSize: 9,
									color: 'var(--text-tertiary)',
									letterSpacing: '0.12em',
								}}
							>
								LIQUIDITY GALAXY
							</p>
						</div>
					</div>
					<button
						onClick={close}
						style={{
							background: 'transparent',
							border: 'none',
							color: 'var(--text-tertiary)',
							cursor: 'pointer',
							fontSize: 18,
							lineHeight: 1,
						}}
					>
						✕
					</button>
				</div>
				<RailItems onClose={close} />
				<div
					style={{
						padding: '10px 12px 20px',
						borderTop: '1px solid var(--border-primary)',
					}}
				>
					<p
						style={{
							fontSize: 11,
							color: 'var(--text-tertiary)',
							textAlign: 'center',
						}}
					>
						v0.1.0 · Mainnet
					</p>
				</div>
			</div>
		</>
	)
}
