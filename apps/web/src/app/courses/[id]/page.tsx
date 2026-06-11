import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutButton } from "./components/CheckoutButton";
import Link from "next/link";
import { ChevronLeft, BookOpen, Layers } from "lucide-react";

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch course details
  const res = await fetch(`http://localhost:3000/courses/${params.id}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });

  if (!res.ok) {
    return <div className="p-8 text-destructive">Course not found</div>;
  }

  const course = await res.json();

  // Check if student is already enrolled (via payment)
  const paymentRes = await fetch(`http://localhost:3000/payments?courseId=${params.id}&studentId=${session.user.id}&status=SUCCESS`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });
  
  let isEnrolled = false;
  if (paymentRes.ok) {
    const payments = await paymentRes.json();
    if (payments.length > 0) {
      isEnrolled = true;
    }
  }

  // Calculate total lessons
  const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;

  return (
    <div className="max-w-5xl mx-auto p-8 pt-12">
      <Link href="/courses" className="text-sm text-primary hover:underline flex items-center gap-1 mb-8">
        <ChevronLeft size={16} /> Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {course.description || "No description provided for this course."}
          </p>

          <div className="flex gap-6 py-6 border-y border-border mt-8">
            <div className="flex items-center gap-2">
              <Layers className="text-muted-foreground" size={20} />
              <span className="font-medium">{course.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="text-muted-foreground" size={20} />
              <span className="font-medium">{totalLessons} Lessons</span>
            </div>
          </div>

          {/* Curriculum Preview */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Curriculum Overview</h2>
            <div className="space-y-4">
              {course.modules?.map((mod: any, index: number) => (
                <div key={mod.id} className="border border-border rounded-xl p-5 bg-card">
                  <h3 className="font-semibold text-lg flex items-center gap-3">
                    <span className="bg-accent text-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {mod.title}
                  </h3>
                  {mod.lessons?.length > 0 ? (
                    <ul className="mt-4 space-y-2 ml-11 border-l-2 border-accent pl-4">
                      {mod.lessons.map((lesson: any) => (
                        <li key={lesson.id} className="text-muted-foreground text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full" />
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground ml-11 mt-2">No lessons yet.</p>
                  )}
                </div>
              ))}
              {(!course.modules || course.modules.length === 0) && (
                <p className="text-muted-foreground">Curriculum is being updated.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Checkout Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border p-6 rounded-2xl shadow-xl">
            <div className="text-3xl font-extrabold mb-6">
              ₹{course.price}
            </div>
            
            {isEnrolled ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 text-green-500 p-4 rounded-xl font-medium text-center border border-green-500/20">
                  You are already enrolled!
                </div>
                <Link 
                  href={`/courses/${course.id}/learn`}
                  className="block w-full text-center bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-md hover:bg-primary/90 transition-all"
                >
                  Go to Classroom
                </Link>
              </div>
            ) : (
              <CheckoutButton courseId={course.id} price={course.price} courseName={course.title} />
            )}
            
            <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">✓ Full lifetime access</p>
              <p className="flex items-center gap-2">✓ Access on mobile and desktop</p>
              <p className="flex items-center gap-2">✓ Certificate of completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
