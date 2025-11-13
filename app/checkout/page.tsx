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
import {  Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { BASE_URL, GET_USER_DETAILSURL, PAYMENT_FAILURE_PATH, PAYMENT_SUCCESS_PATH } from "@/lib/urls";
import { fetcher } from "@/lib/utils";
import AddressFormDialog from "@/components/address-form-dialog"; 
import { toast } from "sonner";
import { ApiCart, ApiCartItem, getCart } from "@/data/cart";
import { nunitoSans } from "@/lib/fonts";

const formSchema = z.object({
  paymentMethod: z.enum(["cod", "razorpay"]),
  discountCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [cart,setCart] = useState<ApiCart>();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(0);  
  const router = useRouter();
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

  const applyDiscount = () => {
    const code = form.getValues("discountCode")?.trim().toUpperCase();
    if (!code) {
      setDiscount(0);
      return;
    }
    if (code === "SAVE10") {
      toast.success("Discount applied");
    } else {
      setDiscount(0);
      form.setError("discountCode", { message: "Invalid code" });
      toast.success("Invalid discount code");
    }
  };



  const onSubmit = async (values: FormValues) => {
    if (!selectedAddressId) {
      toast.error("No address selected");
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId)!;

    setIsLoading(true);

    try {
      if (values.paymentMethod === "cod") {
        const res = await checkoutCOD(selectedAddr.id,values.discountCode);
        if (res.success && res.data?.order) {
          router.replace(`${PAYMENT_SUCCESS_PATH}?order_id=${res.data.order.id}&paymentMethod=cod`);
        } else {
          const failureMessage =
            (!res.success && "error" in res ? res.error : undefined) ?? "COD order failed";
          toast.error(failureMessage);
          router.replace(`${PAYMENT_FAILURE_PATH}?paymentMethod=cod&reason=cod_checkout_failed`);
        }
      } 
      else {
        const res = await checkoutOnline(selectedAddr.id,values.discountCode);
        if (!res.success || !res.data) {
          toast.error("Failed to create order");
          router.replace(`${PAYMENT_FAILURE_PATH}?paymentMethod=razorpay&reason=order_creation_failed`);
          return;
        }

        const pay = res.data as CheckoutDataOnline;

        await handleRazorpay(
          {
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
        },router);
      } 
    } catch (err) {
      toast.error("Unexpected error");
      router.replace(`${PAYMENT_FAILURE_PATH}?paymentMethod=${values.paymentMethod}&reason=unexpected_error`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-white">
      <CheckOutHeader/>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 lg:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Email Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-900">
                            {user?.email ?? "Loading…"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Shipping address</h2>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddForm(true)}
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          <Plus size={16} /> Add new
                        </Button>
                      </div>

                      {addresses.length === 0 && !showAddForm && (
                        <p className="text-sm text-gray-600">No saved addresses. Add one to continue.</p>
                      )}

                      {addresses.length > 0 && (
                        <RadioGroup
                          value={selectedAddressId ?? undefined}
                          onValueChange={setSelectedAddressId}
                        >
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className="flex items-start gap-3 rounded-lg border border-gray-300 p-4 mb-3 cursor-pointer hover:border-gray-400 transition-colors"
                            >
                              <RadioGroupItem value={addr.id} id={addr.id} />
                              <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                                <p className="font-semibold text-gray-900">
                                  {addr.street}
                                  {addr.defaultAddress && (
                                    <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                      Default
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  {addr.city}, {addr.state} {addr.postalCode}
                                  <br />
                                  {addr.country}
                                </p>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      <AddressFormDialog
                        isOpen={showAddForm}
                        onClose={() => setShowAddForm(false)}
                        onSubmit={handleAddAddress}
                      />
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900">Payment</h2>

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
                                <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
                                  <RadioGroupItem value="cod" id="cod" />
                                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                    <p className="text-sm text-gray-700">Pay when you receive</p>
                                  </Label>
                                </div>

                                <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
                                  <RadioGroupItem value="razorpay" id="razorpay" />
                                  <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                                    <p className="font-semibold text-gray-900">
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
                        <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-100">
                          <p className="text-sm font-medium text-gray-800">
                            You'll pay <span className="font-bold text-gray-900">₹{(cart?.cartTotalPrice! || "").toLocaleString()}.00</span> at delivery.
                          </p>
                        </div>
                      )}

                      {paymentMethod === "razorpay" && (
                        <div className="rounded-lg bg-gray-50 p-4 text-center border border-gray-200">
                          <p className="text-sm font-medium text-gray-800">
                            You will be redirected to Razorpay to complete the payment securely.
                          </p>
                        </div>
                      )}
                    </div>

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
                                  placeholder="Discount code or gift card"
                                  className="flex-1 border-gray-300"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={applyDiscount}
                                  className="border-gray-300 font-semibold"
                                >
                                  Apply
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {discount > 0 && (
                        <p className="text-sm font-semibold text-green-600">
                          Discount applied: -₹{discount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !selectedAddressId}
                      className="w-full bg-black py-6 text-base font-bold text-white hover:bg-black/90 rounded-lg disabled:bg-gray-400"
                    >
                      {isLoading ? "Processing…" : "Pay now"}
                    </Button>

                    {/* Legal Links */}
                    <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-600 leading-relaxed">
                      <p>
                        By placing your order, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="font-semibold text-gray-800 hover:text-black underline-offset-2 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and acknowledge our{" "}
                        <Link
                          href="/policies"
                          className="font-semibold text-gray-800 hover:text-black underline-offset-2 hover:underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/return-policies"
                          className="font-semibold text-gray-800 hover:text-black underline-offset-2 hover:underline"
                        >
                          Return &amp; Refund Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="h-fit rounded-lg border border-gray-300 bg-gray-50 p-6 sticky top-8">
                {/* Cart Items */}
                <div className="mb-6 pb-6 border-b border-gray-300">
                  {cart && cart.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 mb-4 last:mb-0">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white text-xs font-bold z-10">
                          {item.quantity}
                        </span>
                        <img
                          src={BASE_URL + item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="h-full w-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-base font-bold text-gray-900 mt-1">
                          ₹{item.product.price.toLocaleString()}.00
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-semibold">₹{cart?.cartTotalPrice.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800 font-medium">Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-800 font-medium">Discount</span>
                      <span className="text-green-600 font-bold">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-800 font-medium">Tax</span>
                    <span className="text-gray-900 font-semibold">%5</span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-700 font-semibold uppercase">INR</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{cart?.cartTotalPrice.toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-700 font-medium">
                      Including ₹{cart?.cartTotalPrice.toLocaleString()} in taxes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function CheckOutHeader() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">

        <Link href={"/"} className="flex-shrink-0 text-center">
          <h1
            className={`${nunitoSans.className} text-2xl md:text-[30px] font-bold tracking-wide`}
          >
            URBAN
            <span className="text-[#9b1e22] mx-1">CRAVIN'</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative hover:text-black transition-colors"
          >
            <ShoppingBag size={22} />
          </Link>
        </div>
      </div>
    </header>
  )
}