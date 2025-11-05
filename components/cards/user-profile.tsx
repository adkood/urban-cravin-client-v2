'use server';

import { BASE_URL } from '@/lib/urls';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

type UserDetails = {
  user: {
    username: string;
    email: string;
    role: string;
  };
};

export default function UserAvatar() {
  const { data, error, isLoading } = useSWR<UserDetails>(`${BASE_URL}/api/users/details`, fetcher(),{
      revalidateOnFocus: false,
      shouldRetryOnError: false, 
    });



  if (isLoading || error || !data) {
    return <Link href={"/login"}>
              <User className="w-6 h-6 text-gray-500" />
          </Link>;
  }

  const { username } = data.user;
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Link href="/account" className="relative">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-black bg-[#e5e7eb] font-bold">
          {initials}
        </div>
    </Link>
  );
}