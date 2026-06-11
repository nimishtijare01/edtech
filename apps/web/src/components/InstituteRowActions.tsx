"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { updateInstitute, deleteInstitute } from "@/app/institutes/actions";

interface Institute {
  id: string;
  name: string;
  subdomain: string;
  tier: string;
}

export function InstituteRowActions({ institute }: { institute: Institute }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInstitute(institute.id);
      setShowDelete(false);
    } catch (err: any) {
      console.error(err);
      // Let the user know deletion failed if needed
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateInstitute(institute.id, formData);
      setShowEdit(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => setTimeout(() => setShowMenu(false), 200)}
        className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent/50"
      >
        <MoreHorizontal size={18} />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-10 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
          <button 
            onClick={() => setShowEdit(true)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-accent/50 flex items-center gap-2"
          >
            <Edit size={16} /> Edit
          </button>
          <button 
            onClick={() => setShowDelete(true)}
            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Institute"
        description={`Are you sure you want to delete "${institute.name}"? This action cannot be undone and will permanently delete all associated batches, courses, and data.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={loading}
      />

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm text-left">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit Institute</h2>
            
            <form action={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Institute Name</label>
                <input 
                  name="name" 
                  defaultValue={institute.name}
                  required 
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subdomain</label>
                <div className="flex items-center">
                  <input 
                    name="subdomain" 
                    defaultValue={institute.subdomain}
                    required 
                    className="w-full rounded-l-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                  />
                  <span className="px-3 py-2 bg-accent text-muted-foreground rounded-r-md border border-l-0 border-border">
                    .edtech.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subscription Tier</label>
                <select 
                  name="tier" 
                  defaultValue={institute.tier}
                  required
                  className="w-full rounded-md border-0 py-2 px-3 bg-accent/30 ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary"
                >
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
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
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
