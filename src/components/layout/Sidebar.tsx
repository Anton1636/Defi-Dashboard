'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export function Sidebar() {
	const pathname = usePathname()
	const { t } = useTranslation()

	const NAV_ITEMS = [
		{
			href: '/portfolio',
			label: t.nav.portfolio,
			icon: (
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.8'
				>
					<rect x='3' y='3' width='7' height='7' rx='1.5' />
					<rect x='14' y='3' width='7' height='7' rx='1.5' />
					<rect x='3' y='14' width='7' height='7' rx='1.5' />
					<rect x='14' y='14' width='7' height='7' rx='1.5' />
				</svg>
			),
		},
		{
			href: '/positions',
			label: t.nav.positions,
			icon: (
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.8'
				>
					<path d='M3 9h18M3 15h18M9 3v18M15 3v18' strokeLinecap='round' />
				</svg>
			),
		},
		{
			href: '/analytics',
			label: t.nav.analytics,
			icon: (
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.8'
				>
					<path
						d='M3 20h18M5 20V14m4 6V10m4 10V6m4 14v-8'
						strokeLinecap='round'
					/>
				</svg>
			),
		},
		{
			href: '/ai-insights',
			label: t.nav.aiInsights,
			icon: (
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.8'
				>
					<circle cx='12' cy='12' r='10' />
					<path d='M12 8v4l3 3' strokeLinecap='round' />
				</svg>
			),
		},
	]

	return (
		<aside
			className='sidebar'
			style={{
				width: 200,
				minHeight: '100vh',
				background: 'var(--sidebar-bg)',
				borderRight: '1px solid var(--border-primary)',
				flexDirection: 'column',
				flexShrink: 0,
			}}
		>
			{/* Nav */}
			<nav style={{ flex: 1, padding: '16px 10px' }}>
				<p
					style={{
						fontSize: 10,
						color: 'var(--text-tertiary)',
						fontWeight: 700,
						textTransform: 'uppercase',
						letterSpacing: '0.1em',
						padding: '0 10px',
						marginBottom: 8,
					}}
				>
					Menu
				</p>
				<ul
					style={{
						listStyle: 'none',
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
					}}
				>
					{NAV_ITEMS.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 9,
										padding: '9px 10px',
										borderRadius: 8,
										fontSize: 13,
										fontWeight: isActive ? 600 : 400,
										color: isActive
											? 'var(--text-primary)'
											: 'var(--text-secondary)',
										background: isActive ? 'var(--bg-card)' : 'transparent',
										borderLeft: `2px solid ${isActive ? 'var(--accent-blue)' : 'transparent'}`,
										transition: 'all 0.15s',
										textDecoration: 'none',
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
									<span
										style={{
											opacity: isActive ? 1 : 0.5,
											color: isActive ? 'var(--accent-blue)' : 'currentColor',
										}}
									>
										{item.icon}
									</span>
									{item.label}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* Bottom */}
			<div
				style={{
					padding: '12px 16px',
					borderTop: '1px solid var(--border-primary)',
				}}
			>
				<p
					style={{
						fontSize: 10,
						color: 'var(--text-tertiary)',
						textAlign: 'center',
						fontWeight: 500,
					}}
				>
					v0.1.0 · Mainnet
				</p>
			</div>
		</aside>
	)
}
