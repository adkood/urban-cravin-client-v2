"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import AccountSidebar from "@/components/account-sidebar"
import AccountAddresses from "@/components/account-addresses"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import AccountOrders from "@/components/account-orders"
import UserDetails from "@/components/account-user"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("addresses")

  return (
    <main className="min-h-screen bg-background">
        <Header/>
      <div className="container mx-auto px-4 py-8 min-h-[85svh]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="md:col-span-3">
            {activeTab === "addresses" && <AccountAddresses />}
            {activeTab === "orders" && <AccountOrders/>}
            {activeTab === "profile" && <UserDetails/>}
          </div>
        </div>
      </div>
     <Footer/>
    </main>
  )
}
