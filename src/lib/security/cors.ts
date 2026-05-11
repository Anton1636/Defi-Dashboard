import type { NextRequest } from 'next/server'

const ALLOWED_ORIGINS =
	process.env.NODE_ENV === 'production'
		? [process.env.NEXTAUTH_URL ?? '', 'https://defi-dashboard.vercel.app']
		: ['http://localhost:3000', 'http://127.0.0.1:3000']

// Record<string, string> замість кастомного інтерфейсу —
// HeadersInit приймає саме цей тип
export type CorsHeaders = Record<string, string>

export function getCorsHeaders(request: NextRequest): CorsHeaders {
	const origin = request.headers.get('origin') ?? ''
	const isAllowed = ALLOWED_ORIGINS.includes(origin)

	return {
		'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Max-Age': '3600',
	}
}

export function isPreflightRequest(request: NextRequest): boolean {
	return (
		request.method === 'OPTIONS' &&
		!!request.headers.get('origin') &&
		!!request.headers.get('access-control-request-method')
	)
}
