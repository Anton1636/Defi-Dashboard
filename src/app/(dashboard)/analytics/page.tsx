'use client'

import dynamic from 'next/dynamic'
import { GasWidget } from '@/components/analytics/GasWidget'
import { GasSuggestions } from '@/components/analytics/GasSuggestions'
import { useMode } from '@/hooks/useMode'

const TransactionSimulator = dynamic(
	() =>
		import('@/components/simulator/TransactionSimulator').then(
			m => m.TransactionSimulator,
		),
	{ ssr: false },
)
const ILVisualizer = dynamic(
	() => import('@/components/analytics/ILVisualizer').then(m => m.ILVisualizer),
	{ ssr: false },
)

export default function AnalyticsPage() {
	const { isSimple } = useMode()

	return (
		<div className='fade-in' style={{ maxWidth: 860 }}>
			{/* Header */}
			<div style={{ marginBottom: 24 }}>
				<h1
					style={{
						fontSize: 24,
						fontWeight: 900,
						color: 'var(--text-primary)',
						letterSpacing: '-1px',
						marginBottom: 3,
					}}
				>
					Analytics
				</h1>
				<p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
					{isSimple
						? 'Gas fees, transaction preview and liquidity analysis'
						: 'Gas prices, optimization, transaction simulator and IL calculator'}
				</p>
			</div>

			{/* Gas */}
			<GasWidget />

			{/* Simple explainer */}
			{isSimple && (
				<div
					style={{
						background: 'var(--accent-blue-glow)',
						border: '1px solid var(--border-accent)',
						borderRadius: 12,
						padding: '12px 16px',
						margin: '14px 0',
						fontSize: 13,
						color: 'var(--text-secondary)',
						lineHeight: 1.6,
					}}
				>
					💡{' '}
					<strong style={{ color: 'var(--text-primary)' }}>What is gas?</strong>{' '}
					Every action on Ethereum costs a small fee called gas. Lower gas =
					cheaper to act.
				</div>
			)}

			{/* Suggestions */}
			<div style={{ marginTop: 16 }}>
				<GasSuggestions />
			</div>

			{/* Simulator */}
			<TransactionSimulator />

			{/* IL */}
			<ILVisualizer />
		</div>
	)
}
