'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
}

const CATEGORIES = ['All', 'Clothing', 'Furniture', 'Electronics', 'Books', 'Other'];

export default function HomePageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => setProducts(data.data || []))
      .catch(err => console.error("Failed to fetch products:", err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery]);

  return (
    <>
      {/* Hero Banner Section */}
      <div className="relative h-80 rounded-lg overflow-hidden mb-12">
        <div 
          className="absolute inset-0 bg-[url('/LOGIN_IMAGE.png')] bg-cover bg-center" 
        >
          <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Give Your Items a Second Life</h1>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl">Join our community to buy and sell pre-loved treasures. Reduce waste, save money, and discover unique finds.</p>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items..."
            className="input-style pl-10"
          />
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                selectedCategory === category
                  ? 'bg-[#A16E4B]/60 text-white border-gray-300'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <ProductsGridSkeleton />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-[#A16E4B]/60">No Products Found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border rounded-lg shadow-sm animate-pulse">
          <div className="w-full h-56 bg-[#F2EDDE]"></div>
          <div className="p-4"><div className="h-4 bg-[#F2EDDE] rounded w-1/4"></div><div className="h-6 bg-[#F2EDDE] rounded w-3/4 mt-2"></div><div className="h-7 bg-[#F2EDDE] rounded w-1/2 mt-3"></div></div>
        </div>
      ))}
    </div>
  );
}