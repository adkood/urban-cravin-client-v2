"use client"

import Link from "next/link"
import { AlertOctagon, HomeIcon, RefreshCcwIcon } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { Button } from "@/components/ui/button"

export default function PaymentFailurePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card/80 p-10 text-center shadow-lg backdrop-blur">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertOctagon className="h-12 w-12" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Payment Failed
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            We couldn&apos;t confirm your payment. This can happen due to network issues,
            insufficient funds, or if the payment was cancelled. No money has been
            deducted.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/checkout">
                <RefreshCcwIcon className="mr-2 h-5 w-5" />
                Try again
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/">
                <HomeIcon className="mr-2 h-5 w-5" />
                Go back home
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground sm:text-sm">
            If the issue persists, please contact support. Cash on delivery orders can be placed again at checkout.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

