import { defineConfig } from 'prisma/config'
import * as fs from 'fs'
import * as path from 'path'

function loadEnv() {
	const envPath = path.resolve(process.cwd(), '.env')
	if (!fs.existsSync(envPath)) return

	const content = fs.readFileSync(envPath, 'utf-8')
	for (const line of content.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const [key, ...rest] = trimmed.split('=')
		const value = rest.join('=').replace(/^"|"$/g, '')
		if (key && value) process.env[key] = value
	}
}

loadEnv()

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL!,
	},
})
