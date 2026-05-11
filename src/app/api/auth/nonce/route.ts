import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'

const nonceStore = new Map<string, number>()

setInterval(
	() => {
		const now = Date.now()
		for (const [nonce, expires] of nonceStore.entries()) {
			if (expires < now) nonceStore.delete(nonce)
		}
	},
	5 * 60 * 1000,
)

export async function GET() {
	const nonce = randomBytes(32).toString('hex')
	const expires = Date.now() + 5 * 60 * 1000
	nonceStore.set(nonce, expires)

	return NextResponse.json({ nonce })
}

export function verifyAndConsumeNonce(nonce: string): boolean {
	const expires = nonceStore.get(nonce)

	if (!expires || expires < Date.now()) return false

	nonceStore.delete(nonce)
	return true
}
