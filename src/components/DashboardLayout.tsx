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
    <div className="bg-[url('/bg-img2.png')] min-h-screen">
      <div className="bg-white/80 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#A16E4B] mb-8">My Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 p-4 bg-[#F2EDDE]/80 rounded-lg shadow-md border border-[#A16E4B]/30">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors font-medium ${
                      isActive
                        ? 'bg-[#A16E4B] text-white'
                        : 'text-[#A16E4B] hover:bg-[#F2EDDE] hover:text-[#A16E4B]'
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
          <main className="flex-grow bg-[#F2EDDE]/80 p-8 rounded-lg shadow-md border border-[#A16E4B]/30">
            {children}
          </main>
        </div>
      </div>
      </div>
    </div>
  );
}
