import { Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { CreateBatchForm } from "@/components/CreateBatchForm";
import { BatchRowActions } from "@/components/BatchRowActions";

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
    return [];
  }
}

async function getBatches() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch('http://localhost:3000/batches', { 
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.access_token || ''}`
      }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function BatchesPage() {
  const [batches, institutes] = await Promise.all([getBatches(), getInstitutes()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground mt-2">
            Manage your teaching batches across institutes.
          </p>
        </div>
        <CreateBatchForm institutes={institutes} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Institute</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">End Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No batches found. Create one to get started.
                  </td>
                </tr>
              ) : (
                batches.map((batch: any) => (
                  <tr key={batch.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Calendar size={16} />
                      </div>
                      {batch.name}
                    </td>
                    <td className="px-6 py-4">{batch.institute?.name || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BatchRowActions batch={batch} />
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
