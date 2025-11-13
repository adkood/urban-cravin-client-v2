"use client";

import { GET_USER_DETAILSURL } from '@/lib/urls';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export type UserDetails = {
  user: {
    username: string;
    email: string;
    role: string;
  };
};

export default function UserAvatar() {
  const { data, error, isLoading } = useSWR<UserDetails>(GET_USER_DETAILSURL, fetcher(), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Link href="/login">
        <User className="w-6 h-6 text-black" />
      </Link>
    );
  }

  const { username } = data.user;
  const initials = username.slice(0, 2).toUpperCase();
  const isAdmin = data.user.role?.toUpperCase().includes("ADMIN");

  return (
    <div className="flex items-center gap-3">
      <Link href="/account" className="relative">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-black bg-[#e5e7eb] font-bold">
          {initials}
        </div>
      </Link>
      {isAdmin && (
        <div className="flex flex-col gap-1 text-xs font-medium text-black">
          <Link
            href="/admin"
            className="hover:underline"
          >
            Admin Orders
          </Link>
          <Link
            href="/admin/products"
            className="hover:underline"
          >
            Admin Products
          </Link>
        </div>
      )}
    </div>
  );
}
