"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MapPin, Package, Heart, Truck } from "lucide-react"

const faqs = [
  {
    icon: MapPin,
    question: "Do you offer shipping all over India?",
    answer: "Yes! We ship all over India with reliable delivery partners.",
  },
  {
    icon: Package,
    question: "Can I exchange a product for a different size?",
    answer:
      "Yes! If you need an exchange due to a size issue, email us at support@beige-swallow-873243.hostingersite.com",
  },
  {
    icon: Heart,
    question: "What payment options do you offer?",
    answer:
      "We accept: Credit/Debit Cards, Net Banking, UPI (GPay, BHIM, Paytm, PhonePe, etc.), and Cash on Delivery (COD).",
  },
  {
    icon: Truck,
    question: "How can I track my order?",
    answer:
      "Within 2-3 working days after placing your order, you will receive an email with a tracking link and invoice.",
  },
]

export default function FAQ() {
  return (
    <main className="min-h-[80%] bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">FAQs</h1>
          <p className="mt-3 text-base text-slate-600">
            Find answers to common questions about shipping, payments, and orders.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => {
            const Icon = faq.icon
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-slate-200 px-6 transition-all hover:border-slate-300"
              >
                <AccordionTrigger className="group py-4 hover:no-underline">
                  <div className="flex items-start gap-4 text-left">
                    <Icon
                      className="mt-0.5 h-5 w-5 flex-shrink-0 transition-colors group-hover:text-[#9b1e22]"
                      style={{ color: "#9b1e22" }}
                    />
                    <span className="text-base font-medium text-slate-900">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-9 pt-2 text-slate-700">{faq.answer}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </main>
  )
}
