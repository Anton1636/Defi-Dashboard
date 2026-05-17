import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import { LandingClient } from './landing'

export default async function RootPage({
	searchParams,
}: {
	searchParams: Promise<{ modal?: string }>
}) {
	const session = await auth()
	if (session) redirect('/portfolio')

	const params = await searchParams
	const autoOpen = params.modal === 'signin'

	return <LandingClient autoOpen={autoOpen} />
}
