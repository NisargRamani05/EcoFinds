'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { useUI } from '@/app/context/UIProvider';
import { Mail, Lock, User } from 'lucide-react';

const signUpSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { openLoginModal } = useUI();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
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
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Join EcoFinds today and start your sustainable journey.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
            <label htmlFor="fullName" className="label-style">Full Name</label>
            <div className="input-icon-container mt-1">
                <User className="absolute left-3 h-5 w-5 text-gray-400" />
                <input id="fullName" {...register('fullName')} className="input-style px-3 pl-10" placeholder="John Doe" />
            </div>
            {errors.fullName && <p className="error-style">{errors.fullName.message}</p>}
        </div>
        <div>
            <label htmlFor="username" className="label-style">Username</label>
            <div className="input-icon-container mt-1">
                <User className="absolute left-3 h-5 w-5 text-gray-400" />
                <input id="username" {...register('username')} className="input-style px-3 pl-10" placeholder="johndoe" />
            </div>
            {errors.username && <p className="error-style">{errors.username.message}</p>}
        </div>
        <div>
            <label htmlFor="email" className="label-style">Email</label>
            <div className="input-icon-container mt-1">
                <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                <input id="email" {...register('email')} className="input-style px-3 pl-10" placeholder="you@example.com" />
            </div>
            {errors.email && <p className="error-style">{errors.email.message}</p>}
        </div>
        <div>
            <label htmlFor="password" className="label-style">Password</label>
            <div className="input-icon-container mt-1">
                <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                <input id="password" type="password" {...register('password')} className="input-style px-3 pl-10" placeholder="••••••••" />
            </div>
            {errors.password && <p className="error-style">{errors.password.message}</p>}
        </div>
        <Button type="submit" isLoading={isLoading} className="!bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70">
          Create Account
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={openLoginModal} className="font-medium text-green-600 hover:underline focus:outline-none">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}