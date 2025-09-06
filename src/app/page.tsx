import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ProductsList from '@/components/ProductsList';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Next Treasure
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Buy and sell pre-owned goods, extend the life of products, and join our sustainable community.
          </p>
        </div>

        {/* Suspense provides a loading fallback while the server fetches products */}
        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsList />
        </Suspense>
      </main>
    </div>
  );
}

// A skeleton component to show while products are loading
function ProductsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border rounded-lg shadow-sm">
                    <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
                        <div className="h-7 bg-gray-200 rounded w-1/2 mt-3 animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}