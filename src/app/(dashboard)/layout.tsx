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
		<div className='flex min-h-screen bg-gray-50'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<TopBar />
				<main className='flex-1 p-6'>{children}</main>
			</div>
		</div>
	)
}
