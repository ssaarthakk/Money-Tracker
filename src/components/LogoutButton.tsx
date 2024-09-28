"use client";
import { signout } from '@/helpers/auth'
import { Button } from './ui/button'
import { IoIosLogOut } from "@react-icons/all-files/io/IoIosLogOut";

function LogoutButton() {
  return (
    <Button onClick={() => signout() } variant={"outline"} className='flex gap-2'><IoIosLogOut /><span>Sign Out</span></Button>
  )
}

export default LogoutButton