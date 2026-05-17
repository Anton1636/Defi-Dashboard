'use client'

import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
	isOpen: boolean
	onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [onClose])

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				style={{
					position: 'fixed',
					inset: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					backdropFilter: 'blur(8px)',
					WebkitBackdropFilter: 'blur(8px)',
					zIndex: 100,
					animation: 'fadeIn 0.2s ease-out',
				}}
			/>

			{/* Modal */}
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					zIndex: 101,
					width: '100%',
					maxWidth: 420,
					padding: '0 16px',
					animation: 'modalIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
				}}
			>
				<div
					className='card'
					style={{
						padding: 32,
						background: 'var(--bg-card)',
						boxShadow:
							'var(--shadow-card-hover), 0 0 80px rgba(99,102,241,0.12)',
					}}
					onClick={e => e.stopPropagation()}
				>
					{/* Close button */}
					<button
						onClick={onClose}
						style={{
							position: 'absolute',
							top: 16,
							right: 16,
							width: 28,
							height: 28,
							borderRadius: 8,
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							color: 'var(--text-tertiary)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontSize: 16,
							lineHeight: 1,
							transition: 'all 0.15s',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.color = 'var(--text-primary)'
							e.currentTarget.style.borderColor = 'var(--border-secondary)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.color = 'var(--text-tertiary)'
							e.currentTarget.style.borderColor = 'var(--border-primary)'
						}}
					>
						✕
					</button>

					{/* Header */}
					<div style={{ textAlign: 'center', marginBottom: 28 }}>
						<div
							style={{
								width: 44,
								height: 44,
								borderRadius: 12,
								background: 'var(--gradient-blue)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto 14px',
								boxShadow: '0 0 24px var(--accent-blue-glow)',
							}}
						>
							<span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
								D
							</span>
						</div>
						<h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
							Welcome back
						</h2>
						<p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
							Connect your wallet or sign in with Google
						</p>
					</div>

					{/* Wallet connect */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							marginBottom: 16,
						}}
					>
						<ConnectButton
							showBalance={false}
							accountStatus='address'
							chainStatus='icon'
						/>
					</div>

					{/* Divider */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							marginBottom: 16,
						}}
					>
						<div
							style={{
								flex: 1,
								height: 1,
								background: 'var(--border-primary)',
							}}
						/>
						<span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
							or
						</span>
						<div
							style={{
								flex: 1,
								height: 1,
								background: 'var(--border-primary)',
							}}
						/>
					</div>

					{/* Google */}
					<button
						onClick={() => signIn('google', { callbackUrl: '/portfolio' })}
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 10,
							padding: '12px 16px',
							borderRadius: 12,
							background: 'var(--bg-elevated)',
							border: '1px solid var(--border-primary)',
							color: 'var(--text-primary)',
							fontSize: 14,
							fontWeight: 500,
							cursor: 'pointer',
							transition: 'all 0.15s',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.borderColor = 'var(--border-secondary)'
							e.currentTarget.style.background = 'var(--bg-card-hover)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.borderColor = 'var(--border-primary)'
							e.currentTarget.style.background = 'var(--bg-elevated)'
						}}
					>
						<svg width='18' height='18' viewBox='0 0 24 24'>
							<path
								fill='#4285F4'
								d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
							/>
							<path
								fill='#34A853'
								d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
							/>
							<path
								fill='#FBBC05'
								d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
							/>
							<path
								fill='#EA4335'
								d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
							/>
						</svg>
						Continue with Google
					</button>

					<p
						style={{
							textAlign: 'center',
							fontSize: 11,
							color: 'var(--text-tertiary)',
							marginTop: 20,
						}}
					>
						Wallet signature costs no gas fees.
					</p>
				</div>
			</div>
		</>
	)
}
