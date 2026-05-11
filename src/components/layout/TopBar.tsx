'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/hooks/useWallet'
import { signOut } from 'next-auth/react'

export function TopBar() {
	const { address, ethBalance, isLoadingBalance } = useWallet()

	return (
		<header className='h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6'>
			{/* ETH balance - Show if connected */}
			<div className='flex items-center gap-3'>
				{address && (
					<div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5'>
						<div className='w-2 h-2 bg-green-400 rounded-full' />
						<span className='text-sm text-gray-600'>
							{isLoadingBalance ? (
								'Loading...'
							) : (
								<>{ethBalance ?? '0.0000'} ETH</>
							)}
						</span>
					</div>
				)}
			</div>

			{/* RainbowKit ConnectButton + signOut */}
			<div className='flex items-center gap-3'>
				<ConnectButton
					showBalance={false}
					accountStatus='avatar'
					chainStatus='icon'
				/>
				<button
					onClick={() => signOut({ callbackUrl: '/login' })}
					className='text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors'
				>
					Sign out
				</button>
			</div>
		</header>
	)
}
