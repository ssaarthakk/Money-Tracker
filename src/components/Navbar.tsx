import React from 'react'
import Proifle from './Proifle'
import { Separator } from "@/components/ui/separator"


function Navbar() {
    return (
        <>
        <nav className='w-full flex justify-between py-5 px-8'>
            <span className='text-center text-3xl font-bold'>MoneyTracker</span>
            <Proifle />
        </nav>
        <Separator />
        </>
    )
}

export default Navbar