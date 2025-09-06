'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './ui/Button';
import { ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCartCount(data.data?.length || 0));
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCartCount();
      window.addEventListener('cartUpdated', fetchCartCount);
      return () => {
        window.removeEventListener('cartUpdated', fetchCartCount);
      };
    } else {
        setCartCount(0);
    }
  }, [status]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">EcoFinds</Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'loading' && <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse" />}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">Log In</Link>
                <Link href="/signup"><Button className="!w-auto !px-4 !py-2 !h-auto">Sign Up</Button></Link>
              </>
            )}
            {status === 'authenticated' && session?.user && (
              <>
                <span className="text-sm text-gray-700 hidden sm:block">Hi, {session.user.fullName}</span>
                
                <Link href="/cart" className="relative text-gray-600 hover:text-black p-2">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                <Link href="/products/new">
                   <Button className="!w-auto !px-4 !py-2 !h-auto !bg-gray-800">Create Listing</Button>
                </Link>

                <Link href="/dashboard/profile" className="p-2 text-gray-600 hover:text-black">
                    <User size={24} />
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