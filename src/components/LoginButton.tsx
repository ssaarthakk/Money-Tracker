"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { signIn } from 'next-auth/react'
import { FaGoogle } from '@react-icons/all-files/fa/FaGoogle'
import { Loader2 } from 'lucide-react'

function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSignIn} 
      disabled={isLoading}
      className='flex gap-2'
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FaGoogle />
      )}
  <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
    </Button>
  )
}export default LoginButton