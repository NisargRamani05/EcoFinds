"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import Button from "@/components/ui/Button";

// Validation schema
const profileSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .refine((val) => !val.includes(" "), {
      message: "Username cannot contain spaces.",
    }),
  email: z.string().email("Invalid email address."),
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

  useEffect(() => {
    if (session?.user) {
      reset({
        fullName: session.user.fullName ?? "",
        username: session.user.username ?? "",
        email: session.user.email ?? "",
      });
    }
  }, [session, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        update({ fullName: data.fullName, username: data.username });
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen bg-[url('/bg-img2.png')] bg-center">
      <div className="bg-white/80 min-h-screen">
        <DashboardLayout>
          <div className="max-w-2xl mx-auto bg-[#F2EDDE] p-8 rounded-lg shadow-md">
            <h2 className="text-3xl text-[#A16E4B]/70 font-bold mb-6">Your Profile</h2>
            <p className="text-[#A16E4B]/60 mb-8">
              Manage your account settings and personal information.
            </p>

            <div className="bg-white/70 p-6 rounded-lg shadow-sm border mb-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md ring-2 ring-[#A16E4B]/30 flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#A16E4B]/80">
                    {session?.user?.fullName}
                  </h3>
                  <p className="text-sm text-[#A16E4B]/60">{session?.user?.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="label-style">Full Name</label>
                <input {...register("fullName")} className="input-style" />
                {errors.fullName && (
                  <p className="error-style">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="label-style">Username</label>
                <input {...register("username")} className="input-style" />
                {errors.username && (
                  <p className="error-style">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label className="label-style">Email</label>
                <input
                  {...register("email")}
                  className="input-style bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="!bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70 mt-4"
              >
                Update Profile
              </Button>
            </form>
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
}
