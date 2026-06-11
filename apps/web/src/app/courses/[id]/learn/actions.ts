"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function markLessonProgress(lessonId: string, courseId: string, completed: boolean, timestampSeconds?: number, watchedPercentage?: number) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch(`http://localhost:3000/lessons/${lessonId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ completed, timestampSeconds, watchedPercentage })
  });

  if (!res.ok) throw new Error("Failed to mark progress");

  revalidatePath(`/courses/${courseId}/learn`);
  return { success: true };
}
