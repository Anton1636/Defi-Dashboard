// Rate limiting без Redis — in-memory Map для dev.
// В production замінимо на Upstash Redis (День 13)
// щоб ліміти шерились між всіма інстансами сервера.

interface RateLimitEntry {
	count: number // кількість запитів
	resetTime: number // коли скидається лічильник (Unix ms)
}

// Map: IP адреса → лічильник запитів
// В production це буде Redis замість Map
const store = new Map<string, RateLimitEntry>()

// Очищаємо прострочені записи кожні 5 хвилин
// щоб Map не ріс нескінченно в пам'яті
setInterval(
	() => {
		const now = Date.now()
		for (const [key, entry] of store.entries()) {
			if (entry.resetTime < now) store.delete(key)
		}
	},
	5 * 60 * 1000,
)

interface RateLimitConfig {
	// Максимум запитів за вікно часу
	max: number
	// Вікно часу в мілісекундах (900000 = 15 хвилин)
	windowMs: number
}

interface RateLimitResult {
	success: boolean // true = запит дозволений
	remaining: number // скільки запитів залишилось
	resetTime: number // коли скидається (Unix ms)
}

export function rateLimit(
	identifier: string,
	config: RateLimitConfig = {
		max: parseInt(process.env.RATE_LIMIT_MAX ?? '100'),
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000'),
	},
): RateLimitResult {
	const now = Date.now()
	const entry = store.get(identifier)

	// Якщо запису немає або він прострочений — створюємо новий
	if (!entry || entry.resetTime < now) {
		const newEntry: RateLimitEntry = {
			count: 1,
			resetTime: now + config.windowMs,
		}
		store.set(identifier, newEntry)

		return {
			success: true,
			remaining: config.max - 1,
			resetTime: newEntry.resetTime,
		}
	}

	// Запис існує і ще активний — інкрементуємо лічильник
	entry.count++

	// Перевищено ліміт — блокуємо запит
	if (entry.count > config.max) {
		return {
			success: false,
			remaining: 0,
			resetTime: entry.resetTime,
		}
	}

	return {
		success: true,
		remaining: config.max - entry.count,
		resetTime: entry.resetTime,
	}
}

// Різні ліміти для різних endpoints:
// API endpoints — суворіший ліміт
export function apiRateLimit(ip: string) {
	return rateLimit(`api:${ip}`, { max: 60, windowMs: 60_000 }) // 60 req/хв
}

// Auth endpoints — найсуворіший ліміт (захист від брутфорсу)
export function authRateLimit(ip: string) {
	return rateLimit(`auth:${ip}`, { max: 10, windowMs: 60_000 }) // 10 req/хв
}

// GraphQL endpoint
export function graphqlRateLimit(ip: string) {
	return rateLimit(`graphql:${ip}`, { max: 30, windowMs: 60_000 }) // 30 req/хв
}
