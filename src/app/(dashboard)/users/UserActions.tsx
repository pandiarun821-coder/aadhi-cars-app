"use client";

import { useState } from "react";
import { Trash2, Key, X } from "lucide-react";
import { deleteUser, updateUserPassword } from "@/app/actions";

interface UserActionsProps {
  user: {
    id: string;
    role: string;
    name: string | null;
  };
}

export function UserActions({ user }: UserActionsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("newPassword", newPassword);
    
    try {
      await updateUserPassword(formData);
      setIsChangingPassword(false);
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user.role === "MAIN") return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setIsChangingPassword(true)}
        className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-500/20 transition-colors"
      >
        <Key className="w-3.5 h-3.5" /> Password
      </button>

      <form action={deleteUser.bind(null, user.id)}>
        <button type="submit" className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </form>

      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm relative text-left">
            <button 
              onClick={() => setIsChangingPassword(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Updating password for <span className="text-white font-medium">{user.name || "User"}</span>
            </p>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
