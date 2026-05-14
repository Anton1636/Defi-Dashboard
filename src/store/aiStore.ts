import { create } from 'zustand'

export interface AIAnalysis {
	id: string
	prompt: string
	response: string
	model: string
	createdAt: string
}

interface AIState {
	streamingText: string
	isStreaming: boolean
	history: AIAnalysis[]
	isLoadingHistory: boolean
	error: string | null

	startStreaming: () => void
	appendStreamChunk: (chunk: string) => void
	finishStreaming: () => void
	setHistory: (history: AIAnalysis[]) => void
	setLoadingHistory: (loading: boolean) => void
	clearStreaming: () => void
	setError: (error: string | null) => void
}

export const useAIStore = create<AIState>(set => ({
	streamingText: '',
	isStreaming: false,
	history: [],
	isLoadingHistory: false,
	error: null,

	startStreaming: () =>
		set({ streamingText: '', isStreaming: true, error: null }),

	appendStreamChunk: chunk =>
		set(state => ({ streamingText: state.streamingText + chunk })),

	finishStreaming: () => set({ isStreaming: false }),

	setHistory: history => set({ history, isLoadingHistory: false }),

	setLoadingHistory: loading => set({ isLoadingHistory: loading }),

	clearStreaming: () => set({ streamingText: '', isStreaming: false }),

	setError: error => set({ error, isStreaming: false }),
}))
