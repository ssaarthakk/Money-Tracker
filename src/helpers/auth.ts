"use server";
import { signIn, signOut } from "@/auth"
import { revalidatePath } from "next/cache"

export const signin = async ( provider: string ) => {
    await signIn(provider, { callbackUrl: '/' })
    revalidatePath('/')
}

export const signout = async () => {
    await signOut({ redirectTo: '/' })
    revalidatePath('/')
}