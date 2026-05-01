"use client";

import { useState } from "react";
import { Trash2, Key, X, Edit } from "lucide-react";
import { deleteUser, updateUserPassword, updateUser } from "@/app/actions";

interface UserActionsProps {
  user: {
    id: string;
    role: string;
    name: string | null;
    username: string;
    email: string | null;
  };
  currentUserId: string;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("userId", user.id);
    
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 hover:bg-green-500/20 transition-colors"
      >
        <Edit className="w-3.5 h-3.5" /> Edit
      </button>
      
      <button
        onClick={() => setIsChangingPassword(true)}
        className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-500/20 transition-colors"
      >
        <Key className="w-3.5 h-3.5" /> Password
      </button>

      {user.role !== "MAIN" && user.id !== currentUserId && (
        <form action={deleteUser.bind(null, user.id)}>
          <button type="submit" className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </form>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm relative text-left">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-2">Edit User</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Updating details for <span className="text-white font-medium">{user.name || "User"}</span>
            </p>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name || ""}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Username</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={user.username}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email || ""}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Account Type</label>
                <select
                  name="role"
                  defaultValue={user.role}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  <option value="SUB">Sub User</option>
                  <option value="MAIN">Main User (Admin)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

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
