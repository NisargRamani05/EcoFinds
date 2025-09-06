'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Button from '@/components/ui/Button';

// Define the validation schema
const signUpSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please log in.');
        router.push('/login');
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join EcoFinds</h1>
          <p className="text-gray-500">Create an account to start selling and buying</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label-style">Full Name</label>
            <input {...register('fullName')} className="input-style" />
            {errors.fullName && <p className="error-style">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label-style">Username</label>
            <input {...register('username')} className="input-style" />
            {errors.username && <p className="error-style">{errors.username.message}</p>}
          </div>
          <div>
            <label className="label-style">Email</label>
            <input {...register('email')} className="input-style" />
            {errors.email && <p className="error-style">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-style">Password</label>
            <input type="password" {...register('password')} className="input-style" />
            {errors.password && <p className="error-style">{errors.password.message}</p>}
          </div>
          <Button type="submit" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-black hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}