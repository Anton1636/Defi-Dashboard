import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { PriceProvider } from '@/components/providers/PriceProvider'

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
			<PriceProvider />
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

			<MobileNav />
		</div>
	)
}
