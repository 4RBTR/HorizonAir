"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getJadwal } from "@/services/jadwal";
import { getPromo } from "@/services/promo";
import { getBandara } from "@/services/bandara";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  Calendar, 
  Users, 
  Search, 
  Ticket, 
  MapPin, 
  Compass, 
  Landmark,
  Plane,
  Clock,
  ArrowRight,
  Shield,
  Wifi,
  Utensils,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addMinutes, format } from "date-fns";
import Link from "next/link";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [searchData, setSearchData] = useState({
    asal: "",
    tujuan: "",
    tanggal: "",
    penumpang: 1,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: jadwals, isLoading: isJadwalLoading } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });
  const { data: promos } = useQuery({ queryKey: ["promo"], queryFn: getPromo });
  const { data: bandaras } = useQuery({ queryKey: ["bandara"], queryFn: getBandara });

  const [asalSearch, setAsalSearch] = useState("");
  const [tujuanSearch, setTujuanSearch] = useState("");
  const [showAsalDropdown, setShowAsalDropdown] = useState(false);
  const [showTujuanDropdown, setShowTujuanDropdown] = useState(false);

  // Synchronize text inputs when searchData codes are set from other triggers (e.g. popular destinations)
  useEffect(() => {
    if (bandaras) {
      if (searchData.asal) {
        const found = bandaras.find(b => b.kodeIATA === searchData.asal);
        if (found) {
          setAsalSearch(`${found.kodeIATA} - ${found.kota} (${found.nama})`);
        }
      } else {
        setAsalSearch("");
      }
      if (searchData.tujuan) {
        const found = bandaras.find(b => b.kodeIATA === searchData.tujuan);
        if (found) {
          setTujuanSearch(`${found.kodeIATA} - ${found.kota} (${found.nama})`);
        }
      } else {
        setTujuanSearch("");
      }
    }
  }, [bandaras, searchData.asal, searchData.tujuan]);

  // Autocomplete filtering logic
  const filteredAsalAirports = useMemo(() => {
    if (!bandaras) return [];
    const term = asalSearch.split(" - ")[0];
    const cleanSearch = (searchData.asal && term === searchData.asal) ? "" : asalSearch;

    if (!cleanSearch) return bandaras;
    return bandaras.filter(b => 
      b.kodeIATA.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.kota.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.nama.toLowerCase().includes(cleanSearch.toLowerCase())
    );
  }, [bandaras, asalSearch, searchData.asal]);

  const filteredTujuanAirports = useMemo(() => {
    if (!bandaras) return [];
    const term = tujuanSearch.split(" - ")[0];
    const cleanSearch = (searchData.tujuan && term === searchData.tujuan) ? "" : tujuanSearch;

    if (!cleanSearch) return bandaras;
    return bandaras.filter(b => 
      b.kodeIATA.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.kota.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.nama.toLowerCase().includes(cleanSearch.toLowerCase())
    );
  }, [bandaras, tujuanSearch, searchData.tujuan]);

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
      CGK: { tag: "Metropolitan", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop" },
      HLP: { tag: "Urban Hub", image: "https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=600&auto=format&fit=crop" },
      SUB: { tag: "Kota Pahlawan", image: "https://images.unsplash.com/photo-1490430657723-4d607c1503fc?q=80&w=600&auto=format&fit=crop" },
      PNK: { tag: "Equator City", image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600&auto=format&fit=crop" },
      DPS: { tag: "Pantai & Budaya", image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=600&auto=format&fit=crop" },
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

  // Paginated flights list for dashboard view
  const activeFlights = useMemo(() => {
    if (!jadwals) return [];
    return [...jadwals].sort((a, b) => {
      const dateA = new Date(`${a.tanggalKeberangkatan}T${a.waktuKeberangkatan}`).getTime();
      const dateB = new Date(`${b.tanggalKeberangkatan}T${b.waktuKeberangkatan}`).getTime();
      return dateA - dateB;
    });
  }, [jadwals]);

  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return activeFlights.slice(start, start + itemsPerPage);
  }, [activeFlights, currentPage]);

  const totalPages = Math.ceil(activeFlights.length / itemsPerPage);

  const getArrivalTime = (start: string, duration: number) => {
    try {
      const [h, m] = start.split(":").map(Number);
      const date = addMinutes(new Date(2000, 0, 1, h, m), duration);
      return format(date, "HH:mm");
    } catch (e) {
      return "--:--";
    }
  };

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
              
              <div className="space-y-2 relative">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <PlaneTakeoff className="h-4 w-4 text-blue-600" /> Berangkat Dari
                </Label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik bandara asal..."
                    value={asalSearch}
                    onChange={(e) => {
                      setAsalSearch(e.target.value);
                      if (searchData.asal) {
                        setSearchData({ ...searchData, asal: "" });
                      }
                    }}
                    onFocus={() => setShowAsalDropdown(true)}
                    className="w-full h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800 border px-4"
                  />
                  {searchData.asal && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                      {searchData.asal}
                    </span>
                  )}
                </div>

                {showAsalDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAsalDropdown(false)} />
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 scrollbar-thin">
                      {filteredAsalAirports.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4 font-bold">Bandara tidak ditemukan</p>
                      ) : (
                        filteredAsalAirports.map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setSearchData({ ...searchData, asal: b.kodeIATA });
                              setAsalSearch(`${b.kodeIATA} - ${b.kota} (${b.nama})`);
                              setShowAsalDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between",
                              searchData.asal === b.kodeIATA 
                                ? "bg-blue-600 text-white" 
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                          >
                            <span>{b.kodeIATA} - {b.kota} ({b.nama})</span>
                            <span className={cn(
                              "text-[10px] uppercase px-1.5 py-0.5 rounded font-black",
                              searchData.asal === b.kodeIATA ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              {b.negara}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
                <p className="text-[10px] text-slate-400 font-medium">Ketik kota, nama bandara, atau kode IATA</p>
              </div>

              <div className="space-y-2 relative">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <PlaneLanding className="h-4 w-4 text-blue-600" /> Tujuan Destinasi
                </Label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik bandara tujuan..."
                    value={tujuanSearch}
                    onChange={(e) => {
                      setTujuanSearch(e.target.value);
                      if (searchData.tujuan) {
                        setSearchData({ ...searchData, tujuan: "" });
                      }
                    }}
                    onFocus={() => setShowTujuanDropdown(true)}
                    className="w-full h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800 border px-4"
                  />
                  {searchData.tujuan && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                      {searchData.tujuan}
                    </span>
                  )}
                </div>

                {showTujuanDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowTujuanDropdown(false)} />
                    <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 scrollbar-thin">
                      {filteredTujuanAirports.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4 font-bold">Bandara tidak ditemukan</p>
                      ) : (
                        filteredTujuanAirports.map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setSearchData({ ...searchData, tujuan: b.kodeIATA });
                              setTujuanSearch(`${b.kodeIATA} - ${b.kota} (${b.nama})`);
                              setShowTujuanDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between",
                              searchData.tujuan === b.kodeIATA 
                                ? "bg-blue-600 text-white" 
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                          >
                            <span>{b.kodeIATA} - {b.kota} ({b.nama})</span>
                            <span className={cn(
                              "text-[10px] uppercase px-1.5 py-0.5 rounded font-black",
                              searchData.tujuan === b.kodeIATA ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              {b.negara}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
                <p className="text-[10px] text-slate-400 font-medium">Ketik kota, nama bandara, atau kode IATA</p>
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

      {/* Flight Schedule List (Daftar Penerbangan Aktif) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" /> Jadwal Penerbangan Horizon
            </h2>
            <p className="text-slate-500 text-sm font-medium">Lihat dan pilih langsung seluruh jadwal penerbangan aktif kami dari database.</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold">{activeFlights.length} Penerbangan</span>
        </div>

        {isJadwalLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
             <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
             <p className="text-slate-500 text-sm font-bold">Memuat seluruh jadwal penerbangan...</p>
          </div>
        ) : paginatedFlights.length === 0 ? (
          <Card className="border-dashed border-2 py-16 text-center text-slate-500 font-medium rounded-3xl">
             Belum ada jadwal penerbangan terdaftar.
          </Card>
        ) : (
          <div className="grid gap-6">
            {paginatedFlights.map((j) => (
              <Card key={j.id} className="group hover:shadow-xl transition-all duration-300 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6 md:p-8">
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Airline Info */}
                    <div className="lg:col-span-3 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors duration-500 shrink-0">
                        <Plane className="h-6 w-6 text-blue-600 group-hover:text-white rotate-45 transition-colors duration-500" />
                      </div>
                      <div>
                        <p className="font-bold text-base text-slate-900 leading-snug">{j.maskapai?.nama}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{j.kodePenerbangan}</span>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                            j.statusTerakhir?.status === "Delay" ? "bg-amber-100 text-amber-700" :
                            j.statusTerakhir?.status === "Dibatalkan" ? "bg-red-100 text-red-700" :
                            j.statusTerakhir?.status === "Berangkat" ? "bg-indigo-100 text-indigo-700" :
                            j.statusTerakhir?.status === "Mendarat" ? "bg-emerald-100 text-emerald-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {j.statusTerakhir?.status || "Sesuai Jadwal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Timeline */}
                    <div className="lg:col-span-4 grid grid-cols-7 items-center gap-2">
                      <div className="col-span-2 text-right">
                        <p className="text-xl font-black text-slate-900 leading-none">{j.waktuKeberangkatan}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{j.bandaraKeberangkatan?.kodeIATA} - {j.bandaraKeberangkatan?.kota}</p>
                      </div>

                      <div className="col-span-3 flex flex-col items-center gap-1">
                        <p className="text-[9px] text-slate-400 font-bold tracking-tight">
                          {Math.floor(j.durasiPenerbanganMenit / 60)}j {j.durasiPenerbanganMenit % 60}m
                        </p>
                        <div className="w-full h-[1.5px] bg-slate-100 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 group-hover:scale-110 transition-transform">
                            <Plane className="h-3.5 w-3.5 text-blue-500 rotate-45" />
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold">{j.tanggalKeberangkatan}</p>
                      </div>

                      <div className="col-span-2 text-left">
                        <p className="text-xl font-black text-slate-900 leading-none">{getArrivalTime(j.waktuKeberangkatan, j.durasiPenerbanganMenit)}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{j.bandaraTujuan?.kodeIATA} - {j.bandaraTujuan?.kota}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="lg:col-span-2 flex justify-center lg:justify-start gap-3 text-slate-400">
                      <div className="flex flex-col items-center gap-0.5" title="Bagasi 20kg"><Briefcase className="h-4 w-4" /><span className="text-[8px] font-bold">20kg</span></div>
                      <div className="flex flex-col items-center gap-0.5" title="Snack Kabin"><Utensils className="h-4 w-4" /><span className="text-[8px] font-bold">Snack</span></div>
                      <div className="flex flex-col items-center gap-0.5" title="WiFi Gratis"><Wifi className="h-4 w-4" /><span className="text-[8px] font-bold">WiFi</span></div>
                    </div>

                    {/* Price and CTA */}
                    <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                      <div className="text-left lg:text-right">
                        <p className="text-[9px] font-black uppercase text-slate-400">Mulai Dari</p>
                        <p className="text-lg font-black text-emerald-600 mt-0.5">IDR {j.hargaPerTiket.toLocaleString()}</p>
                      </div>
                      <Link 
                        href={`/customer/beli-tiket?jadwalId=${j.id}&penumpang=1`} 
                        className={cn(buttonVariants({ size: "sm" }), "bg-slate-950 hover:bg-slate-800 text-white font-bold h-10 rounded-xl px-4 shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0")}
                      >
                        Pilih
                      </Link>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-4">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="h-10 w-10 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-bold text-slate-600">Halaman {currentPage} dari {totalPages}</span>
            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-10 w-10 rounded-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

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
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=600&auto=format&fit=crop";
                  }}
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
