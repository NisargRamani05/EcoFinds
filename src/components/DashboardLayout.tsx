'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, List, ShoppingBag } from 'lucide-react';
import Navbar from './Navbar';

const navItems = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'My Listings', href: '/dashboard/listings', icon: List },
  { name: 'My Purchases', href: '/dashboard/purchases', icon: ShoppingBag },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 p-4 bg-white rounded-lg shadow-sm">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-grow bg-white p-8 rounded-lg shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}