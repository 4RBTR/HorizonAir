"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Plane,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/customer" },
  { name: "Tiket Saya", icon: Ticket, href: "/customer/tiket-saya" },
];

export function CustomerSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Header (Visible only on mobile) */}
      <header className="md:hidden w-full h-16 bg-slate-950 flex items-center justify-between px-4 sticky top-0 z-50 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
             <Plane className="h-5 w-5 text-white rotate-45" />
          </div>
          <span className="font-black text-base text-white tracking-tighter">Horizon Air</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-white hover:bg-white/5"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Mobile Drawer (Visible only on mobile when open) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950 z-40 flex flex-col p-6 animate-in slide-in-from-top duration-300">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 px-2 py-4 border-b border-white/5">
               <UserCircle className="h-10 w-10 text-blue-400" />
               <div>
                  <p className="text-sm font-bold text-white">{session?.user?.name || "Horizon Traveler"}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Horizon Elite</p>
               </div>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold",
                      isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="border-t border-white/5 pt-6 pb-8">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Visible only on desktop) */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-slate-950 border-r border-white/5 transition-all duration-500 ease-in-out h-screen sticky top-0 z-50 shadow-2xl shrink-0",
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
                      <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Horizon Traveler"}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 opacity-80">Horizon Elite</p>
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
    </>
  );
}
