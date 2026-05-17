'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
	{
		href: '/portfolio',
		label: 'Portfolio',
		icon: (
			<svg
				width='20'
				height='20'
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
				width='20'
				height='20'
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
				width='20'
				height='20'
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
		label: 'AI',
		icon: (
			<svg
				width='20'
				height='20'
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

export function MobileNav() {
	const pathname = usePathname()

	return (
		<nav
			className='mobile-nav'
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				height: 64,
				background: 'var(--bg-secondary)',
				borderTop: '1px solid var(--border-primary)',
				alignItems: 'center',
				justifyContent: 'space-around',
				zIndex: 100,
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
			}}
		>
			{NAV_ITEMS.map(item => {
				const isActive = pathname === item.href
				return (
					<Link
						key={item.href}
						href={item.href}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 2,
							padding: '6px 16px',
							borderRadius: 10,
							textDecoration: 'none',
							color: isActive ? 'var(--accent-blue)' : 'var(--text-tertiary)',
							background: isActive ? 'var(--accent-blue-glow)' : 'transparent',
							transition: 'all 0.15s',
							minWidth: 56,
						}}
					>
						<span>{item.icon}</span>
						<span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>
							{item.label}
						</span>
					</Link>
				)
			})}
		</nav>
	)
}
