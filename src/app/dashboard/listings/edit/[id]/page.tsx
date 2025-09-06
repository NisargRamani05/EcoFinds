'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

// Zod schema for form validation
const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['Electronics', 'Furniture', 'Clothing', 'Books', 'Other']),
  price: z.coerce.number().positive('Price must be a positive number'),
  image: z.string().url('Must be a valid URL'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Get product ID from the URL: /.../edit/[id]
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // From react-hook-form to populate the form with data
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  // Effect to fetch existing product data when the page loads
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            // Use reset() to populate the form fields with the fetched data
            reset({
              title: data.data.title,
              description: data.data.description,
              category: data.data.category,
              price: data.data.price,
              image: data.data.images[0],
            });
          } else {
            toast.error("Could not find product data to edit.");
            router.push('/dashboard/listings');
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, reset, router]);

  // Function to handle form submission
  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: [data.image] }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully!');
        router.push('/dashboard/listings');
        router.refresh(); // Important: Refreshes server data on the target page
      } else {
        toast.error(result.message || 'Failed to update product.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Route protection
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Edit Your Listing</h1>
          {isLoading && !Object.keys(errors).length ? (
             <div className="text-center py-10">Loading product details...</div>
          ) : (
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
                Save Changes
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}