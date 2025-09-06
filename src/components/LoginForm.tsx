'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { useUI } from '@/app/context/UIProvider';
import { Lock, User } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { openSignUpModal } = useUI();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Logged in successfully!');
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome Back!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Log in to continue to EcoFinds.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="identifier" className="label-style">Email or Username</label>
          <div className="input-icon-container mt-1">
            <User className="absolute left-3 h-5 w-5 text-gray-400" />
            <input 
              id="identifier"
              {...register('identifier')} 
              className="input-style px-3 pl-10" 
              placeholder="johndoe or john@example.com"
            />
          </div>
          {errors.identifier && <p className="error-style">{errors.identifier.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label-style">Password</label>
          <div className="input-icon-container mt-1">
            <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
            <input 
              id="password"
              type="password" 
              {...register('password')} 
              className="input-style px-3 pl-10"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="error-style">{errors.password.message}</p>}
        </div>
        <Button type="submit" isLoading={isLoading} className="!bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70">
          Log In
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button onClick={openSignUpModal} className="font-medium text-green-600 hover:underline focus:outline-none">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}