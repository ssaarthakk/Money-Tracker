"use client"
import React from 'react'
import { Button } from './ui/button'
import { signin } from '@/helpers/auth'
import { FaGoogle } from '@react-icons/all-files/fa/FaGoogle'

function LoginButton() {
  return (
    <Button onClick={() => signin("google") } className='flex gap-2'><FaGoogle /><span>SignIn to Continue</span></Button>
  )
}

export default LoginButton