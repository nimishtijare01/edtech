"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { inviteUser } from "@/app/users/actions";

interface Institute {
  id: string;
  name: string;
}

export function InviteUserForm({ institutes }: { institutes: Institute[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await inviteUser(formData);
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
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Invite User
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
            
            <h2 className="text-xl font-bold mb-6">Invite User</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email"
                  name="email" 
                  required 
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select 
                  name="role" 
                  required
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="INSTITUTE_OWNER">Institute Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Institute</label>
                <select 
                  name="instituteId" 
                  required
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an Institute...</option>
                  {institutes.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? "Sending Invite..." : "Send Invite"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
