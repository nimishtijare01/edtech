"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function createCourseModule(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch('http://localhost:3000/course-modules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ title, order, courseId })
  });

  if (!res.ok) throw new Error("Failed to create module");

  revalidatePath(`/courses/${courseId}/builder`);
  return { success: true };
}

export async function createLesson(moduleId: string, courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const order = formData.get("order") ? parseInt(formData.get("order") as string) : 0;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch('http://localhost:3000/lessons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ title, content, order, moduleId })
  });

  if (!res.ok) throw new Error("Failed to create lesson");

  revalidatePath(`/courses/${courseId}/builder`);
  return { success: true };
}

export async function createAttachment(lessonId: string, courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const type = formData.get("type") as string;
  const cfUploadId = formData.get("cfUploadId") as string;
  const cfVideoId = formData.get("cfVideoId") as string;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch('http://localhost:3000/attachments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ 
      title, 
      url, 
      type, 
      lessonId,
      cfUploadId: cfUploadId || undefined,
      cfVideoId: cfVideoId || undefined
    })
  });

  if (!res.ok) throw new Error("Failed to create attachment");

  revalidatePath(`/courses/${courseId}/builder`);
  return { success: true };
}

export async function getCloudflareUploadUrl(lessonId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw new Error("Unauthorized");

  const res = await fetch('http://localhost:3000/attachments/cloudflare-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ lessonId })
  });

  if (!res.ok) throw new Error("Failed to generate upload URL");

  return await res.json();
}
