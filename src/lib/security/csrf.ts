import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

// CSRF (Cross-Site Request Forgery) захист.
// Навіщо якщо є SameSite=Lax на cookies?
// SameSite=Lax блокує більшість CSRF але не всі випадки —
// наприклад GET запити з інших сайтів проходять.
// Double Submit Cookie pattern додає додатковий рівень захисту
// для мутацій (POST, PUT, DELETE).

const CSRF_SECRET =
	process.env.CSRF_SECRET ?? 'fallback-secret-change-in-production'

// Генеруємо CSRF токен — підписаний HMAC рядок
// Структура: randomBytes.timestamp.HMAC(randomBytes.timestamp, secret)
export function generateCsrfToken(): string {
	const random = randomBytes(16).toString('hex')
	const timestamp = Date.now().toString()
	const payload = `${random}.${timestamp}`
	const signature = createHmac('sha256', CSRF_SECRET)
		.update(payload)
		.digest('hex')

	// Повертаємо base64 щоб легше передавати в заголовку
	return Buffer.from(`${payload}.${signature}`).toString('base64')
}

// Верифікуємо CSRF токен
export function verifyCsrfToken(token: string): boolean {
	try {
		const decoded = Buffer.from(token, 'base64').toString('utf-8')
		const parts = decoded.split('.')

		// Токен має 3 частини: random, timestamp, signature
		if (parts.length !== 3) return false

		const [random, timestamp, signature] = parts
		const payload = `${random}.${timestamp}`

		// Перераховуємо HMAC і порівнюємо з підписом в токені
		const expectedSignature = createHmac('sha256', CSRF_SECRET)
			.update(payload)
			.digest('hex')

		// Токен дійсний 1 годину
		const tokenAge = Date.now() - parseInt(timestamp)
		const isExpired = tokenAge > 60 * 60 * 1000

		// timingSafeEqual — захист від timing attacks
		// (порівнює рядки за постійний час незалежно від довжини)
		const sigBuffer = Buffer.from(signature, 'hex')
		const expectedBuffer = Buffer.from(expectedSignature, 'hex')

		if (sigBuffer.length !== expectedBuffer.length) return false

		const isValid = timingSafeEqual(sigBuffer, expectedBuffer)

		return isValid && !isExpired
	} catch {
		return false
	}
}
