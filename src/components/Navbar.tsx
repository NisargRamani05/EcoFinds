'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './ui/Button'; // We will use a modified Button

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              EcoFinds
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'loading' && <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse" />}
            
            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                  Log In
                </Link>
                <Link href="/signup">
                  <Button className="!w-auto !px-4 !py-2 !h-auto">Sign Up</Button>
                </Link>
              </>
            )}

            {status === 'authenticated' && session?.user && (
              <>
                <span className="text-sm text-gray-700 hidden sm:block">
                  Hi, {session.user.fullName}
                </span>
                <Link href="/products/new">
                   <Button className="!w-auto !px-4 !py-2 !h-auto !bg-gray-800">Create Listing</Button>
                </Link>
                <Button 
                  onClick={() => signOut()} 
                  className="!w-auto !px-4 !py-2 !h-auto !bg-red-600 hover:!bg-red-700"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}