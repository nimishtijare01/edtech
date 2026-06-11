"use client";

import { useState } from "react";
import { CheckCircle, Circle, Play, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { markLessonProgress } from "../actions";
import { VideoJSPlayer } from "./VideoJSPlayer";

export function PlayerClient({ modules, courseId }: { modules: any[], courseId: string }) {
  const [activeLesson, setActiveLesson] = useState<any>(modules[0]?.lessons[0] || null);
  const [marking, setMarking] = useState(false);

  const handleSelect = (lesson: any) => {
    setActiveLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    setMarking(true);
    try {
      await markLessonProgress(activeLesson.id, courseId, true);
    } catch (e) {
      console.error("Failed to mark progress:", e);
    } finally {
      setMarking(false);
    }
  };

  const activeVideoAttachment = activeLesson?.attachments?.find((a: any) => a.type === 'VIDEO');
  const activePdfAttachments = activeLesson?.attachments?.filter((a: any) => a.type === 'PDF');

  // Find user's last progress on this lesson
  const lessonProgress = activeLesson?.progress?.[0] || {};
  const initialTime = lessonProgress.timestampSeconds || 0;
  const isCompleted = lessonProgress.completed || false;

  // Assume a Cloudflare customer subdomain. In production, this would be an env var.
  const CUSTOMER_SUBDOMAIN = process.env.NEXT_PUBLIC_CF_SUBDOMAIN || "customer-m033z5x00ks6nunl"; // mock placeholder

  const videoJsOptions = activeVideoAttachment?.cfVideoId ? {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `https://${CUSTOMER_SUBDOMAIN}.cloudflarestream.com/${activeVideoAttachment.cfVideoId}/manifest.m3u8`,
      type: 'application/x-mpegURL'
    }]
  } : null;

  return (
    <div className="flex w-full h-full">
      {/* Sidebar Curriculum */}
      <aside className="w-80 border-r border-border bg-card/50 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border">
          <Link href="/courses" className="text-sm text-primary hover:underline flex items-center gap-1 mb-4">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h2 className="font-bold text-lg leading-tight">Course Curriculum</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {modules.map((module: any, mIdx: number) => (
            <div key={module.id}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Module {mIdx + 1}: {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons?.map((lesson: any) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const lessonCompleted = lesson.progress?.some((p: any) => p.completed);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelect(lesson)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "hover:bg-accent/50 text-foreground"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {lessonCompleted ? (
                          <CheckCircle size={18} className={isActive ? "text-primary-foreground" : "text-green-500"} />
                        ) : (
                          <Circle size={18} className={isActive ? "text-primary-foreground/50" : "text-muted-foreground/50"} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
                        <div className="flex items-center gap-2 mt-1 opacity-70 text-xs">
                          {lesson.attachments?.some((a: any) => a.type === 'VIDEO') && <Play size={12} />}
                          {lesson.attachments?.some((a: any) => a.type === 'PDF') && <FileText size={12} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-5xl mx-auto w-full p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{activeLesson.title}</h1>
              {activeLesson.content && (
                <p className="text-muted-foreground text-lg">{activeLesson.content}</p>
              )}
            </div>

            {/* Media Player */}
            {activeVideoAttachment && videoJsOptions ? (
              <div className="rounded-xl overflow-hidden shadow-xl border border-border bg-black aspect-video mb-8">
                <VideoJSPlayer 
                  options={videoJsOptions} 
                  lessonId={activeLesson.id} 
                  courseId={courseId}
                  initialTime={initialTime}
                />
              </div>
            ) : activeVideoAttachment && !activeVideoAttachment.cfVideoId ? (
              <div className="aspect-video bg-accent/20 border border-border border-dashed rounded-xl flex items-center justify-center text-muted-foreground mb-8">
                Video is still processing. Please check back shortly.
              </div>
            ) : null}

            {/* Notes / PDFs */}
            {activePdfAttachments && activePdfAttachments.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {activePdfAttachments.map((pdf: any) => (
                    <a 
                      key={pdf.id}
                      href={pdf.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-3 p-4 bg-accent/20 border border-border rounded-xl hover:bg-accent/40 transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-medium">{pdf.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">PDF Document</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center border-t border-border pt-6 mt-6 pb-20">
              <div>
                <button 
                  onClick={handleMarkComplete}
                  disabled={marking || isCompleted}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm ${
                    isCompleted 
                      ? "bg-accent text-muted-foreground cursor-default" 
                      : "bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                  }`}
                >
                  <CheckCircle size={18} />
                  {marking ? "Marking..." : isCompleted ? "Completed" : "Mark as Complete"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a lesson from the curriculum to begin.
          </div>
        )}
      </main>
    </div>
  );
}
