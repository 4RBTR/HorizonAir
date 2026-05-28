"use client";

import Link from "next/link";
import { Plane, Ticket, LogOut, User, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomerNavbar({ user }: { user: any }) {
  return (
    <nav className="border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/customer" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-500">
             <Plane className="h-6 w-6 text-white rotate-45" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-950">
            Horizon Air
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/customer/tiket-saya" className="hidden sm:flex text-sm font-bold text-slate-600 hover:text-blue-600 items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all">
            <Ticket className="h-4 w-4" /> Tiket Saya
          </Link>

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 rounded-xl">
             <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 p-1 pr-4 rounded-2xl hover:bg-slate-50 transition-all outline-none border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 <User className="h-5 w-5" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-black leading-none text-slate-950">{user?.name || "Member"}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Horizon Elite</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-2xl">
              <DropdownMenuLabel className="px-3 py-3">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Akun Personal</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">
                <User className="mr-3 h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-700">Profil Saya</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">
                <Settings className="mr-3 h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-700">Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: "/login" })} 
                className="rounded-xl py-3 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold">Keluar Aplikasi</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
