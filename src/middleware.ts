import NextAuth from 'next-auth'
import { authConfig } from '../auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
	apiRateLimit,
	authRateLimit,
	graphqlRateLimit,
} from '../src/lib/security/rate-limit'
import { getCorsHeaders, isPreflightRequest } from '../src/lib/security/cors'

const { auth } = NextAuth(authConfig)

function getClientIp(request: NextRequest): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
		request.headers.get('x-real-ip') ??
		'127.0.0.1'
	)
}

export default auth(async req => {
	const { pathname } = req.nextUrl
	const ip = getClientIp(req)

	// ─── CORS ────────────────────────────────────────────────────────────────────
	const corsHeaders = getCorsHeaders(req)

	// Preflight request - answer with CORS headers and no body
	if (isPreflightRequest(req)) {
		return new NextResponse(null, {
			status: 204, // No Content
			headers: corsHeaders,
		})
	}

	// ─── Rate Limiting ────────────────────────────────────────────────────────────
	let rateLimitResult

	if (pathname.startsWith('/api/auth')) {
		// Auth endpoints — limit by IP to prevent brute-force attacks
		rateLimitResult = authRateLimit(ip)
	} else if (pathname.startsWith('/api/graphql')) {
		// GraphQL — mid limit
		rateLimitResult = graphqlRateLimit(ip)
	} else if (pathname.startsWith('/api')) {
		// Another API endpoints
		rateLimitResult = apiRateLimit(ip)
	}

	// If rate limit exceeded, return 429 Too Many Requests
	if (rateLimitResult && !rateLimitResult.success) {
		return new NextResponse(
			JSON.stringify({
				error: 'Too many requests',
				retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
			}),
			{
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					// Standard headers for rate limiting
					// Client knows when they can retry the request
					'X-RateLimit-Remaining': '0',
					'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
					'Retry-After': Math.ceil(
						(rateLimitResult.resetTime - Date.now()) / 1000,
					).toString(),
					...corsHeaders,
				},
			},
		)
	}

	// ─── Auth check ───────────────────────────────────────────────────────────────
	const isAuthenticated = !!req.auth?.user

	const PROTECTED = ['/portfolio', '/positions', '/analytics', '/ai-insights']
	const AUTH_ONLY = ['/login']

	const isProtected = PROTECTED.some(p => pathname.startsWith(p))
	const isAuthOnly = AUTH_ONLY.some(p => pathname.startsWith(p))

	if (isProtected && !isAuthenticated) {
		const url = new URL('/', req.url)
		url.searchParams.set('modal', 'signin')
		return NextResponse.redirect(url)
	}

	if (isAuthOnly && isAuthenticated) {
		return NextResponse.redirect(new URL('/portfolio', req.url))
	}

	// ───  CORS and security  ──────────────────────────
	const response = NextResponse.next()

	Object.entries(corsHeaders).forEach(([key, value]) => {
		response.headers.set(key, value)
	})

	if (rateLimitResult) {
		response.headers.set(
			'X-RateLimit-Remaining',
			rateLimitResult.remaining.toString(),
		)
		response.headers.set(
			'X-RateLimit-Reset',
			rateLimitResult.resetTime.toString(),
		)
	}

	return response
})

export const config = {
	matcher: [
		'/portfolio/:path*',
		'/positions/:path*',
		'/analytics/:path*',
		'/ai-insights/:path*',
		'/api/:path*',
	],
}
