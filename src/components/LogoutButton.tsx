"use client";
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { IoIosLogOut } from "@react-icons/all-files/io/IoIosLogOut";

function LogoutButton() {
  return (
  <Button onClick={() => signOut({ callbackUrl: '/' }) } variant={"outline"} className='flex gap-2'><IoIosLogOut /><span>Sign Out</span></Button>
  )
}

export default LogoutButton