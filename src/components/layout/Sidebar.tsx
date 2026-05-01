"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, FileText, LayoutDashboard, DatabaseBackup, CheckSquare, Users, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Fuel Indents", href: "/fuel-indents", icon: FileText },
    { name: "Gatepass", href: "/gatepass", icon: FileText },
    ...(role === "MAIN"
      ? [
          { name: "Approvals", href: "/approvals", icon: CheckSquare },
          { name: "Vehicles", href: "/vehicles", icon: Car },
          { name: "Users", href: "/users", icon: Users },
          { name: "Backups", href: "/backups", icon: DatabaseBackup }
        ]
      : []),
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 print:hidden">
      <div className="flex h-24 items-center justify-center border-b border-zinc-800 bg-zinc-900/50">
        <Image 
          src="/logo.png" 
          alt="Aadhi Cars Logo" 
          width={180} 
          height={80} 
          className="object-contain max-h-16"
          priority
          unoptimized
        />
      </div>
      <div className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-zinc-800">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium text-zinc-200">
            {session?.user?.username}
          </p>
          <p className="text-xs text-zinc-500 uppercase">{role} USER</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
