"use client"

import Link from "next/link"
import { CheckCircle2, HomeIcon } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card/80 p-10 text-center shadow-lg backdrop-blur">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Payment Successful!
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Thank you for your purchase. Your order has been confirmed and we&apos;ve
            sent the details to your email. You can continue shopping anytime.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <HomeIcon className="mr-2 h-5 w-5" />
                Go back home
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground sm:text-sm">
            For cash on delivery orders, please keep the exact amount ready when the delivery partner arrives.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

