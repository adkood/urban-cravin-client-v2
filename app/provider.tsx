import { UserStoreProvider } from "@/providers/user-store-provider";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <UserStoreProvider>
    {children}
   </UserStoreProvider>
  );
}
