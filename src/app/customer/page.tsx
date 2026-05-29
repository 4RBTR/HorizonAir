"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getJadwal } from "@/services/jadwal";
import { getPromo } from "@/services/promo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Ticket, MapPin, Compass, Landmark } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [searchData, setSearchData] = useState({
    asal: "",
    tujuan: "",
    tanggal: "",
    penumpang: 1,
  });

  const { data: jadwals } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });
  const { data: promos } = useQuery({ queryKey: ["promo"], queryFn: getPromo });

  // Dynamically extract unique departure airports that have flight schedules
  const uniqueAsal = useMemo(() => {
    if (!jadwals) return [];
    const map = new Map();
    jadwals.forEach(j => {
      if (j.bandaraKeberangkatan) {
        map.set(j.bandaraKeberangkatan.kodeIATA, j.bandaraKeberangkatan);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.kota.localeCompare(b.kota));
  }, [jadwals]);

  // Dynamically extract unique destination airports that have flight schedules
  const uniqueTujuan = useMemo(() => {
    if (!jadwals) return [];
    const map = new Map();
    jadwals.forEach(j => {
      if (j.bandaraTujuan) {
        map.set(j.bandaraTujuan.kodeIATA, j.bandaraTujuan);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.kota.localeCompare(b.kota));
  }, [jadwals]);

  // Dynamically populate popular destinations from backend schedules
  const destinations = useMemo(() => {
    if (!jadwals) return [];
    const map = new Map();
    jadwals.forEach(j => {
      if (j.bandaraTujuan) {
        map.set(j.bandaraTujuan.kodeIATA, j.bandaraTujuan);
      }
    });
    const uniqueDests = Array.from(map.values());
    
    const destMetadata: Record<string, { image: string; tag: string }> = {
      CGK: { tag: "Metropolitan", image: "https://images.unsplash.com/photo-1555660291-e738575b2639?q=80&w=600&auto=format&fit=crop" },
      HLP: { tag: "Urban Hub", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop" },
      SUB: { tag: "Kota Pahlawan", image: "https://images.unsplash.com/photo-1582998637219-c0ef18eb6c78?q=80&w=600&auto=format&fit=crop" },
      PNK: { tag: "Equator City", image: "https://images.unsplash.com/photo-1541018939-2a9128038f4d?q=80&w=600&auto=format&fit=crop" },
      DPS: { tag: "Pantai & Budaya", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop" },
    };

    return uniqueDests.map(b => {
      const meta = destMetadata[b.kodeIATA] || {
        tag: b.negara,
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=600&auto=format&fit=crop"
      };

      const destinationFlights = jadwals.filter(j => j.bandaraTujuanId === b.id);
      const minPrice = destinationFlights.length > 0 
        ? Math.min(...destinationFlights.map(j => j.hargaPerTiket)) 
        : 500000;

      return {
        title: `${b.kota} (${b.nama})`,
        code: b.kodeIATA,
        image: meta.image,
        price: minPrice.toLocaleString(),
        tag: meta.tag
      };
    }).slice(0, 4);
  }, [jadwals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.asal || !searchData.tujuan) {
      toast.error("Silakan pilih bandara keberangkatan dan tujuan.");
      return;
    }
    if (searchData.asal === searchData.tujuan) {
      toast.error("Bandara keberangkatan dan tujuan tidak boleh sama.");
      return;
    }
    const params = new URLSearchParams(searchData as any);
    router.push(`/customer/list-penerbangan?${params.toString()}`);
  };

  const activePromos = promos || [];

  return (
    <div className="space-y-12 py-4">
      {/* Welcome Hero Card */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 text-white p-8 md:p-12 premium-shadow">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-950 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            Welcome back
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Halo, <span className="text-gradient from-blue-400 to-indigo-400">{session?.user?.name || "Horizon Traveler"}</span>!
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
            Ke mana petualangan Anda berikutnya akan membawa Anda? Cari rute terbaik sekarang.
          </p>
        </div>
      </div>

      {/* Flight Search Form */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-md">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-full" />
        <CardContent className="p-8 md:p-10">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <PlaneTakeoff className="h-4 w-4 text-blue-600" /> Berangkat Dari
                </Label>
                <Select
                  value={searchData.asal}
                  onValueChange={(v) => setSearchData({...searchData, asal: v || ""})}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600 font-bold text-slate-800 border">
                    <SelectValue placeholder="Pilih Bandara Asal" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueAsal.map(b => (
                      <SelectItem key={b.id} value={b.kodeIATA}>{b.kodeIATA} - {b.kota} ({b.nama})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 font-medium">Bandara asal keberangkatan</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <PlaneLanding className="h-4 w-4 text-blue-600" /> Tujuan Destinasi
                </Label>
                <Select
                  value={searchData.tujuan}
                  onValueChange={(v) => setSearchData({...searchData, tujuan: v || ""})}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600 font-bold text-slate-800 border">
                    <SelectValue placeholder="Pilih Bandara Tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTujuan.map(b => (
                      <SelectItem key={b.id} value={b.kodeIATA}>{b.kodeIATA} - {b.kota} ({b.nama})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-400 font-medium">Tujuan destinasi penerbangan</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" /> Tanggal Pergi
                </Label>
                <input 
                  type="date" 
                  className="w-full flex h-14 items-center justify-between border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600 font-bold text-slate-800 border px-3 py-2 text-sm rounded-2xl"
                  value={searchData.tanggal}
                  onChange={(e) => setSearchData({...searchData, tanggal: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Users className="h-4 w-4 text-blue-600" /> Jumlah Penumpang
                </Label>
                <input 
                  type="number" 
                  min={1} 
                  max={10}
                  className="w-full flex h-14 items-center justify-between border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600 font-bold text-slate-800 border px-3 py-2 text-sm rounded-2xl"
                  value={searchData.penumpang}
                  onChange={(e) => setSearchData({...searchData, penumpang: parseInt(e.target.value) || 1})}
                  required
                />
              </div>

            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <Button type="submit" size="lg" className="bg-slate-950 hover:bg-slate-800 text-white h-14 px-12 rounded-2xl font-bold text-base shadow-2xl transition-all hover:scale-105 active:scale-95">
                <Search className="mr-2 h-5 w-5" /> Cari Penerbangan Terbaik
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Popular Destinations Grid */}
      {destinations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-600" /> Destinasi Terpopuler
              </h2>
              <p className="text-slate-500 text-sm font-medium">Jelajahi rute aktif kami langsung dengan penawaran tiket penerbangan eksklusif.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div 
                key={i} 
                className="group relative rounded-[2rem] overflow-hidden aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  setSearchData({ ...searchData, tujuan: dest.code });
                  toast.info(`Bandara tujuan diatur ke ${dest.code}`);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
                <img 
                  src={dest.image} 
                  alt={dest.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  {dest.tag}
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2 text-white">
                  <p className="text-xs font-bold text-blue-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {dest.code}
                  </p>
                  <h4 className="text-lg font-black leading-tight tracking-tight">{dest.title}</h4>
                  <div className="h-[1px] w-12 bg-white/45 group-hover:w-full transition-all duration-500" />
                  <p className="text-xs text-slate-300">Mulai dari <span className="text-sm font-bold text-emerald-400">IDR {dest.price}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promos Banner Section */}
      {activePromos.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {activePromos.slice(0, 2).map((promo, idx) => (
            <div key={promo.id} className={cn(
              "relative rounded-[2.5rem] p-8 flex flex-col justify-between border hover-lift",
              idx === 0 
                ? "bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-100/50" 
                : "bg-gradient-to-br from-purple-50 to-pink-50/50 border-purple-100/50"
            )}>
              <div className="space-y-4">
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center",
                   idx === 0 ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                 )}>
                   {idx === 0 ? <Ticket className="h-6 w-6" /> : <Landmark className="h-6 w-6" />}
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">{promo.deskripsi || "Kupon Diskon Horizon"}</h3>
                 <p className="text-slate-600 leading-relaxed font-medium">
                   Gunakan kode kupon <span className={cn("font-black", idx === 0 ? "text-blue-600" : "text-purple-600")}>{promo.kode}</span> dan hemat potongan hingga {promo.persentaseDiskon}% (Maks IDR {promo.maksimumDiskon.toLocaleString()}) berlaku sampai {promo.berlakuSampai}.
                 </p>
              </div>
              <div className="pt-6">
                 <Button 
                   variant="outline" 
                   className={cn(
                     "border-slate-200 rounded-xl font-bold gap-2",
                     idx === 0 ? "hover:bg-blue-600 hover:text-white" : "hover:bg-purple-600 hover:text-white"
                   )}
                   onClick={() => {
                     navigator.clipboard.writeText(promo.kode);
                     toast.success(`Kode promo ${promo.kode} berhasil disalin!`);
                   }}
                 >
                   Salin Kode Promo
                 </Button>
              </div>
            </div>
          ))}
          {activePromos.length < 2 && (
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-purple-50 to-pink-50/50 p-8 flex flex-col justify-between border border-purple-100/50 hover-lift">
              <div className="space-y-4">
                 <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                   <Landmark className="h-6 w-6" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">Elite Lounge Akses</h3>
                 <p className="text-slate-600 leading-relaxed font-medium">Bergabunglah sebagai member Elite Gold untuk menikmati fasilitas VIP Lounge gratis di bandara Soekarno-Hatta & Juanda.</p>
              </div>
              <div className="pt-6">
                 <Button variant="outline" className="border-purple-200 hover:bg-purple-600 hover:text-white rounded-xl font-bold gap-2">
                   Pelajari Keuntungan
                 </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
