'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

interface Purchase {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  createdAt: string;
}

export default function MyPurchasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/purchases')
        .then(res => res.json())
        .then(data => setPurchases(data.data || []))
        .finally(() => setIsLoading(false));
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (isLoading || status === 'loading') {
    return (
      <>
      <div className="bg-white/80 min-h-screen">
        <Navbar />
        <div className="text-center py-20 font-semibold text-[#A16E4B]/70">
          Loading Purchase History...
        </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen bg-[url('/bg-img2.png')] bg-center">
      <div className="bg-white/80 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-8 text-[#A16E4B]/70">
            My Purchase History
          </h1>

          {purchases.length > 0 ? (
            <div className="bg-[#F2EDDE] rounded-lg shadow-md border">
              <ul className="divide-y divide-[#A16E4B]/20">
                {purchases.map((purchase) => (
                  <li
                    key={purchase._id}
                    className="p-6 hover:bg-white/70 transition duration-200"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 shadow-md ring-2 ring-[#A16E4B]/20">
                        <Image
                          src={purchase.product.images[0]}
                          alt={purchase.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link href={`/products/${purchase.product._id}`}>
                          <h2 className="font-semibold text-lg text-[#A16E4B]/80 hover:underline">
                            {purchase.product.title}
                          </h2>
                        </Link>
                        <p className="text-[#A16E4B]/70 font-bold mt-1">
                          ${purchase.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-[#A16E4B]/50">Purchased on</p>
                        <p className="font-medium text-[#A16E4B]/80">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-[#F2EDDE] shadow-md">
              <h2 className="text-xl font-semibold text-[#A16E4B]/80">
                No purchase history found.
              </h2>
              <p className="text-[#A16E4B]/60 mt-2">
                You haven't purchased any items yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
