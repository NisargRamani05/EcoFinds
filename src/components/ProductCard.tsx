import Image from 'next/image';
import Link from 'next/link'; // 1. Import Link

// Define a type for our product prop for better TypeScript support
interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // 2. Wrap the entire div with the Link component
    <Link href={`/products/${product._id}`} className="block">
      <div className="border border-4 group bg-[#F2EDDE] rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <div className="relative w-full h-56 bg-gray-200">
          <Image
            src={product.images[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 bg-[#A16E4B]/20 group-hover:bg-[#F2EDDE] transition duration-300">
          <p className="text-sm text-gray-800">{product.category}</p>
          <h3 className="text-gray-800 font-semibold text-lg truncate mt-1">{product.title}</h3>
          <p className="text-gray-800 text-xl mt-2">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}