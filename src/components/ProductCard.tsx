import Image from 'next/image';

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
    <div className="border group rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative w-full h-56 bg-gray-200">
        <Image
          src={product.images[0] || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-500">{product.category}</p>
        <h3 className="font-semibold text-lg truncate mt-1">{product.title}</h3>
        <p className="text-xl font-bold mt-2">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}