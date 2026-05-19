'use client'

import { useEffect } from 'react'
import { useModeStore, initMode } from '@/store/modeStore'

export function useMode() {
	const { mode, toggle, setMode } = useModeStore()

	useEffect(() => {
		initMode()
	}, [])

	return {
		mode,
		toggle,
		setMode,
		isSimple: mode === 'simple',
		isPro: mode === 'pro',
	}
}
