"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getBandara } from "@/services/bandara";
import { getMaskapai } from "@/services/maskapai";
import { getJadwal } from "@/services/jadwal";
import { getPromo } from "@/services/promo";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, Palmtree, CalendarDays, Ticket, ShieldAlert, ArrowUpRight, Activity } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: session } = useSession();

  const { data: bandaras, isError: isBandaraError } = useQuery({ queryKey: ["bandara"], queryFn: getBandara });
  const { data: maskapais, isError: isMaskapaiError } = useQuery({ queryKey: ["maskapai"], queryFn: getMaskapai });
  const { data: jadwals, isError: isJadwalError } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });
  const { data: promos, isError: isPromoError } = useQuery({ queryKey: ["promo"], queryFn: getPromo });

  const hasError = isBandaraError || isMaskapaiError || isJadwalError || isPromoError;

  const stats = [
    { title: "Total Bandara", value: bandaras ? String(bandaras.length) : "...", desc: "Bandara terdaftar", icon: Palmtree, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Total Maskapai", value: maskapais ? String(maskapais.length) : "...", desc: "Maskapai penerbangan", icon: Plane, iconClass: "rotate-45", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Jadwal Aktif", value: jadwals ? String(jadwals.length) : "...", desc: "Keberangkatan & delay", icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { title: "Kode Promo", value: promos ? String(promos.length) : "...", desc: "Voucher diskon", icon: Ticket, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  ];

  const activityLogs = useMemo(() => {
    if (!jadwals) return [];
    
    // Extract recent live modifications from the schedule statusTerakhir times
    return jadwals
      .filter(j => j.statusTerakhir && j.statusTerakhir.waktuPerubahan !== "-")
      .sort((a, b) => {
        try {
          const parseDate = (str: string) => {
            const [datePart, timePart] = str.split(" ");
            const [d, m, y] = datePart.split("-").map(Number);
            return new Date(y, m - 1, d, ...timePart.split(":").map(Number));
          };
          return parseDate(b.statusTerakhir!.waktuPerubahan).getTime() - parseDate(a.statusTerakhir!.waktuPerubahan).getTime();
        } catch (e) {
          return 0;
        }
      })
      .slice(0, 4)
      .map(j => ({
        time: j.statusTerakhir!.waktuPerubahan,
        action: `Perubahan status live penerbangan ${j.kodePenerbangan} menjadi ${j.statusTerakhir!.status}`,
        user: "System Admin"
      }));
  }, [jadwals]);

  const displayLogs = activityLogs.length > 0 ? activityLogs : [
    { time: "Live Monitoring", action: "Belum ada aktivitas perubahan status operasional penerbangan hari ini.", user: "Sistem Otomatis" }
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Title Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dasbor Operasional</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, <span className="font-bold text-slate-800">{session?.user?.name || "Admin"}</span>. Kelola dan pantau seluruh data penerbangan Horizon Air.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
          <div className={cn("h-2 w-2 rounded-full bg-emerald-500", hasError ? "bg-red-500" : "animate-pulse")} />
          <span>{hasError ? "Sistem Gangguan" : "Sistem Live"}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md shadow-slate-100 hover:shadow-xl transition-all duration-300 rounded-[1.8rem] bg-white group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl border ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-6 w-6 ${stat.color} ${stat.iconClass || ""}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                {stat.desc} <ArrowUpRight className="h-3 w-3 text-slate-300" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Recent Operations Log */}
        <Card className="border-none shadow-md shadow-slate-100 rounded-3xl lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> Log Aktivitas Operasional
            </CardTitle>
            <CardDescription>Aktivitas kru dan pembaruan data maskapai terkini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-4">
                {displayLogs.map((act, i) => (
                  <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{act.action}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{act.time} • oleh {act.user}</p>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Server & Database Info */}
        <Card className="border-none shadow-md shadow-slate-100 rounded-3xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-purple-500" /> Status Server
            </CardTitle>
            <CardDescription>Kesehatan database & service API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Database (Supabase)</span>
                  <span className={cn(
                    "text-xs font-black uppercase flex items-center gap-1.5",
                    hasError ? "text-red-600" : "text-emerald-600"
                  )}>
                    <span className={cn("h-2 w-2 rounded-full", hasError ? "bg-red-600" : "bg-emerald-600 animate-pulse")} />
                    {hasError ? "GANGGUAN" : "TERHUBUNG"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Service API (Railway)</span>
                  <span className={cn(
                    "text-xs font-black uppercase flex items-center gap-1.5",
                    hasError ? "text-red-600" : "text-emerald-600"
                  )}>
                    <span className={cn("h-2 w-2 rounded-full", hasError ? "bg-red-600" : "bg-emerald-600 animate-pulse")} />
                    {hasError ? "OFFLINE" : "AKTIF"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Keamanan SSL</span>
                  <span className="text-xs font-black uppercase text-emerald-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    TERLINDUNGI
                  </span>
                </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
