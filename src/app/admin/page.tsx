import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, Palmtree, CalendarDays, Ticket, ShieldAlert, ArrowUpRight, Activity, Users } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const stats = [
    { title: "Total Bandara", value: "12", desc: "Bandara terdaftar", icon: Palmtree, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "Total Maskapai", value: "8", desc: "Maskapai penerbangan", icon: Plane, iconClass: "rotate-45", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "Jadwal Aktif", value: "45", desc: "Keberangkatan & delay", icon: CalendarDays, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { title: "Kode Promo", value: "5", desc: "Voucher diskon", icon: Ticket, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
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
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Live</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md shadow-slate-100 hover:shadow-xl transition-all duration-300 rounded-[1.8rem] bg-white group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.title}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{stat.value}</p>
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
                {[
                  { time: "10 menit yang lalu", action: "Perubahan status penerbangan HX-0101 menjadi Delay (20m)", user: "Sistem Otomatis" },
                  { time: "1 jam yang lalu", action: "Menambahkan jadwal penerbangan baru rute SUB -> CGK", user: "Admin Horizon" },
                  { time: "3 jam yang lalu", action: "Memperbarui data maskapai Garuda Indonesia", user: "Admin Horizon" },
                ].map((act, i) => (
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
                  <span className="text-xs font-black uppercase text-emerald-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Terhubung</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Service API (Railway)</span>
                  <span className="text-xs font-black uppercase text-emerald-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Aktif</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-600">Keamanan SSL</span>
                  <span className="text-xs font-black uppercase text-emerald-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Terlindungi</span>
                </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
