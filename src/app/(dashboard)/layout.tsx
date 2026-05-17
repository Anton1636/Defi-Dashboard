import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	if (!session) redirect('/login')

	return (
		<div
			style={{
				display: 'flex',
				minHeight: '100vh',
				background: 'var(--bg-primary)',
			}}
		>
			<Sidebar />

			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					minWidth: 0,
				}}
			>
				<TopBar />
				<main className='dashboard-main'>{children}</main>
			</div>

			{/* Bottom nav — visible only on mobile via CSS */}
			<MobileNav />
		</div>
	)
}
