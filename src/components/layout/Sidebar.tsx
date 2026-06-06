'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/store/sidebarStore'
import { AlertBadge } from '@/components/alerts/AlertBadge'
import { useIsClient } from '@/hooks/useIsClient'

const NAV_MAIN = [
	{ href: '/portfolio', label: 'Portfolio', icon: '◈' },
	{ href: '/positions', label: 'Positions', icon: '⬡' },
	{ href: '/analytics', label: 'Analytics', icon: '↗' },
	{ href: '/ai-insights', label: 'AI Insights', icon: '✦', badge: '3' },
]

const NAV_SECONDARY = [
	{ href: '/alerts', label: 'Alerts', icon: '🔔' },
	{ href: '/risk', label: 'Risk Map', icon: '🎯' },
	{ href: '/liquidity', label: 'Heat Map', icon: '🌡' },
	{ href: '/compare', label: 'Compare', icon: '⚖' },
]

function NavLink({
	href,
	label,
	icon,
	badge,
}: {
	href: string
	label: string
	icon: string
	badge?: string
}) {
	const pathname = usePathname()
	const isClient = useIsClient()
	const isActive = isClient && pathname === href
	return (
		<Link
			href={href}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '8px 10px',
				borderRadius: 8,
				fontSize: 12,
				fontWeight: isActive ? 700 : 400,
				color: isActive ? '#fff' : 'rgba(255,255,255,.45)',
				background: isActive ? 'rgba(123,97,255,.15)' : 'transparent',
				borderLeft: `2px solid ${isActive ? 'var(--accent-blue)' : 'transparent'}`,
				transition: 'all .15s',
				textDecoration: 'none',
				marginBottom: 1,
			}}
			onMouseEnter={e => {
				if (!isActive) {
					e.currentTarget.style.background = 'rgba(255,255,255,.04)'
					e.currentTarget.style.color = 'rgba(255,255,255,.7)'
				}
			}}
			onMouseLeave={e => {
				if (!isActive) {
					e.currentTarget.style.background = 'transparent'
					e.currentTarget.style.color = 'rgba(255,255,255,.45)'
				}
			}}
		>
			<span
				style={{ fontSize: 14, flexShrink: 0, opacity: isActive ? 1 : 0.7 }}
			>
				{icon}
			</span>
			<span style={{ flex: 1 }}>{label}</span>
			{badge && (
				<span
					style={{
						fontSize: 9,
						fontWeight: 800,
						padding: '1px 5px',
						borderRadius: 6,
						background: 'rgba(0,229,255,.15)',
						color: 'var(--accent-blue)',
					}}
				>
					{badge}
				</span>
			)}
			{href === '/alerts' && <AlertBadge />}
		</Link>
	)
}

export function Sidebar() {
	return (
		<aside
			className='sidebar'
			style={{
				width: 160,
				minHeight: '100vh',
				flexShrink: 0,
				background: 'rgba(5,6,10,.97)',
				borderRight: '1px solid rgba(255,255,255,.07)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Logo */}
			<div
				style={{
					padding: '18px 14px 14px',
					borderBottom: '1px solid rgba(255,255,255,.07)',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div
						style={{
							width: 26,
							height: 26,
							borderRadius: '50%',
							border: '1.5px solid rgba(0,229,255,.5)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 0 10px rgba(0,229,255,.2)',
							flexShrink: 0,
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
								fontSize: 12,
								fontWeight: 900,
								letterSpacing: '.05em',
								lineHeight: 1,
							}}
						>
							NEXORA
						</p>
						<p
							style={{
								fontSize: 8,
								color: 'rgba(255,255,255,.25)',
								letterSpacing: '.12em',
								marginTop: 2,
							}}
						>
							v2.0.0
						</p>
					</div>
				</div>
			</div>

			{/* Main nav */}
			<nav style={{ padding: '10px 8px' }}>
				{NAV_MAIN.map(i => (
					<NavLink key={i.href} {...i} />
				))}
			</nav>

			<div
				style={{
					height: 1,
					background: 'rgba(255,255,255,.06)',
					margin: '0 12px',
				}}
			/>

			{/* Secondary nav */}
			<nav style={{ padding: '8px 8px', flex: 1 }}>
				{NAV_SECONDARY.map(i => (
					<NavLink key={i.href} {...i} />
				))}
			</nav>

			{/* Pro Mode card */}
			<div
				style={{
					margin: '0 8px 10px',
					background:
						'linear-gradient(135deg,rgba(123,97,255,.15),rgba(0,229,255,.06))',
					border: '1px solid rgba(123,97,255,.25)',
					borderRadius: 10,
					padding: 12,
				}}
			>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: 8,
						background: 'rgba(123,97,255,.2)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 14,
						marginBottom: 7,
					}}
				>
					⚡
				</div>
				<p
					style={{
						fontSize: 11,
						fontWeight: 800,
						color: '#fff',
						marginBottom: 3,
					}}
				>
					Pro Mode
				</p>
				<p
					style={{
						fontSize: 10,
						color: 'rgba(255,255,255,.4)',
						lineHeight: 1.4,
						marginBottom: 8,
					}}
				>
					Unlock advanced analytics, strategy builder and more.
				</p>
				<button
					style={{
						width: '100%',
						padding: '6px',
						borderRadius: 6,
						fontSize: 10,
						fontWeight: 800,
						background: 'linear-gradient(135deg,var(--accent-purple),#5b44d4)',
						color: '#fff',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Upgrade to Pro
				</button>
			</div>

			{/* Footer */}
			<div
				style={{
					padding: '10px 14px 14px',
					borderTop: '1px solid rgba(255,255,255,.07)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 5,
						marginBottom: 8,
					}}
				>
					<div
						style={{
							width: 5,
							height: 5,
							borderRadius: '50%',
							background: '#4ade80',
							boxShadow: '0 0 5px #4ade80',
						}}
					/>
					<span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)' }}>
						All systems operational
					</span>
				</div>
				<div style={{ display: 'flex', gap: 10 }}>
					{['𝕏', '🎮', '⌥', '✕'].map((s, i) => (
						<span
							key={i}
							style={{
								fontSize: 12,
								color: 'rgba(255,255,255,.2)',
								cursor: 'pointer',
								transition: 'color .15s',
							}}
							onMouseEnter={e => {
								e.currentTarget.style.color = 'rgba(255,255,255,.6)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.color = 'rgba(255,255,255,.2)'
							}}
						>
							{s}
						</span>
					))}
				</div>
			</div>
		</aside>
	)
}

export function MobileDrawer() {
	const { isOpen, close } = useSidebarStore()
	if (!isOpen) return null
	return (
		<>
			<div
				style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(0,0,0,.75)',
					zIndex: 200,
				}}
				onClick={close}
			/>
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					bottom: 0,
					width: 220,
					background: 'rgba(5,6,10,.98)',
					borderRight: '1px solid rgba(255,255,255,.07)',
					zIndex: 201,
					display: 'flex',
					flexDirection: 'column',
					overflowY: 'auto',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '16px',
						borderBottom: '1px solid rgba(255,255,255,.07)',
					}}
				>
					<span
						style={{ fontSize: 14, fontWeight: 900, letterSpacing: '.05em' }}
					>
						NEXORA
					</span>
					<button
						onClick={close}
						style={{
							background: 'transparent',
							border: 'none',
							color: 'rgba(255,255,255,.4)',
							cursor: 'pointer',
							fontSize: 18,
						}}
					>
						✕
					</button>
				</div>
				<nav style={{ padding: '8px', flex: 1 }}>
					{[...NAV_MAIN, ...NAV_SECONDARY].map(i => (
						<NavLink key={i.href} {...i} />
					))}
				</nav>
			</div>
		</>
	)
}
