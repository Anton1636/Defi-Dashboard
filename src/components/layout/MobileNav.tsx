'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNav() {
	const pathname = usePathname()

	const items = [
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
			label: 'AI Lab',
			icon: (
				<svg
					width='20'
					height='20'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
				>
					<circle cx='12' cy='12' r='10' />
					<path d='M12 8v4l3 3' strokeLinecap='round' />
				</svg>
			),
		},
	]

	return (
		<nav
			className='mobile-nav'
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				height: 'var(--mobile-nav-height)',
				background: 'rgba(5,6,10,0.97)',
				borderTop: '1px solid var(--border-primary)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				zIndex: 100,
				display: 'none',
				alignItems: 'center',
			}}
		>
			{/* First 2 items */}
			{items.slice(0, 2).map(item => {
				const isActive = pathname === item.href
				return (
					<Link
						key={item.href}
						href={item.href}
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
							textDecoration: 'none',
							paddingTop: 8,
							color: isActive ? 'var(--accent-blue)' : 'rgba(255,255,255,0.25)',
							fontWeight: 700,
							fontSize: 9,
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						<span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
						<span>{item.label}</span>
						{isActive && (
							<div
								style={{
									width: 16,
									height: 2,
									borderRadius: 1,
									background: 'var(--accent-blue)',
									marginTop: 1,
								}}
							/>
						)}
					</Link>
				)
			})}

			{/* Center + button */}
			<div
				style={{
					flex: 1,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<button
					style={{
						width: 44,
						height: 44,
						borderRadius: '50%',
						background:
							'linear-gradient(135deg,var(--accent-purple),var(--accent-blue))',
						border: 'none',
						cursor: 'pointer',
						fontSize: 22,
						color: '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 0 20px rgba(0,229,255,0.25)',
						transform: 'translateY(-8px)',
					}}
				>
					+
				</button>
			</div>

			{/* Last 2 items */}
			{items.slice(2).map(item => {
				const isActive = pathname === item.href
				return (
					<Link
						key={item.href}
						href={item.href}
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
							textDecoration: 'none',
							paddingTop: 8,
							color: isActive ? 'var(--accent-blue)' : 'rgba(255,255,255,0.25)',
							fontWeight: 700,
							fontSize: 9,
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						<span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
						<span>{item.label}</span>
						{isActive && (
							<div
								style={{
									width: 16,
									height: 2,
									borderRadius: 1,
									background: 'var(--accent-blue)',
									marginTop: 1,
								}}
							/>
						)}
					</Link>
				)
			})}
		</nav>
	)
}
