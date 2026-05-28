"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Plane, 
  Palmtree, 
  CalendarDays, 
  Ticket, 
  RefreshCcw, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Master Bandara", icon: Palmtree, href: "/admin/master-bandara" },
  { name: "Master Maskapai", icon: Plane, href: "/admin/master-maskapai" },
  { name: "Master Jadwal", icon: CalendarDays, href: "/admin/master-jadwal" },
  { name: "Master Kode Promo", icon: Ticket, href: "/admin/master-kode-promo" },
  { name: "Ubah Status", icon: RefreshCcw, href: "/admin/ubah-status" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <aside 
      className={cn(
        "bg-slate-950 border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out h-screen sticky top-0 z-50 shadow-2xl",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
               <Plane className="h-6 w-6 text-white rotate-45" />
            </div>
            <span className="font-black text-xl text-white tracking-tighter">Horizon Air</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
             <Plane className="h-6 w-6 text-white rotate-45" />
          </div>
        )}
      </div>

      <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
           <div className="px-4 py-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <UserCircle className="h-6 w-6 text-blue-400" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Administrator"}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 opacity-80">Super Admin</p>
                 </div>
              </div>
           </div>
        )}

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400")} />
                {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl border border-white/5">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-slate-500 hover:text-white hover:bg-white/5 h-10 hidden md:flex"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4 mr-2" /> Collapse Menu</>}
        </Button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group relative font-bold text-sm"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
          {!isCollapsed && <span>Logout Account</span>}
        </button>
      </div>
    </aside>
  );
}
