'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
	{
		href: '/portfolio',
		label: 'Portfolio',
		icon: (
			<svg
				width='18'
				height='18'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
			>
				<rect x='3' y='3' width='7' height='7' rx='1' />
				<rect x='14' y='3' width='7' height='7' rx='1' />
				<rect x='3' y='14' width='7' height='7' rx='1' />
				<rect x='14' y='14' width='7' height='7' rx='1' />
			</svg>
		),
	},
	{
		href: '/positions',
		label: 'Positions',
		icon: (
			<svg
				width='18'
				height='18'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
			>
				<path d='M3 9h18M3 15h18M9 3v18M15 3v18' strokeLinecap='round' />
			</svg>
		),
	},
	{
		href: '/analytics',
		label: 'Analytics',
		icon: (
			<svg
				width='18'
				height='18'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
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
		label: 'AI Insights',
		icon: (
			<svg
				width='18'
				height='18'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
			>
				<path d='M12 2a10 10 0 110 20A10 10 0 0112 2z' />
				<path d='M12 8v4l3 3' strokeLinecap='round' />
			</svg>
		),
	},
]

export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside
			className='sidebar'
			style={{
				width: 220,
				minHeight: '100vh',
				background: 'var(--sidebar-bg)',
				borderRight: '1px solid var(--border-primary)',
				flexDirection: 'column',
				flexShrink: 0,
				transition: 'background 0.25s ease',
			}}
		>
			{/* Logo */}
			<div
				style={{
					padding: '24px 20px',
					borderBottom: '1px solid var(--border-primary)',
				}}
			>
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
						<span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
							D
						</span>
					</div>
					<div>
						<p
							style={{
								color: 'var(--text-primary)',
								fontWeight: 600,
								fontSize: 14,
							}}
						>
							DeFi
						</p>
						<p style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
							Dashboard
						</p>
					</div>
				</div>
			</div>

			{/* Nav */}
			<nav style={{ flex: 1, padding: 12 }}>
				<ul
					style={{
						listStyle: 'none',
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
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
										gap: 10,
										padding: '10px 12px',
										borderRadius: 10,
										fontSize: 13,
										fontWeight: isActive ? 500 : 400,
										color: isActive
											? 'var(--text-primary)'
											: 'var(--text-secondary)',
										background: isActive ? 'var(--bg-elevated)' : 'transparent',
										borderLeft: isActive
											? '2px solid var(--accent-blue)'
											: '2px solid transparent',
										transition: 'all 0.15s',
										textDecoration: 'none',
									}}
									onMouseEnter={e => {
										if (!isActive) {
											e.currentTarget.style.background = 'var(--bg-elevated)'
											e.currentTarget.style.color = 'var(--text-primary)'
										}
									}}
									onMouseLeave={e => {
										if (!isActive) {
											e.currentTarget.style.background = 'transparent'
											e.currentTarget.style.color = 'var(--text-secondary)'
										}
									}}
								>
									<span style={{ opacity: isActive ? 1 : 0.6 }}>
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
					padding: 16,
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
		</aside>
	)
}
