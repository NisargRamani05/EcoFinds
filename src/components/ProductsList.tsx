import ProductCard from './ProductCard';

// Define the type for the API response
interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  images: string[];
}

// This is a Server Component, so we can make it async and fetch data directly.
async function getProducts() {
  try {
    // We use a cache-busting option to ensure we get fresh data on each page load.
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data.data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array on error
  }
}

export default async function ProductsList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">No Products Found</h2>
        <p className="text-gray-500 mt-2">Check back later or be the first to list an item!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}