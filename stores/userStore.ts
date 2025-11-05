import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { GET_USER_DETAILSURL } from "@/lib/urls";

export interface User {
  username: string;
  email: string;
  role: string;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

export interface UserActions {
  fetchUser: () => Promise<User | null>;
  getUser: () => Promise<User | null>;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export type UserStore = UserState & UserActions;

const defaultState: UserState = {
  user: null,
  loading: false,
  error: null,
  fetched: false,
};

export const createUserStore = () => {
  const store = createStore<UserStore>()(
    persist(
      (set, get) => ({
        ...defaultState,

        fetchUser: async () => {
          const state = get();
          if (state.loading) return state.user; 

          set({ loading: true, error: null });
          try {
            const res = await fetch(`${GET_USER_DETAILSURL}/api/users/details`, {
              credentials: "include",
            });
            const data = await res.json();

            if (data.status !== "Success") {
              throw new Error(data.message || "Failed to fetch user");
            }

            const user = data.data.user as User;
            set({ user, loading: false, fetched: true });
            return user;
          } catch (err: any) {
            set({ error: err.message, loading: false, fetched: true });
            return null;
          }
        },

        getUser: async () => {
          const state = get();
          if (state.user && !state.error) {
            return state.user;
          }

          if (state.loading) {
            return new Promise<User | null>((resolve) => {
              const unsub = store.subscribe((s) => {
                if (!s.loading) {
                  unsub();
                  resolve(s.user);
                }
              });
            });
          }

          return get().fetchUser();
        },

        setUser: (user) => set({ user, fetched: true }),
        clearUser: () => set({ user: null, error: null, fetched: false }),
      }),
      {
        name: "user-store",
        partialize: (state) => ({ user: state.user }),
      }
    )
  );

  return store;
};
