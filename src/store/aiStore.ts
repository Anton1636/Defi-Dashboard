import { create } from 'zustand'

interface AIAnalysis {
	id: string
	prompt: string
	response: string
	createdAt: string
}

interface AIState {
	// Поточний стрімінг текст від Gemini
	streamingText: string
	isStreaming: boolean

	// Історія аналізів (з PostgreSQL)
	history: AIAnalysis[]
	isLoadingHistory: boolean

	error: string | null

	// Actions
	startStreaming: () => void
	appendStreamChunk: (chunk: string) => void // додаємо chunk під час стрімінгу
	finishStreaming: (analysis: AIAnalysis) => void
	setHistory: (history: AIAnalysis[]) => void
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

	// Під час стрімінгу додаємо кожен новий chunk до поточного тексту
	appendStreamChunk: chunk =>
		set(state => ({ streamingText: state.streamingText + chunk })),

	// Стрімінг завершився — зберігаємо в history і очищаємо streaming текст
	finishStreaming: analysis =>
		set(state => ({
			isStreaming: false,
			streamingText: '',
			history: [analysis, ...state.history],
		})),

	setHistory: history => set({ history, isLoadingHistory: false }),

	clearStreaming: () => set({ streamingText: '', isStreaming: false }),

	setError: error => set({ error, isStreaming: false }),
}))
