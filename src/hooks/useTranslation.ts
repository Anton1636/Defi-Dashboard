'use client'

import { useEffect } from 'react'
import { useI18nStore, initLocale } from '@/store/i18nStore'

export function useTranslation() {
	const { t, locale, setLocale, toggle } = useI18nStore()

	useEffect(() => {
		initLocale()
	}, [])

	return { t, locale, setLocale, toggle }
}
