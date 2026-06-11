import { Users as UsersIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { InviteUserForm } from "@/components/InviteUserForm";

async function getUsers() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    const res = await fetch('http://localhost:3000/users', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      next: { tags: ['users'] } // or revalidate
    });
    
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

async function getInstitutes() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    const res = await fetch('http://localhost:3000/institutes', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();
  const institutes = await getInstitutes();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="text-primary" size={32} />
            Users
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage students, tutors, and staff across your institutes
          </p>
        </div>
        <InviteUserForm institutes={institutes} />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Institute ID</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <UsersIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p>No users found.</p>
                      <p className="text-xs mt-1">Invite your first user to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary' :
                        user.role === 'INSTITUTE_OWNER' ? 'bg-blue-500/10 text-blue-500' :
                        user.role === 'TUTOR' ? 'bg-green-500/10 text-green-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {user.instituteId || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
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
