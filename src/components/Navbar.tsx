'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button';

function Navbar() {
    const { data: session, status } = useSession()
    const user: User = session?.user as User

    const isLoading = status === 'loading'

    return (
        <nav className='p-4 md:p-6 shadow-md bg-gray-100'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</Link>
                {!isLoading && (
                    session ? (
                        <>
                            <span className='text-2xl mr-4'>Welcome, {user?.username || user?.email}</span>
                            <Button 
                                onClick={() => signOut()} 
                                className="w-full md:w-auto bg-slate-900 text-white hover:text-white hover:bg-slate-800" 
                                variant='outline'
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button 
                                className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 hover:text-white" 
                                variant={'outline'}
                            >
                                Login
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </nav>
    )
}

export default Navbar