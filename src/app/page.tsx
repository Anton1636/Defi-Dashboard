import { LandingClient } from './landing'

export default async function RootPage({
	searchParams,
}: {
	searchParams: Promise<{ modal?: string }>
}) {
	const params = await searchParams
	const autoOpen = params.modal === 'signin'

	return <LandingClient autoOpen={autoOpen} />
}
