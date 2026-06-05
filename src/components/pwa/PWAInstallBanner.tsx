'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallBanner() {
	const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [show, setShow] = useState(false)
	const [installed, setInstalled] = useState(
		typeof window !== 'undefined'
			? window.matchMedia('(display-mode: standalone)').matches
			: false,
	)

	useEffect(() => {
		if (installed) return

		const handler = (e: Event) => {
			e.preventDefault()
			setPrompt(e as BeforeInstallPromptEvent)
			setTimeout(() => setShow(true), 3000)
		}

		window.addEventListener('beforeinstallprompt', handler)
		return () => window.removeEventListener('beforeinstallprompt', handler)
	}, [installed])

	if (installed || !show || !prompt) return null

	const handleInstall = async () => {
		await prompt.prompt()
		const { outcome } = await prompt.userChoice
		if (outcome === 'accepted') setInstalled(true)
		setShow(false)
	}

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 80,
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 500,
				width: 'calc(100% - 32px)',
				maxWidth: 400,
				background:
					'linear-gradient(135deg,rgba(5,6,10,.98),rgba(13,16,24,.98))',
				border: '1px solid rgba(0,209,255,.2)',
				borderRadius: 'var(--card-radius)',
				padding: '14px 16px',
				boxShadow: '0 8px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(0,209,255,.08)',
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				animation: 'slideIn .3s ease-out',
			}}
		>
			{/* Icon */}
			<div
				style={{
					width: 44,
					height: 44,
					borderRadius: 12,
					background:
						'linear-gradient(135deg,rgba(0,209,255,.15),rgba(123,97,255,.15))',
					border: '1px solid rgba(0,209,255,.2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 22,
					flexShrink: 0,
				}}
			>
				◎
			</div>

			{/* Text */}
			<div style={{ flex: 1, minWidth: 0 }}>
				<p
					style={{
						fontSize: 13,
						fontWeight: 800,
						color: 'var(--text-primary)',
						marginBottom: 2,
					}}
				>
					Install NEXORA
				</p>
				<p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
					Add to home screen for instant access
				</p>
			</div>

			{/* Actions */}
			<div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
				<button
					onClick={() => setShow(false)}
					style={{
						padding: '6px 10px',
						borderRadius: 8,
						fontSize: 11,
						fontWeight: 600,
						background: 'var(--surface-2)',
						border: '1px solid var(--border-1)',
						color: 'var(--text-secondary)',
						cursor: 'pointer',
					}}
				>
					Later
				</button>
				<button
					onClick={handleInstall}
					style={{
						padding: '6px 14px',
						borderRadius: 8,
						fontSize: 11,
						fontWeight: 800,
						background:
							'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',
						border: 'none',
						color: '#fff',
						cursor: 'pointer',
						boxShadow: '0 0 12px rgba(0,209,255,.2)',
					}}
				>
					Install
				</button>
			</div>

			{/* Close */}
			<button
				onClick={() => setShow(false)}
				style={{
					position: 'absolute',
					top: 8,
					right: 10,
					background: 'transparent',
					border: 'none',
					color: 'var(--text-tertiary)',
					cursor: 'pointer',
					fontSize: 14,
					lineHeight: 1,
				}}
			>
				✕
			</button>
		</div>
	)
}
