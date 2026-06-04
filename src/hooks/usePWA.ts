'use client'

import { useState, useEffect } from 'react'

export interface PWAState {
	isInstalled: boolean
	isOnline: boolean
	canInstall: boolean
	notificationPermission: NotificationPermission | 'unsupported'
}

export function usePWA() {
	const [state, setState] = useState<PWAState>({
		isInstalled: false,
		isOnline: true,
		canInstall: false,
		notificationPermission: 'default',
	})

	useEffect(() => {
		const isInstalled = window.matchMedia('(display-mode: standalone)').matches
		const isOnline = navigator.onLine
		const notifPerm =
			'Notification' in window
				? Notification.permission
				: ('unsupported' as const)

		setState(s => ({
			...s,
			isInstalled,
			isOnline,
			notificationPermission: notifPerm,
		}))

		const onOnline = () => setState(s => ({ ...s, isOnline: true }))
		const onOffline = () => setState(s => ({ ...s, isOnline: false }))
		window.addEventListener('online', onOnline)
		window.addEventListener('offline', onOffline)
		return () => {
			window.removeEventListener('online', onOnline)
			window.removeEventListener('offline', onOffline)
		}
	}, [])

	const requestNotifications = async () => {
		if (!('Notification' in window)) return 'unsupported' as const
		const result = await Notification.requestPermission()
		setState(s => ({ ...s, notificationPermission: result }))
		return result
	}

	return { ...state, requestNotifications }
}
