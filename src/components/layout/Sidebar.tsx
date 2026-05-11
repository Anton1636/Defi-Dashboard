'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
	{ href: '/portfolio', label: 'Portfolio', icon: '◈' },
	{ href: '/positions', label: 'Positions', icon: '⬡' },
	{ href: '/analytics', label: 'Analytics', icon: '◎' },
	{ href: '/ai-insights', label: 'AI Insights', icon: '◇' },
]

export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside className='w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col'>
			{/* Logo */}
			<div className='p-6 border-b border-gray-100'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
						<span className='text-white text-sm font-bold'>D</span>
					</div>
					<span className='font-semibold text-gray-900'>DeFi Dashboard</span>
				</div>
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-4'>
				<ul className='space-y-1'>
					{NAV_ITEMS.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
										isActive
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<span className='text-lg'>{item.icon}</span>
									{item.label}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* Bottom */}
			<div className='p-4 border-t border-gray-100'>
				<p className='text-xs text-gray-400 text-center'>DeFi Dashboard v0.1</p>
			</div>
		</aside>
	)
}
