import { Building2 } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { CreateInstituteForm } from "@/components/CreateInstituteForm";
import { InstituteRowActions } from "@/components/InstituteRowActions";

async function getInstitutes() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch('http://localhost:3000/institutes', { 
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.access_token || ''}`
      }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch institutes", error);
    return [];
  }
}

export default async function InstitutesPage() {
  const institutes = await getInstitutes();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutes</h1>
          <p className="text-muted-foreground mt-2">
            Manage all coaching institutes registered on the platform.
          </p>
        </div>
        <CreateInstituteForm />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Subdomain</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {institutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No institutes found. Create one to get started.
                  </td>
                </tr>
              ) : (
                institutes.map((inst: any) => (
                  <tr key={inst.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Building2 size={16} />
                      </div>
                      {inst.name}
                    </td>
                    <td className="px-6 py-4">{inst.subdomain || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-accent text-foreground">
                        {inst.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(inst.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <InstituteRowActions institute={inst} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
