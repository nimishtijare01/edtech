import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@repo/database';
import Link from 'next/link';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  // Next.js Server Components have direct DB access, so we don't need to hop through NestJS
  // Get courses user bought explicitly via Payment
  const payments = await prisma.payment.findMany({
    where: { studentId: session.user.id, status: 'SUCCESS' },
    select: { course: true }
  });
  
  // Get courses part of a Batch the user is in
  const batches = await prisma.batch.findMany({
    where: { students: { some: { id: session.user.id } } },
    include: { courses: true }
  });

  const coursesMap = new Map();
  payments.forEach(p => coursesMap.set(p.course.id, p.course));
  batches.forEach(b => b.courses.forEach(c => coursesMap.set(c.id, c)));
  const courses = Array.from(coursesMap.values());

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning</h1>
        
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
            <p className="mt-2 text-gray-500">You haven't enrolled in any courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link href={`/student/course/${course.id}`} key={course.id}>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                      {course.description || "No description available"}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 text-blue-600 font-medium">
                      Resume Course →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
