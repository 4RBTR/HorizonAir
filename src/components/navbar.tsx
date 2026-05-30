"use client";

import Link from "next/link";
import { Plane, LogIn, UserPlus, LayoutDashboard, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const dashboardPath = role === "admin" ? "/admin" : "/customer";

  return (
    <nav className="border-b border-white/10 bg-white/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
             <Plane className="h-6 w-6 text-white rotate-45" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-950 group-hover:text-blue-600 transition-colors">
            Horizon Air
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-600 uppercase tracking-widest">
          <Link href="#layanan" className="hover:text-blue-600 transition-all hover:scale-105">
            Layanan
          </Link>
          <Link href="#tentang" className="hover:text-blue-600 transition-all hover:scale-105">
            Tentang
          </Link>
          <Link href="#kontak" className="hover:text-blue-600 transition-all hover:scale-105">
            Kontak
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link 
                href={dashboardPath} 
                className={cn(buttonVariants({ variant: "ghost" }), "font-bold text-slate-600 hover:text-blue-600 gap-2")}
              >
                <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
              </Link>
              <button 
                onClick={() => signOut()} 
                className={cn(buttonVariants(), "bg-red-600 hover:bg-red-700 text-white px-6 rounded-xl font-bold shadow-xl gap-2 cursor-pointer")}
              >
                <LogOut className="h-4.5 w-4.5" /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "font-bold text-slate-600 hover:text-blue-600 gap-2")}>
                <LogIn className="h-4 w-4" /> Masuk
              </Link>
              <Link href="/register" className={cn(buttonVariants(), "bg-slate-950 text-white hover:bg-slate-800 px-6 rounded-xl font-bold shadow-xl gap-2")}>
                <UserPlus className="h-4 w-4" /> Join Elite
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
