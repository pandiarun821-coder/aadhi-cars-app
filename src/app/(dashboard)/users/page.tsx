import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Trash2, UserPlus } from "lucide-react";
import { createUser, deleteUser } from "@/app/actions";

export default async function UsersPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "MAIN") {
    return redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { role: "asc" },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Users</h1>
        <p className="text-sm text-zinc-400">Create sub-users and manage system access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Users List */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Username</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium text-white">{u.name || "-"}</td>
                    <td className="px-6 py-4 text-zinc-400">{u.username}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        u.role === 'MAIN' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'MAIN' && (
                        <form action={deleteUser.bind(null, u.id)}>
                          <button type="submit" className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Form */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              New Sub-User
            </h2>
            <form action={createUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="user1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
