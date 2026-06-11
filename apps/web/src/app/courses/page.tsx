import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { CreateCourseForm } from "@/components/CreateCourseForm";
import { CourseRowActions } from "@/components/CourseRowActions";

async function getBatches() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch('http://localhost:3000/batches', { 
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.access_token || ''}`
      }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getCourses() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch('http://localhost:3000/courses', { 
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.access_token || ''}`
      }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function CoursesPage() {
  const [courses, batches] = await Promise.all([getCourses(), getBatches()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses across different batches.
          </p>
        </div>
        <CreateCourseForm batches={batches} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Batch</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Published</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No courses found. Create one to get started.
                  </td>
                </tr>
              ) : (
                courses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <BookOpen size={16} />
                      </div>
                      {course.title}
                    </td>
                    <td className="px-6 py-4">{course.batch?.name || "—"}</td>
                    <td className="px-6 py-4">
                      ₹{parseFloat(course.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle2 size={16} /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <XCircle size={16} /> No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CourseRowActions course={course} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
