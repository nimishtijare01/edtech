import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@repo/database';

export default async function CoursePlayer({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              attachments: true,
              progress: { where: { userId: session.user.id } }
            }
          }
        }
      }
    }
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  // Render a basic split screen layout
  return (
    <div className="flex h-screen bg-white">
      {/* Video Player Area */}
      <div className="flex-1 bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center text-white">
          <p className="text-gray-400">Video Player Component</p>
          {/* Mux or Cloudflare Stream would go here */}
        </div>
      </div>

      {/* Syllabus Sidebar */}
      <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
        </div>
        
        <div className="p-4 space-y-4">
          {course.modules.map(module => (
            <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-900">
                {module.title}
              </div>
              <div className="divide-y divide-gray-100">
                {module.lessons.map(lesson => (
                  <div key={lesson.id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
