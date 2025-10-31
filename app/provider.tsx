import { CounterStoreProvider } from "@/providers/user-store-provider";

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <CounterStoreProvider>
    {children}
   </CounterStoreProvider>
  );
}
