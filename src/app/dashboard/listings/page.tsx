'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component
import { Trash2, Edit } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
}

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/listings')
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setListings(data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Listing deleted successfully!');
        setListings(listings.filter((listing) => listing._id !== productId));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete listing.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the listing.');
    }
  };

  if (isLoading || status === 'loading') {
    return (
        <>
            <Navbar />
            <div className="text-center py-10">Loading your listings...</div>
        </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Listings</h1>
        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((product) => (
              <div key={product._id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="relative w-20 h-20 rounded-md overflow-hidden mr-4">
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h2 className="font-semibold text-lg">{product.title}</h2>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* --- THIS IS THE CORRECTED CODE --- */}
                  {/* The legacyBehavior prop and inner <a> tag have been removed. */}
                  {/* All styles are now directly on the Link component. */}
                  <Link
                    href={`/dashboard/listings/edit/${product._id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    aria-label="Edit listing"
                  >
                    <Edit size={20} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not listed any products yet.</p>
        )}
      </main>
    </div>
  );
}