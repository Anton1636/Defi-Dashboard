'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveENS, getENSAvatar } from '@/lib/ens'

interface ENSData {
	name: string | null
	avatar: string | null
	isLoading: boolean
}

export function useENS(address: string | undefined): ENSData {
	const [data, setData] = useState<Omit<ENSData, 'isLoading'>>({
		name: null,
		avatar: null,
	})
	const [isLoading, setIsLoading] = useState(false)
	const prevAddress = useRef<string | undefined>(undefined)

	useEffect(() => {
		if (!address || address === prevAddress.current) return
		prevAddress.current = address

		if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
			Promise.resolve().then(() => {
				setData({ name: 'demo.eth', avatar: null })
			})
			return
		}

		let cancelled = false

		Promise.resolve()
			.then(() => {
				if (!cancelled) setIsLoading(true)
			})
			.then(() => resolveENS(address))
			.then(async ensName => {
				if (cancelled) return
				let avatarUrl: string | null = null
				if (ensName) {
					avatarUrl = await getENSAvatar(ensName)
				}
				if (!cancelled) {
					setData({ name: ensName, avatar: avatarUrl })
					setIsLoading(false)
				}
			})
			.catch(() => {
				if (!cancelled) setIsLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [address])

	return { ...data, isLoading }
}
