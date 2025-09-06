import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';

// Define the full product type, including the seller object
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  seller: {
    _id: string;
    username: string;
    fullName: string;
  };
}

// Data fetching function for the Server Component
async function getProductDetails(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, {
      cache: 'no-store', // Fetch fresh data every time
    });

    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return null;
  }
}

// The page component itself
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  // If product is not found, show a 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
             <Image
                src={product.images[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}
                alt={product.title}
                fill
                className="object-cover"
             />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-500 uppercase">{product.category}</span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{product.title}</h1>
            <p className="text-3xl font-bold text-black mt-4">${product.price.toFixed(2)}</p>
            
            <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800">Description</h2>
                <p className="text-gray-600 mt-2 text-base leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">
                    Sold by: <span className="font-semibold text-gray-700">{product.seller.fullName} (@{product.seller.username})</span>
                </p>
            </div>
            
            <div className="mt-8">
                 <Button className="w-full flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Add to Cart
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}