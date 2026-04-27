import { getServerSession } from "next-auth";

import { DatabaseBackup, Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BackupsPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") return redirect("/");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Database Backups</h1>
        <p className="text-sm text-zinc-400">Download a snapshot of the current SQLite database.</p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-6">
        <div className="rounded-full bg-blue-500/10 p-6 text-blue-500">
          <DatabaseBackup className="h-12 w-12" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white">Download Database Backup</h2>
          <p className="mt-2 text-zinc-400 max-w-md mx-auto">
            This will download the entire SQLite database file (`dev.db`). Keep this file secure as it contains all Fuel Indents, Gatepasses, and User credentials.
          </p>
        </div>

        <a
          href="/api/backup"
          download="aadhi_cars_backup.db"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
        >
          <Download className="h-5 w-5" />
          Download Backup (.db)
        </a>
      </div>
    </div>
  );
}
