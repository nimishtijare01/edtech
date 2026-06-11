"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createInstitute } from "@/app/institutes/actions";

export function CreateInstituteForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      await createInstitute(formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <Plus size={18} />
        New Institute
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Create New Institute</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Institute Name</label>
                <input 
                  name="name" 
                  required 
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  placeholder="Alpha Coaching Academy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Subdomain (Optional)</label>
                <input 
                  name="subdomain" 
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  placeholder="alpha-academy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tier</label>
                <select 
                  name="tier" 
                  required
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                >
                  <option value="ALPHA">ALPHA (Premium)</option>
                  <option value="BETA">BETA (Standard)</option>
                </select>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Institute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
