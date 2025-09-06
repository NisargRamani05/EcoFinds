'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Purchase {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  } | null; // Product could potentially be null if deleted
  createdAt: string;
}

export default function MyPurchases() {
  const { status } = useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if the user is authenticated
    if (status === 'authenticated') {
      setIsLoading(true);
      fetch('/api/users/purchases')
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch data');
          }
          return res.json();
        })
        .then(data => {
          setPurchases(data.data || []);
        })
        .catch(err => {
          console.error("Failed to fetch purchase history:", err);
          setError('Could not load purchase history. Please try again later.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [status]);

  if (isLoading) {
    return <div><h2 className="text-2xl font-semibold mb-4">My Purchases</h2><p>Loading your purchase history...</p></div>;
  }

  if (error) {
    return <div><h2 className="text-2xl font-semibold mb-4">My Purchases</h2><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Purchases</h2>
      {purchases.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <ul className="divide-y divide-gray-200">
            {purchases.map((purchase) => {
              // Gracefully handle cases where a product might have been deleted
              if (!purchase.product) return null;

              return (
                <li key={purchase._id} className="p-4">
                  <div className="flex items-center space-x-6">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={purchase.product.images[0]} alt={purchase.product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <Link href={`/products/${purchase.product._id}`}>
                        <h3 className="font-semibold text-lg text-gray-800 hover:underline">{purchase.product.title}</h3>
                      </Link>
                      <p className="text-gray-600 font-bold mt-1">${purchase.product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">Purchased on</p>
                      <p className="font-medium text-gray-700">{new Date(purchase.createdAt).toLocaleDateDateString()}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700">No purchase history found.</h3>
          <p className="text-gray-500 mt-2">You haven't purchased any items yet.</p>
        </div>
      )}
    </div>
  );
}