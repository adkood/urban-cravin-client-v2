"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MoreVertical, Search, Lock } from "lucide-react"
import Link from "next/link"
import { checkoutCOD, CheckoutDataOnline, checkoutOnline } from "@/data/checkout"
import { handleRazorpay } from "@/lib/razorpay"

declare global {
  interface Window {
    Razorpay: new (options: unknown) => {
      open: () => void;
      on: (event: string, callback: (response: { error : {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
          order_id: string;
          payment_id: string;
        };
      } }) => void) => void;
    };
  }
}


const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "PIN code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required").regex(/^\d+$/, "Phone must be numeric"),
  billingAddress: z.enum(["same", "different"]),
  paymentMethod: z.enum(["cod", "razorpay"]),
  newsOptIn: z.boolean(),
  discountCode: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

const orderItems: OrderItem[] = [
  {
    id: "1",
    title: "Urban Legend",
    price: 1250,
    quantity: 1,
    image: "/urban-legend-tshirt.jpg",
  },
]

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
      billingAddress: "same",
      paymentMethod: "cod",
      newsOptIn: false,
      discountCode: "",
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  const onSubmit = async (values: FormValues) => {
    setIsProcessing(true)
    setSubmitError("")

    try {
      let result: { success: boolean; data?: any; error?: string }

      if (values.paymentMethod === "cod") {
        result = await checkoutCOD(values.discountCode ?? "")
      } else {
        result = await checkoutOnline()
      }

      if (result.success) {
        console.log("Checkout successful:", result.data)
        if(values.paymentMethod === "razorpay") {
            const paymentData = result.data as CheckoutDataOnline
            await handleRazorpay({
                amount : paymentData.payment?.amount,
                razorpay_order_id : paymentData.payment.orderId,
                sessionId : "",
                currency: paymentData.payment.currency,
                receipt: "",
                key : paymentData.payment.key,
                costumerDetails : {
                    name : "Ashutosh",
                    email : "kakshit817@gmail.com"
                }
            })
        }
      } else {
        setSubmitError(result.error || "Checkout failed")
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0
  const tax = Math.round(subtotal * 0.15)
  const total = subtotal + shipping + tax

  return (
<div className="min-h-screen bg-white font-['Roboto_Mono']">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Checkout Form */}
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-8">
              <div className="mb-6 flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="text-lg font-medium placeholder-gray-600 focus:outline-none border-0"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <button type="button" className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Delivery</h2>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">Country/Region</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="First name" className="border-gray-300" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Last name" className="border-gray-300" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="Address" className="border-gray-300 pr-10" />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Apartment, suite, etc. (optional)"
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="City" className="border-gray-300" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="PIN code" className="border-gray-300" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Phone"
                          className="border-gray-300 pr-10"
                          type="tel"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newsOptIn"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 font-normal cursor-pointer">
                      Text me with news and offers
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border-t border-b border-gray-200 py-8">
              <h2 className="text-xl font-bold">Shipping method</h2>
              <div className="rounded border border-gray-300 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  Enter your shipping address to view available shipping methods.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Payment</h2>
              <p className="text-sm text-gray-600">All transactions are secure and encrypted.</p>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="cod" id="cod" className="mt-1" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <p className="font-medium text-gray-900">Cash on Delivery</p>
                            <p className="mt-1 text-sm text-gray-600">Pay when your order arrives</p>
                          </Label>
                        </div>

                        <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="razorpay" id="razorpay" className="mt-1" />
                          <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                            <p className="font-medium text-gray-900">
                              Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets)
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-600">UPI</span>
                              <span className="text-xs font-semibold text-blue-600">VISA</span>
                              <span className="h-5 w-8 rounded bg-red-500"></span>
                              <span className="text-xs text-gray-500">+18</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {paymentMethod === "cod" && (
                <div className="rounded-lg bg-blue-50 p-6 text-center border border-blue-200">
                  <p className="text-sm text-blue-900">
                    You&apos;ll pay Rs{(subtotal + tax).toLocaleString()}.00 at the time of delivery.
                  </p>
                </div>
              )}

              {paymentMethod === "razorpay" && (
                <div className="rounded-lg bg-gray-50 p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="h-24 w-32 border-2 border-gray-400 rounded flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    After clicking &quot;Pay now&quot;, you will be redirected to Razorpay to complete your purchase securely.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold">Billing address</h2>

              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-4 cursor-pointer">
                          <RadioGroupItem value="same" id="same" />
                          <Label htmlFor="same" className="cursor-pointer font-medium text-gray-900">
                            Same as shipping address
                          </Label>
                        </div>

                        <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="different" id="different" />
                          <Label htmlFor="different" className="cursor-pointer text-gray-700">
                            Use a different billing address
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Discount Code - MOVED INSIDE FORM */}
            <FormField
              control={form.control}
              name="discountCode"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Discount code or gift card"
                        className="flex-1 border-gray-300 text-sm"
                      />
                      <Button variant="outline" className="rounded px-4 bg-transparent">
                        Apply
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-900">{submitError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black py-4 text-lg font-semibold text-white hover:bg-black/90 rounded"
            >
              {isProcessing ? "Processing..." : "Pay now"}
            </Button>

            <div className="flex justify-center gap-6 border-t border-gray-200 pt-8 text-sm">
              <Link href="#" className="text-gray-700 hover:text-gray-900 underline">
                Refund policy
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 underline">
                Privacy policy
              </Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 underline">
                Terms of service
              </Link>
            </div>
          </form>
        </Form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="h-fit rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 pb-6 border-b border-gray-200">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                  {item.quantity}
                </span>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-lg font-bold text-gray-900">
                  Rs{item.price.toLocaleString()}.00
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">Rs{subtotal.toLocaleString()}.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">Enter shipping address</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-900">Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">INR</span>
                <span className="text-2xl font-bold text-gray-900">
                  Rs{total.toLocaleString()}.00
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Including Rs{tax.toLocaleString()} in taxes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}