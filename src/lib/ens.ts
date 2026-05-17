import { getPublicClient } from './viem'

const MAINNET_ID = 1

const nameCache = new Map<string, string | null>()
const avatarCache = new Map<string, string | null>()

export async function resolveENS(address: string): Promise<string | null> {
	const key = address.toLowerCase()

	if (nameCache.has(key)) return nameCache.get(key)!

	try {
		const client = getPublicClient(MAINNET_ID)
		const name = await client.getEnsName({
			address: address as `0x${string}`,
		})
		nameCache.set(key, name ?? null)
		return name ?? null
	} catch (e) {
		console.warn('[ENS] resolveENS failed:', e)
		nameCache.set(key, null)
		return null
	}
}

export async function getENSAvatar(name: string): Promise<string | null> {
	if (avatarCache.has(name)) return avatarCache.get(name)!

	try {
		const client = getPublicClient(MAINNET_ID)
		const avatar = await client.getEnsAvatar({ name })
		avatarCache.set(name, avatar ?? null)
		return avatar ?? null
	} catch (e) {
		console.warn('[ENS] getENSAvatar failed:', e)
		avatarCache.set(name, null)
		return null
	}
}

export function shortAddress(address: string): string {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}
