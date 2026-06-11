"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyRazorpayPayment } from "../actions";

export function CheckoutButton({ courseId, price, courseName }: { courseId: string, price: number, courseName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 1. Create order on backend (triggers 5% route split)
      const order = await createRazorpayOrder(courseId);

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock_key", // Need real key in .env
        amount: order.amount,
        currency: order.currency,
        name: "EdTech Platform",
        description: `Enroll in ${courseName}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature on backend
            await verifyRazorpayPayment(courseId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            alert("Payment Successful! Welcome to the course.");
            router.push(`/courses/${courseId}/learn`);
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment Verification Failed. Contact Support.");
          }
        },
        prefill: {
          name: "Student Name", // In production, fetch from user session
          email: "student@example.com",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:bg-primary/90 hover:scale-105 transition-all w-full sm:w-auto"
    >
      {loading ? "Processing..." : `Enroll Now for ₹${price}`}
    </button>
  );
}
