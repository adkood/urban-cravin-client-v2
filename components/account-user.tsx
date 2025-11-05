'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { BASE_URL } from '@/lib/urls';
import { User } from 'lucide-react';

type UserDetailsResponse = {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
  status?: string;
};

export default function UserDetails() {
  const { data, error, isLoading } = useSWR<UserDetailsResponse>(
    `${BASE_URL}/api/users/details`,
    fetcher(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false, // stop retrying on fail
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading user details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        Failed to load user details.
      </div>
    );
  }

  const { username, email } = data.user;

  return (
    <section className="bg-white shadow-md rounded-xl border border-gray-200 p-6 max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-gray-600" />
        User Information
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Username:</span>
          <span className="font-medium text-gray-800">{username}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium text-gray-800">{email}</span>
        </div>
      </div>
    </section>
  );
}
