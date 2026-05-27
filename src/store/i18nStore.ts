import { create } from 'zustand'
import { en } from '@/lib/i18n/en'
import { de } from '@/lib/i18n/de'

export type Locale = 'en' | 'de'

const TRANSLATIONS = { en, de }

interface I18nState {
	locale: Locale
	t: typeof en
	setLocale: (locale: Locale) => void
	toggle: () => void
}

export const useI18nStore = create<I18nState>(set => ({
	locale: 'en',
	t: en,

	setLocale: (locale: Locale) => {
		try {
			localStorage.setItem('defi-locale', locale)
		} catch {}
		set({ locale, t: TRANSLATIONS[locale] })
	},

	toggle: () =>
		set(state => {
			const next: Locale = state.locale === 'en' ? 'de' : 'en'
			try {
				localStorage.setItem('defi-locale', next)
			} catch {}
			return { locale: next, t: TRANSLATIONS[next] }
		}),
}))

export function initLocale() {
	try {
		const stored = localStorage.getItem('defi-locale') as Locale | null
		if (stored === 'en' || stored === 'de') {
			useI18nStore.setState({ locale: stored, t: { en, de }[stored] })
		}
	} catch {}
}
