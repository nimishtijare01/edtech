"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createRazorpayOrder(courseId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`http://localhost:3000/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ courseId })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create order");
  }

  return await res.json();
}

export async function verifyRazorpayPayment(courseId: string, paymentData: any) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`http://localhost:3000/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify(paymentData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to verify payment");
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses`);
  return await res.json();
}
