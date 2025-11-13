"use server"

import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { getUserDetails } from "@/data/user"
import { redirect } from "next/navigation"
import AdminProductsClientPage from "./page-client"

export default async function AdminProductsPage() {
  const res = await getUserDetails()

  if (!res.success || !res.data?.user) {
    redirect("/login")
  }

  const user = res.data.user

  if (user.role !== "ROLE_ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminProductsClientPage />
      <Footer />
    </div>
  )
}

