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

	autoStreamingText: string
	isAutoAnalyzing: boolean
	latestInsight: string | null
	insightDismissed: boolean

	startStreaming: () => void
	appendStreamChunk: (chunk: string) => void
	finishStreaming: () => void
	setHistory: (history: AIAnalysis[]) => void
	setLoadingHistory: (loading: boolean) => void
	clearStreaming: () => void
	setError: (error: string | null) => void

	startAutoAnalyzing: () => void
	appendAutoChunk: (chunk: string) => void
	finishAutoAnalyzing: () => void
	setLatestInsight: (insight: string) => void
	dismissInsight: () => void
	resetInsight: () => void
}

export const useAIStore = create<AIState>(set => ({
	streamingText: '',
	isStreaming: false,
	history: [],
	isLoadingHistory: false,
	error: null,

	autoStreamingText: '',
	isAutoAnalyzing: false,
	latestInsight: null,
	insightDismissed: false,

	startStreaming: () =>
		set({ streamingText: '', isStreaming: true, error: null }),
	appendStreamChunk: chunk =>
		set(state => ({ streamingText: state.streamingText + chunk })),
	finishStreaming: () => set({ isStreaming: false }),
	setHistory: history => set({ history, isLoadingHistory: false }),
	setLoadingHistory: loading => set({ isLoadingHistory: loading }),
	clearStreaming: () => set({ streamingText: '', isStreaming: false }),
	setError: error => set({ error, isStreaming: false }),

	startAutoAnalyzing: () =>
		set({
			autoStreamingText: '',
			isAutoAnalyzing: true,
			insightDismissed: false,
		}),
	appendAutoChunk: chunk =>
		set(state => ({
			autoStreamingText: state.autoStreamingText + chunk,
		})),
	finishAutoAnalyzing: () =>
		set(state => ({
			isAutoAnalyzing: false,
			latestInsight: state.autoStreamingText || null,
		})),
	setLatestInsight: insight =>
		set({ latestInsight: insight, isAutoAnalyzing: false }),
	dismissInsight: () => set({ insightDismissed: true }),
	resetInsight: () =>
		set({
			autoStreamingText: '',
			latestInsight: null,
			insightDismissed: false,
		}),
}))
