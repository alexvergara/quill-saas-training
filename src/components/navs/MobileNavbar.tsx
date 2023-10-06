'use client';

import React, { useEffect } from 'react'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon, MenuIcon } from 'lucide-react'

const MobileNavbar = ({ isGuest }: {isGuest: boolean}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const toggleIsOpen = () => setIsOpen((isOpen) => !isOpen)
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleIsOpen()
  }, [pathname])
  
  const closeOnCurrent = (path: string) => {
    if (pathname === path) toggleIsOpen()
  }

  return (
    <div className='sm:hidden'>
      <MenuIcon onClick={toggleIsOpen} className='relative z-50 w-5 h-5 text-zinc-500' />

      {isOpen && (
        <div className='fixed animate-in slide-in-top-5 fade-in-20 inset-0 z-0 w-full'>
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8 dark:bg-black dark:border-slate-700">
            {isGuest ? (
              <>
                <li>
                  <Link href='/auth/sign-up' onClick={() => closeOnCurrent('/auth/sign-up')} className='flex items-center w-full font-semibold text-green-600 dark:text-green-500'>
                    Get started <ArrowRightIcon className='w-5 h-5 ml-2' />
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300 dark:bg-slate-600' />
                <li><Link href='/auth/sign-in' onClick={() => closeOnCurrent('/auth/sign-in')} className='flex items-center w-full font-semibold'>Sign in</Link></li>
                <li className='my-3 h-px w-full bg-gray-300 dark:bg-slate-600' />
                <li><Link href='/pricing' onClick={() => closeOnCurrent('/pricing')} className='flex items-center w-full font-semibold'>Pricing</Link></li>
              </>
            ) : (
              <>
                <li><Link href='/dashboard' onClick={() => closeOnCurrent('/dashboard')} className='flex items-center w-full font-semibold'>Dashboard</Link></li>
                <li className='my-3 h-px w-full bg-gray-300 dark:bg-slate-600' />
                <li>
                  <Link href='/auth/sign-out' className='flex items-center w-full font-semibold'>
                    <ArrowLeftIcon className='w-5 h-5 mr-2' /> Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MobileNavbar