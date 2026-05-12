import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

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
				}}
			>
				<TopBar />
				<main
					style={{
						flex: 1,
						padding: '24px',
						overflowY: 'auto',
					}}
				>
					{children}
				</main>
			</div>
		</div>
	)
}
