'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  images: string[];
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => setCartItems(data.data || []))
        .finally(() => setIsLoading(false));
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        toast.success('Item removed from cart');
        setCartItems(prev => prev.filter(item => item._id !== productId));
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error('Failed to remove item.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setCartItems([]);
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/dashboard/purchases');
      } else {
        toast.error(result.message || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during checkout.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems]
  );

  if (isLoading || status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 font-semibold text-[#A16E4B]/70">
          Loading Your Cart...
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
            Your Shopping Cart
          </h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Cart items list */}
              <div className="lg:col-span-2 bg-[#F2EDDE] rounded-lg shadow-md border">
                <ul className="divide-y divide-[#A16E4B]/20">
                  {cartItems.map(item => (
                    <li
                      key={item._id}
                      className="flex items-center p-4 hover:bg-white/70 transition duration-200"
                    >
                      <div className="relative w-24 h-24 rounded-md overflow-hidden mr-6 flex-shrink-0 shadow-md ring-2 ring-[#A16E4B]/20">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link href={`/products/${item._id}`}>
                          <h2 className="font-semibold text-lg text-[#A16E4B]/80 hover:underline">
                            {item.title}
                          </h2>
                        </Link>
                        <p className="text-[#A16E4B]/70 font-bold mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#F2EDDE] p-6 rounded-lg shadow-md border sticky top-24">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-4 text-[#A16E4B]/80">
                    Order Summary
                  </h2>
                  <div className="flex justify-between my-4 text-lg">
                    <span className="font-medium text-[#A16E4B]/70">
                      Subtotal
                    </span>
                    <span className="font-bold text-[#A16E4B]/80">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    isLoading={isCheckingOut}
                    className="w-full mt-4"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-[#F2EDDE] shadow-md">
              <h2 className="text-xl font-semibold text-[#A16E4B]/80">
                Your cart is empty.
              </h2>
              <p className="text-[#A16E4B]/60 mt-2">
                Looks like you haven't added any items yet.
              </p>
              <Link
                href="/"
                className="inline-block mt-6 px-6 py-2 bg-[#A16E4B] text-white rounded-lg shadow hover:bg-[#8a5a3f] transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
