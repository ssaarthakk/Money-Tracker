import React from 'react'
import Proifle from './Proifle'

function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 border-b border-white/10">
            <nav className='mx-auto max-w-6xl flex items-center justify-between py-4 px-6'>
                <span className='text-center text-xl md:text-2xl font-bold tracking-tight'>
                    MoneyTracker
                </span>
                <Proifle />
            </nav>
        </header>
    )
}

export default Navbar