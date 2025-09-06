'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import SubmitHandler
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['Electronics', 'Furniture', 'Clothing', 'Books', 'Other']),
  price: z.coerce.number().positive('Price must be a positive number'),
  image: z.string().url('Must be a valid URL'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { // Adding default values can help with type inference
      title: '',
      description: '',
      category: 'Electronics',
      price: 0,
      image: '',
    }
  });

  // Use SubmitHandler to correctly type the onSubmit function
  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: [data.image] }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product listed successfully!');
        router.push('/');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to list product.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error('Create product error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null; // Render nothing while redirecting
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Create a New Listing</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="label-style">Product Title</label>
              <input id="title" {...register('title')} className="input-style" />
              {errors.title && <p className="error-style">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="label-style">Description</label>
              <textarea id="description" {...register('description')} rows={5} className="input-style" />
              {errors.description && <p className="error-style">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="label-style">Category</label>
                <select id="category" {...register('category')} className="input-style">
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="error-style">{errors.category.message}</p>}
              </div>
              <div>
                <label htmlFor="price" className="label-style">Price ($)</label>
                <input id="price" type="number" step="0.01" {...register('price')} className="input-style" />
                {errors.price && <p className="error-style">{errors.price.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="image" className="label-style">Image URL</label>
              <input id="image" {...register('image')} className="input-style" placeholder="https://..." />
              {errors.image && <p className="error-style">{errors.image.message}</p>}
            </div>

            <Button type="submit" isLoading={isLoading}>
              List Product
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}