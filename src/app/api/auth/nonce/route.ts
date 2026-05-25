import { NextResponse } from 'next/server'
import { createNonce } from '@/lib/nonce'

export async function GET() {
	const nonce = createNonce()
	return NextResponse.json({ nonce })
}
