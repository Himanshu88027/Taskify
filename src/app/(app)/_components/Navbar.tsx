"use client";
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const Navbar = () => {
  const { data: session } = useSession();
  const username = session?.user?.username;

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className='fixed top-0 w-full z-50 drop-shadow-xl bg-white/50 backdrop-blur-xl flex flex-col py-6 px-4 sm:px-8 items-center text-white'>
    <nav className='flex w-full justify-between items-center'>
      <Link href='/' >
        <div className='flex items-center gap-2'>
          <div className='relative w-10 h-10'>
            <Image className='object-cover' src='/logo.svg' alt='logo' fill />
          </div>
          <h1 className='font-monkey text-black text-xl font-bold'>Taskify</h1>
        </div>
      </Link>
      {username && (
        <p className='font-monkey hidden sm:block text-xl text-black capitalize'>
          Welcome back,{' '}
          <span className='underline underline-offset-4 decoration-1 tracking-wide'>
            {username}!
          </span>
        </p>
      )}
      <div>
        {session ? (
          <Button onClick={handleLogout} className='bg-white hover:bg-white/80 drop-shadow-md text-black font-monkey transition-all'>
            Log out
          </Button>
        ) : (
          <ul className="flex space-x-4 font-monkey">
            <li><Link href="/sign-in" className={cn("drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-black hover:bg-black",buttonVariants({variant: 'ghost1'}))}>Sign In</Link></li>
            <li><Button className='drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] text-black font-monkey transition-all' asChild><Link className={buttonVariants()} href="/sign-up">Sign Up</Link></Button></li>
          </ul>
        )}
      </div>
    </nav>
      {username && (
        <p className='font-monkey sm:hidden text-xl mt-3 text-black flex justify-center items-center w-full capitalize'>
          Welcome back,{' '}
          <span className='underline underline-offset-4 decoration-1 tracking-wide'>
            {username}!
          </span>
        </p>
      )}
    </header>
  );
};
