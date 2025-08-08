"use client"
import React from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'
import { FaGoogle } from '@react-icons/all-files/fa/FaGoogle'

function LoginButton() {
  return (
  <Button onClick={() => signIn('google', { callbackUrl: '/' }) } className='flex gap-2'><FaGoogle /><span>SignIn to Continue</span></Button>
  )
}

export default LoginButton