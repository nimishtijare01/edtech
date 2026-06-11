"use client";

import { GripVertical, Plus } from "lucide-react";
import { CreateLessonForm } from "./CreateLessonForm";
import { LessonList } from "./LessonList";

export function ModuleList({ modules, courseId }: { modules: any[], courseId: string }) {
  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <div key={module.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-accent/50 px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GripVertical className="text-muted-foreground/50 cursor-move" size={18} />
              <h3 className="font-semibold text-lg">{module.title}</h3>
            </div>
            
            <CreateLessonForm courseId={courseId} moduleId={module.id} />
          </div>
          
          <div className="p-0">
            {module.lessons && module.lessons.length > 0 ? (
              <LessonList lessons={module.lessons} courseId={courseId} />
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No lessons in this module yet. Add one to get started.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
