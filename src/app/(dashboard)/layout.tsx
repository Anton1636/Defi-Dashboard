import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { Sidebar, MobileDrawer } from '@/components/layout/Sidebar'
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
			{/* Desktop sidebar */}
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
