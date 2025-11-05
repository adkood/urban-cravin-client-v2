import axios from "axios";
import { BASE_URL, RETURNURLAFTERPAYMENT, VERIFY_PAYMENT_URL } from "./urls";
import { getAuthToken } from "@/data/cart";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleRazorpay = async ({
  razorpay_order_id,
  amount,
  currency,
  receipt,
  key,
  sessionId,
  costumerDetails,
}: {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  key: string;
  sessionId: string;
  costumerDetails: {
    name: string;
    email: string;
  };
}) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Failed to load Razorpay SDK");
    return;
  }

  const options = {
    key,
    amount,
    currency,
    name: "Urban Cravin'",
    description: "Order Payment",
    order_id: razorpay_order_id,
    handler: async function (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) {

        console.log(response.razorpay_signature);
      try {
        const verifyResponse = await axios.post(
          VERIFY_PAYMENT_URL,
          {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc2h1dG9zaCIsImlhdCI6MTc2MjI3NDk2MCwiZXhwIjoxNzYyMjc4NTYwfQ.-2mgcxN74XUUxFop8wdVCu4NBNmnANidJKLwP3LHW4w",
            },
          }
        );

        console.log("✅ Payment verified:", verifyResponse.data);
        // Redirect after verification
        window.location.href = `${RETURNURLAFTERPAYMENT}?order_id=${receipt}&payment_id=${response.razorpay_payment_id}&sessionId=${sessionId}`;
      } catch (error) {
        console.error("❌ Payment verification failed:", error);
        window.location.href = `${RETURNURLAFTERPAYMENT}?order_id=${receipt}&payment_id=${response.razorpay_payment_id}&sessionId=${sessionId}`;
        // alert("Payment verification failed. Please contact support.");
      }
    },
    prefill: {
      name: costumerDetails?.name,
      email: costumerDetails?.email,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response: any) {
    alert("Payment Failed!");
    console.error(response.error);
  });

  rzp.open();
};
