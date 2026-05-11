import { z } from 'zod'

export const walletAddressSchema = z
	.string()
	.regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
	.transform(addr => addr.toLowerCase())

export const paginationSchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(20),
	offset: z.coerce.number().min(0).default(0),
})

export const siweSchema = z.object({
	message: z.string().min(1).max(5000),
	signature: z
		.string()
		.regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format'),
})

export const createAlertSchema = z.object({
	type: z.enum([
		'PRICE_ABOVE',
		'PRICE_BELOW',
		'HEALTH_FACTOR_LOW',
		'YIELD_THRESHOLD',
	]),
	threshold: z.number().positive().max(1_000_000),
	asset: z.string().max(10).optional(),
	protocol: z.enum(['uniswap', 'aave', 'compound']).optional(),
})

export const graphqlRequestSchema = z.object({
	query: z
		.string()
		.min(1)
		.max(10_000)
		.refine(
			query => {
				if (process.env.NODE_ENV === 'production') {
					return !query.includes('__schema') && !query.includes('__type')
				}
				return true
			},
			{ message: 'Introspection is disabled in production' },
		),
	// z.record потребує два аргументи в новіших версіях Zod:
	// z.record(keySchema, valueSchema)
	variables: z.record(z.string(), z.unknown()).optional(),
	operationName: z.string().max(100).optional(),
})

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data)

	if (!result.success) {
		// ZodError має flatten() метод — зручніший для отримання помилок
		const errors = result.error.flatten()
		const messages = Object.entries(errors.fieldErrors)
			.map(([field, errs]) => {
				if (!Array.isArray(errs)) return `${field}:`
				return `${field}: ${errs.join(', ')}`
			})
			.join('; ')
		throw new Error(`Validation failed: ${messages}`)
	}

	return result.data
}
