import { create } from 'zustand'

export type DeFiMode = 'pro' | 'simple'

interface ModeState {
	mode: DeFiMode
	setMode: (mode: DeFiMode) => void
	toggle: () => void
}

export const useModeStore = create<ModeState>(set => ({
	mode: 'pro',

	setMode: mode => {
		try {
			localStorage.setItem('defi-mode', mode)
		} catch {}
		set({ mode })
	},

	toggle: () =>
		set(state => {
			const next: DeFiMode = state.mode === 'pro' ? 'simple' : 'pro'
			try {
				localStorage.setItem('defi-mode', next)
			} catch {}
			return { mode: next }
		}),
}))

export function initMode() {
	try {
		const stored = localStorage.getItem('defi-mode') as DeFiMode | null
		if (stored === 'simple' || stored === 'pro') {
			useModeStore.setState({ mode: stored })
		}
	} catch {}
}
