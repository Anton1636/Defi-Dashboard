import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { MobileDrawer } from '@/components/layout/Sidebar'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	if (!session) redirect('/login')

	return (
		<div
			data-dashboard-root
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				minHeight: '100vh',
				background: 'var(--bg-primary)',
			}}
		>
			<Sidebar />
			{/* Mobile drawer */}
			<MobileDrawer />
			{/* Main content */}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minWidth: 0,
					overflow: 'hidden',
				}}
			>
				<TopBar />

				<main
					style={{
						flex: 1,
						minWidth: 0,
						overflowY: 'auto',
					}}
				>
					{children}
				</main>
			</div>
			{/* Mobile bottom nav */}
			<MobileNav />
		</div>
	)
}
