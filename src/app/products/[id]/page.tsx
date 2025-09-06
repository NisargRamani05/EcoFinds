'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { ShoppingCart, Edit } from 'lucide-react'; // Import the Edit icon
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link'; // Import Link for the edit button

// The Product interface remains the same
interface Product {
  _id: string; title: string; description: string; price: number; category: string; images: string[];
  seller: { _id: string; username: string; fullName: string; };
}

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => { if (!res.ok) notFound(); return res.json() })
        .then(data => { if (data.data) setProduct(data.data); })
        .catch(() => notFound());
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (status !== 'authenticated') {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      });
      if (response.ok) {
        toast.success('Item added to cart!');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add item.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product || status === 'loading') {
    return ( <> <Navbar /> <div className="text-center py-20">Loading product...</div> </> );
  }

  // --- THIS IS THE NEW LOGIC ---
  // Check if the currently logged-in user is the seller of this product.
  const isOwner = session?.user?.id === product.seller._id;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
             <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-500 uppercase">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.title}</h1>
            <p className="text-3xl font-bold text-black mt-4">${product.price.toFixed(2)}</p>
            <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                <p className="text-gray-600 mt-2 text-base leading-relaxed">{product.description}</p>
            </div>
            <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">Sold by: <span className="font-semibold text-gray-700">{product.seller.fullName} (@{product.seller.username})</span></p>
            </div>

            {/* --- CONDITIONAL BUTTON RENDERING --- */}
            <div className="mt-8">
              {isOwner ? (
                // If the user is the owner, show a link to the edit page
                <Link href={`/dashboard/listings/edit/${product._id}`}>
                  <Button className="w-full flex items-center justify-center gap-2 !bg-gray-600 hover:!bg-gray-700">
                    <Edit size={20} />
                    Edit Your Listing
                  </Button>
                </Link>
              ) : (
                // Otherwise, show the "Add to Cart" button
                <Button onClick={handleAddToCart} isLoading={isAddingToCart} className="w-full flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}