
import axios from "axios";
import { PAYMENT_FAILURE_PATH, PAYMENT_SUCCESS_PATH, VERIFY_PAYMENT_URL } from "./urls";
import { getAuthToken } from "@/data/cart";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
},router : AppRouterInstance) => {
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
      const token = await getAuthToken()
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
              Authorization: token,
            },
          }
        );

        console.log("✅ Payment verified:", verifyResponse.data);
        router.replace(
          `${PAYMENT_SUCCESS_PATH}?order_id=${receipt}&payment_id=${response.razorpay_payment_id}&sessionId=${sessionId}`
        );
      } catch (error) {
        console.error("❌ Payment verification failed:", error);
        router.replace(
          `${PAYMENT_FAILURE_PATH}?order_id=${receipt}&payment_id=${response.razorpay_payment_id}&sessionId=${sessionId}&reason=verification_failed`
        );
        alert("Payment verification failed. Please contact support.");
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
    const paymentId = response?.error?.metadata?.payment_id ?? "";
    const orderId = response?.error?.metadata?.order_id ?? receipt;
    router.replace(
      `${PAYMENT_FAILURE_PATH}?order_id=${orderId}&payment_id=${paymentId}&sessionId=${sessionId}&reason=gateway_failed`
    );
  });

  rzp.open();
};
