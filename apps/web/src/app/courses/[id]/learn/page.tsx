import { createClient } from "@/utils/supabase/server";
import { PlayerClient } from "./components/PlayerClient";

async function getCourseWithModules(courseId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const res = await fetch(`http://localhost:3000/course-modules?courseId=${courseId}`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    next: { tags: [`course-modules-${courseId}`] }
  });
  if (!res.ok) return [];
  return await res.json();
}

export default async function CourseLearnPage({ params }: { params: { id: string } }) {
  const modules = await getCourseWithModules(params.id);

  if (!modules || modules.length === 0) {
    return <div className="p-8">No content available for this course yet.</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PlayerClient modules={modules} courseId={params.id} />
    </div>
  );
}
