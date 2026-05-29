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
  User,
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

  // Get user initials for premium avatar
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "HT";

  return (
    <>
      {/* Mobile Header (Visible only on mobile, Glassmorphic Light style) */}
      <header className="md:hidden w-full h-16 bg-white/70 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50 border-b border-slate-100/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25">
             <Plane className="h-5 w-5 text-white rotate-45" />
          </div>
          <span className="font-black text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            Horizon Air
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Drawer (Visible only on mobile, Glassmorphic Light style) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white/95 backdrop-blur-2xl z-40 flex flex-col p-6 animate-in slide-in-from-top duration-300 border-t border-slate-100">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 px-2 py-4 border-b border-slate-100">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                  {initials}
               </div>
               <div>
                  <p className="text-sm font-black text-slate-800 leading-none">{session?.user?.name || "Horizon Traveler"}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">Horizon Elite</p>
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
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm",
                      isActive 
                        ? "bg-blue-600/10 text-blue-600" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="border-t border-slate-100 pt-6 pb-8">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Glassmorphic Premium Light style) */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white/70 backdrop-blur-xl border-r border-slate-100/80 transition-all duration-500 ease-in-out h-screen sticky top-0 z-50 shadow-sm shrink-0",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                 <Plane className="h-5 w-5 text-white rotate-45" />
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                Horizon Air
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
               <Plane className="h-5 w-5 text-white rotate-45" />
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
             <div className="px-4 py-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/20 border border-blue-100/30 space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                      {initials}
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-800 truncate leading-none">{session?.user?.name || "Horizon Traveler"}</p>
                      <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">Horizon Elite</p>
                   </div>
                </div>
             </div>
          )}

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative font-bold text-sm",
                    isActive 
                      ? "bg-blue-600/10 text-blue-600 shadow-sm shadow-blue-600/5" 
                      : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-800"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-105", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700")} />
                  {!isCollapsed && <span>{item.name}</span>}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl border border-slate-800">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Section */}
        <div className="p-4 border-t border-slate-100/50 space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-slate-400 hover:text-slate-800 hover:bg-slate-50 h-10 hidden md:flex rounded-xl font-bold"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4 mr-2" /> Collapse Menu</>}
          </Button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group relative font-bold text-sm border border-transparent hover:border-red-100/50"
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
