"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {  Plus } from "lucide-react";
import Link from "next/link";

import {
  addUserAddress,
  getUserAddresses,
  type AddressPayload,
  type ApiAddress,
} from "@/data/user";
import { checkoutCOD, checkoutOnline, CheckoutDataOnline } from "@/data/checkout";
import { handleRazorpay } from "@/lib/razorpay";
import { UserDetails } from "@/components/cards/user-profile";
import useSWR from "swr";
import { GET_USER_DETAILSURL } from "@/lib/urls";
import { fetcher } from "@/lib/utils";
import AddressFormDialog from "@/components/address-form-dialog"; 
import { toast } from "sonner";
import { ApiCart, getCart } from "@/data/cart";

const orderItems = [
  {
    id: "1",
    title: "Urban Legend",
    price: 1250,
    quantity: 1,
    image: "/urban-legend-tshirt.jpg",
  },
];

const formSchema = z.object({
  paymentMethod: z.enum(["cod", "razorpay"]),
  discountCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
export default function CheckoutPage() {
  /* ---------------------- STATE ---------------------- */
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [cart,setCart] = useState<ApiCart>();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error : userError, isLoading : userLoading } = useSWR<UserDetails>(GET_USER_DETAILSURL, fetcher(),{
    revalidateOnFocus: false,
    shouldRetryOnError: false, 
  });
  const user = data?.user
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {      
      paymentMethod: "cod",
      discountCode: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  console.log(selectedAddressId);
  console.log(isLoading)
  /* ---------------------- FETCH USER + ADDRESSES ---------------------- */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [addrRes,cartRes] = await Promise.all([getUserAddresses(),getCart()]);

      if (addrRes.success) {
        setAddresses(addrRes.data);
        const defaultAddr = addrRes.data.find((a) => a.defaultAddress);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } else {
        console.warn(addrRes.error);
      }

      if(cartRes.success) {
        setCart(cartRes.data.cart)
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------------- ADDRESS HANDLER ---------------------- */
  const handleAddAddress = async (data: AddressPayload) => {
    const res = await addUserAddress(data);
    if (res.success) {
      setAddresses((prev) => [...prev, res.data!]);
      setSelectedAddressId(res.data!.id);
      setShowAddForm(false);
      toast.success("Your new address has been saved successfully.");
    } else {
      toast("Failed to add address");
    }
  };

  /* ---------------------- DISCOUNT ---------------------- */
  const applyDiscount = () => {
    const code = form.getValues("discountCode")?.trim().toUpperCase();
    if (!code) {
      setDiscount(0);
      return;
    }
    // demo: SAVE10 → 10%
    if (code === "SAVE10") {
      setDiscount(subtotal * 0.1);
      toast.success("Discount applied");
    } else {
      setDiscount(0);
      form.setError("discountCode", { message: "Invalid code" });
      toast.success("Invalid discount code");
    }
  };

  /* ---------------------- TOTALS ---------------------- */
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const [discount, setDiscount] = useState(0);  
  const tax = Math.round(subtotal * 0.15);
  const finalTotal = subtotal + tax - discount;

  /* ---------------------- SUBMIT ---------------------- */
  const onSubmit = async (values: FormValues) => {
    if (!selectedAddressId) {
      toast.error("No address selected");
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId)!;

    const orderPayload = {
      email: user?.email ?? "",
      firstName: user?.username,
      lastName: user?.username,
      address: {
        street: selectedAddr.street,
        city: selectedAddr.city,
        state: selectedAddr.state,
        postalCode: selectedAddr.postalCode,
        country: selectedAddr.country,
      },
      items: orderItems,
      subtotal,
      discount,
      tax,
      total: finalTotal,
      paymentMethod: values.paymentMethod,
      discountCode: values.discountCode ?? "",
    };

    setIsLoading(true);

    try {
      if (values.paymentMethod === "cod") {
        const res = await checkoutCOD(selectedAddr.id,values.discountCode);
        if (res.success) {
          window.location.href = `/checkout/success?orderId=${res.data.order.id}&method=cod`;
        } else {
          toast.error("COD order failed");
        }
      } 
      else {
        const res = await checkoutOnline(selectedAddr.id,values.discountCode);
        if (!res.success || !res.data) {
          toast.error("Failed to create order");
          return;
        }

        const pay = res.data as CheckoutDataOnline;

        await handleRazorpay({
          amount : pay.payment?.amount,
          razorpay_order_id : pay.payment.orderId,
          sessionId : user?.username as string,
          currency: pay.payment.currency,
          receipt: res.data.order.id,
          key : pay.payment.key,
          costumerDetails : {
              name : user?.username as string,
              email : user?.email as string
          }
        });
      } 
    } catch (err) {
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(cart)

  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-white font-['Roboto_Mono']">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ==================== LEFT COLUMN ==================== */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* ---------- EMAIL (read-only) ---------- */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium">{user?.email ?? "Loading…"}</p>
                    </div>
                  </div>
                </div>

                {/* ---------- SAVED ADDRESSES ---------- */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Shipping address</h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} /> Add new
                    </Button>
                  </div>

                  {addresses.length === 0 && !showAddForm && (
                    <p className="text-sm text-gray-500">No saved addresses. Add one to continue.</p>
                  )}

                  {/* ---- LIST ---- */}
                  {addresses.length > 0 && (
                    <RadioGroup
                      value={selectedAddressId ?? undefined}
                      onValueChange={setSelectedAddressId}
                    >
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 mb-3 cursor-pointer hover:bg-gray-50"
                        >
                          <RadioGroupItem value={addr.id} id={addr.id} />
                          <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                            <p className="font-medium">
                              {addr.street}
                              {addr.defaultAddress && (
                                <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} {addr.postalCode}
                              <br />
                              {addr.country}
                            </p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* ---- DIALOG ---- */}
                  <AddressFormDialog
                    isOpen={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddAddress}
                  />
                </div>

                {/* ---------- PAYMENT ---------- */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Payment</h2>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">Pay when you receive</p>
                              </Label>
                            </div>

                            <div className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value="razorpay" id="razorpay" />
                              <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                                <p className="font-medium">
                                  Razorpay (UPI, Cards, Wallets)
                                </p>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === "cod" && (
                    <div className="rounded bg-blue-50 p-4 text-center border border-blue-200">
                      <p className="text-sm text-blue-900">
                        You’ll pay ₹{(finalTotal).toLocaleString()}.00 at delivery.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "razorpay" && (
                    <div className="rounded bg-gray-50 p-4 text-center">
                      <p className="text-sm text-gray-700">
                        You will be redirected to Razorpay to complete the payment securely.
                      </p>
                    </div>
                  )}
                </div>

                {/* ---------- DISCOUNT ---------- */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="discountCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              placeholder="Discount code"
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" onClick={applyDiscount}>
                              Apply
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {discount > 0 && (
                    <p className="text-sm text-green-600">
                      Discount applied: -₹{discount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* ---------- SUBMIT ---------- */}
                <Button
                  type="submit"
                  disabled={isLoading || !selectedAddressId}
                  className="w-full bg-black py-4 text-lg font-semibold text-white hover:bg-black/90 rounded"
                >
                  {isLoading ? "Processing…" : "Pay now"}
                </Button>

                <div className="flex justify-center gap-6 border-t pt-6 text-sm">
                  <Link href="#" className="underline hover:text-gray-900">
                    Refund policy
                  </Link>
                  <Link href="#" className="underline hover:text-gray-900">
                    Privacy policy
                  </Link>
                  <Link href="#" className="underline hover:text-gray-900">
                    Terms of service
                  </Link>
                </div>
              </form>
            </Form>
          </div>

          <div className="h-fit rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              {cart && cart!.items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 mb-4">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-bold">
                      {item.quantity}
                    </span>
                    <img
                      src={item.product.name || "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-lg font-bold">₹{item.product.price.toLocaleString()}.00</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-600">INR</span>
                    <span className="text-2xl font-bold">
                      ₹{finalTotal.toLocaleString()}.00
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Including ₹{tax.toLocaleString()} in taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}