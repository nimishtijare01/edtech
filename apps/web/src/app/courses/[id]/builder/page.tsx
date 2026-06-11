import { createClient } from "@/utils/supabase/server";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { ModuleList } from "./components/ModuleList";
import { CreateModuleForm } from "./components/CreateModuleForm";

async function getCourse(id: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const res = await fetch(`http://localhost:3000/courses/${id}`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    next: { tags: [`course-${id}`] }
  });
  if (!res.ok) return null;
  return await res.json();
}

async function getModules(courseId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const res = await fetch(`http://localhost:3000/course-modules?courseId=${courseId}`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    next: { tags: [`course-modules-${courseId}`] }
  });
  if (!res.ok) return [];
  return await res.json();
}

export default async function CourseBuilderPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  const modules = await getModules(params.id);

  if (!course) {
    return <div className="p-8">Course not found.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/courses" className="text-sm text-primary hover:underline mb-4 inline-block">
          &larr; Back to Courses
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="text-primary" size={32} />
              Curriculum Builder
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {course.title}
            </p>
          </div>
          <CreateModuleForm courseId={course.id} />
        </div>
      </div>

      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">No modules yet</h3>
            <p>Start building your curriculum by adding your first module.</p>
          </div>
        ) : (
          <ModuleList modules={modules} courseId={course.id} />
        )}
      </div>
    </div>
  );
}
