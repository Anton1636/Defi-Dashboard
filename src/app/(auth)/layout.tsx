import { auth } from '../../../auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	if (session) redirect('/portfolio')

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='w-full max-w-md px-4'>{children}</div>
		</div>
	)
}
