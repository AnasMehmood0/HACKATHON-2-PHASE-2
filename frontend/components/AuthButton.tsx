// AuthButton with premium dark theme styling
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function AuthButton() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="w-10 h-10 bg-[#1C1C1C] border border-white/5 rounded-2xl flex items-center justify-center animate-pulse">
        <div className="w-5 h-5 bg-gray-700 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-5 py-2.5 text-sm font-medium bg-[#D4FF5E] text-[#0F0F0F] rounded-2xl hover:bg-[#D4FF5E]/90 transition-all flex items-center gap-2"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] border border-white/5 rounded-2xl">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
          <User size={16} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-sm text-gray-300">{user.email}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="p-2.5 text-gray-400 hover:text-white bg-[#1C1C1C] border border-white/5 rounded-2xl hover:border-white/10 transition-all"
        title="Sign Out"
      >
        <LogOut size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
