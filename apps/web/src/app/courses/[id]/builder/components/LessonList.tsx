"use client";

import { FileText, Play, File, Link as LinkIcon } from "lucide-react";
import { CreateAttachmentForm } from "./CreateAttachmentForm";

export function LessonList({ lessons, courseId }: { lessons: any[], courseId: string }) {
  return (
    <div className="divide-y divide-border">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="p-4 bg-card hover:bg-accent/10 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{lesson.title}</h4>
              {lesson.content && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
              )}
            </div>
            <CreateAttachmentForm courseId={courseId} lessonId={lesson.id} />
          </div>

          {/* Attachments */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.attachments.map((attachment: any) => {
                let Icon = File;
                if (attachment.type === 'VIDEO') Icon = Play;
                if (attachment.type === 'PDF') Icon = FileText;

                return (
                  <div 
                    key={attachment.id} 
                    className="flex items-center gap-2 text-xs font-medium bg-accent/40 text-foreground px-2.5 py-1.5 rounded-md border border-border"
                  >
                    <Icon size={14} className="text-primary" />
                    <span className="truncate max-w-[150px]">{attachment.title}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
