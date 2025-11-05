'use client';

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  useMemo,
} from 'react';
import { shallow } from 'zustand/shallow';
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { createUserStore, type UserStore } from '@/stores/userStore';

// Define the API type
export type UserStoreApi = ReturnType<typeof createUserStore>;

// Create context
const UserStoreContext = createContext<UserStoreApi | null>(null);

interface UserStoreProviderProps {
  children: ReactNode;
  baseUrl?: string;
}

export const UserStoreProvider = ({
  children,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '',
}: UserStoreProviderProps) => {

  const storeRef = useRef<UserStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  // ✅ Memoize context value so React doesn’t re-render unnecessarily
  const contextValue = useMemo(() => storeRef.current!, []);

  return (
    <UserStoreContext.Provider value={contextValue}>
      {children}
    </UserStoreContext.Provider>
  );
};

// Custom hook to access user store
export const useUserStore = <T,>(
  selector: (state: UserStore) => T,
  equalityFn = shallow // ✅ use shallow comparison by default
): T => {
  const ctx = useContext(UserStoreContext);
  if (!ctx) {
    throw new Error('useUserStore must be used within a UserStoreProvider');
  }

  // ✅ Prevents infinite loop & excessive renders
  return useStoreWithEqualityFn(ctx, selector, equalityFn);
};

