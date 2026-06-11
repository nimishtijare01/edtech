"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createInstitute(formData: FormData) {
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const tier = formData.get("tier") as string;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch('http://localhost:3000/institutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ name, subdomain, tier })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create institute");
  }

  revalidatePath("/institutes");
  return { success: true };
}

export async function updateInstitute(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const tier = formData.get("tier") as string;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`http://localhost:3000/institutes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ name, subdomain, tier })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update institute");
  }

  revalidatePath("/institutes");
  return { success: true };
}

export async function deleteInstitute(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`http://localhost:3000/institutes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete institute");
  }

  revalidatePath("/institutes");
  return { success: true };
}
