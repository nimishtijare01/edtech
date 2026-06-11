"use client";

import { useState } from "react";
import { Paperclip, X, UploadCloud } from "lucide-react";
import { createAttachment, getCloudflareUploadUrl } from "../actions";

export function CreateAttachmentForm({ courseId, lessonId }: { courseId: string, lessonId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For file upload
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    try {
      if (file) {
        // 1. Get direct upload URL from our backend for Cloudflare Stream
        const { uploadUrl, uploadId } = await getCloudflareUploadUrl(lessonId);
        
        // 2. Upload file directly to Cloudflare via FormData (TUS/basic upload)
        // Cloudflare requires uploading as multipart/form-data for basic uploads
        const cfFormData = new FormData();
        cfFormData.append("file", file);
        
        await fetch(uploadUrl, {
          method: 'POST',
          body: cfFormData
        });

        // 3. Save video attachment reference in our database
        const videoData = new FormData();
        videoData.set("title", title);
        videoData.set("url", "Processing..."); // CF processes it asynchronously
        videoData.set("type", "VIDEO");
        videoData.set("cfUploadId", uploadId);
        videoData.set("cfVideoId", uploadId); // Initially uploadId is often the video UID
        await createAttachment(lessonId, courseId, videoData);
      }

      // If they also attached a PDF note link
      if (pdfUrl) {
        const pdfData = new FormData();
        pdfData.set("title", `${title} - Notes`);
        pdfData.set("url", pdfUrl);
        pdfData.set("type", "PDF");
        await createAttachment(lessonId, courseId, pdfData);
      }
      
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 bg-accent/30 px-2 py-1 rounded transition-colors"
      >
        <Paperclip size={14} />
        Add Content
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6">Upload Lesson Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Content Title (Name)</label>
                <input 
                  name="title" 
                  required 
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Lecture 1 Video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Video File</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-accent/10">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <input 
                    type="file" 
                    accept="video/*"
                    required={!pdfUrl} // Require video if no PDF provided
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>Attach Notes PDF (URL)</span>
                  <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                </label>
                <input 
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
              >
                {loading ? "Uploading & Saving..." : "Save Content"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
