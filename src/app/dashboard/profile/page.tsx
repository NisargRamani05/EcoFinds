'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/ui/Button';

// Validation schema for profile updates, including username
const profileSchema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  username: z.string().min(3, 'Username must be at least 3 characters.')
    .refine(val => !val.includes(' '), {
      message: "Username cannot contain spaces.",
    }),
  email: z.string().email('Invalid email address.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Populate the form with current user data
  useEffect(() => {
    if (session?.user) {
      reset({
        fullName: session.user.fullName ?? '',
        username: session.user.username ?? '',
        email: session.user.email ?? '',
      });
    }
  }, [session, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully!');
        
        // Yeh woh main line hai jo UI ko turant update karti hai
        update({ fullName: data.fullName, username: data.username });
        
      } else {
        toast.error(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
        <p className="text-gray-600 mb-8">Manage your account settings and personal information.</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                </div>
                <div>
                    {/* The full name displayed here will now be updated instantly */}
                    <h3 className="text-xl font-semibold">{session?.user?.fullName}</h3>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <input 
              {...register('email')} 
              className="input-style bg-gray-100 cursor-not-allowed" 
              readOnly 
              disabled 
            />
          </div>
          <Button type="submit" isLoading={isLoading} className="mt-4">
            Update Profile
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}