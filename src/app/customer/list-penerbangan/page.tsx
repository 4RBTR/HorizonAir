"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJadwal } from "@/services/jadwal";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, ArrowLeft, Plane, Clock, Filter, SortAsc, Briefcase, Utensils, Wifi, Check, Heart, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { addMinutes, format } from "date-fns";

export default function ListPenerbanganPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortAsc] = useState<string>("harga");

  const asal = searchParams.get("asal");
  const tujuan = searchParams.get("tujuan");
  const tanggal = searchParams.get("tanggal");
  const penumpang = searchParams.get("penumpang") || "1";

  const { data: jadwals, isLoading } = useQuery({
    queryKey: ["jadwal", "search", asal, tujuan, tanggal],
    queryFn: getJadwal,
  });

  const filteredJadwals = jadwals?.filter(j => {
    const matchAsal = asal ? (j.bandaraKeberangkatan?.nama.toLowerCase().includes(asal.toLowerCase()) || j.bandaraKeberangkatan?.kodeIATA.toLowerCase().includes(asal.toLowerCase())) : true;
    const matchTujuan = tujuan ? (j.bandaraTujuan?.nama.toLowerCase().includes(tujuan.toLowerCase()) || j.bandaraTujuan?.kodeIATA.toLowerCase().includes(tujuan.toLowerCase())) : true;
    const matchTanggal = tanggal ? j.tanggalKeberangkatan === tanggal : true;
    return matchAsal && matchTujuan && matchTanggal;
  }) || [];

  const sortedJadwals = [...filteredJadwals].sort((a, b) => {
    if (sortBy === "harga") return a.hargaPerTiket - b.hargaPerTiket;
    if (sortBy === "durasi") return a.durasiPenerbanganMenit - b.durasiPenerbanganMenit;
    return 0;
  });

  const getArrivalTime = (start: string, duration: number) => {
    try {
      const [h, m] = start.split(":").map(Number);
      const date = addMinutes(new Date(2000, 0, 1, h, m), duration);
      return format(date, "HH:mm");
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10 rounded-full h-12 w-12">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-black flex items-center gap-2 tracking-tight">
              {asal || "Semua"} <ArrowRight className="h-4 w-4 text-blue-400" /> {tujuan || "Semua"}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
              {tanggal ? format(new Date(tanggal), "dd MMM yyyy") : "Kapan Saja"} • {penumpang} Penumpang • Kelas Ekonomi
            </p>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-3">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/25 rounded-xl font-bold gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/25 rounded-xl font-bold gap-2" 
            onClick={() => setSortAsc(sortBy === "harga" ? "durasi" : "harga")}
          >
            <SortAsc className="h-4 w-4" /> Urutkan: {sortBy === "harga" ? "Termurah" : "Durasi"}
          </Button>
        </div>
      </div>

      {/* Flight Cards Listing */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-slate-500 font-bold text-sm">Mencari penerbangan terbaik untuk Anda...</p>
        </div>
      ) : sortedJadwals.length === 0 ? (
        <Card className="border-dashed border-2 py-24 text-center space-y-6 rounded-[2.5rem] bg-white">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Plane className="h-10 w-10 text-slate-300 -rotate-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">Rute Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">Maaf, saat ini tidak ada armada kami yang melayani rute ini untuk tanggal tersebut.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold" onClick={() => router.back()}>Ubah Pencarian</Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedJadwals.map((j) => (
            <Card key={j.id} className="group hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6 md:p-8">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Airline & Ticket Class */}
                  <div className="lg:col-span-3 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors duration-500">
                      <Plane className="h-7 w-7 text-blue-600 group-hover:text-white rotate-45 transition-colors duration-500" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{j.maskapai?.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">{j.kodePenerbangan}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Ekonomi</span>
                      </div>
                    </div>
                  </div>

                  {/* Flight Schedule Timeline Route */}
                  <div className="lg:col-span-5 grid grid-cols-7 items-center gap-2">
                    <div className="col-span-2 text-right">
                      <p className="text-2xl font-black text-slate-900 leading-none">{j.waktuKeberangkatan}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1.5">{j.bandaraKeberangkatan?.kodeIATA}</p>
                    </div>

                    <div className="col-span-3 flex flex-col items-center gap-1.5">
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight">
                        {Math.floor(j.durasiPenerbanganMenit / 60)}j {j.durasiPenerbanganMenit % 60}m
                      </p>
                      <div className="w-full h-[2px] bg-slate-100 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 group-hover:scale-125 transition-transform duration-500">
                          <Plane className="h-4.5 w-4.5 text-blue-500 rotate-45" />
                        </div>
                      </div>
                      <p className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Langsung</p>
                    </div>

                    <div className="col-span-2 text-left">
                      <p className="text-2xl font-black text-slate-900 leading-none">{getArrivalTime(j.waktuKeberangkatan, j.durasiPenerbanganMenit)}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1.5">{j.bandaraTujuan?.kodeIATA}</p>
                    </div>
                  </div>

                  {/* Features Indicators */}
                  <div className="lg:col-span-2 flex justify-center lg:justify-start gap-4 text-slate-400">
                    <div className="flex flex-col items-center gap-1 cursor-default group/icon" title="Basi Gratis 20kg">
                      <Briefcase className="h-5 w-5 hover:text-blue-500 transition-colors" />
                      <span className="text-[9px] font-bold">20kg</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-default" title="Makanan Termasuk">
                      <Utensils className="h-5 w-5 hover:text-blue-500 transition-colors" />
                      <span className="text-[9px] font-bold">Snack</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-default" title="Koneksi WiFi Kabin">
                      <Wifi className="h-5 w-5 hover:text-blue-500 transition-colors" />
                      <span className="text-[9px] font-bold">WiFi</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-default" title="Proteksi Refund">
                      <Shield className="h-5 w-5 text-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-600">Refund</span>
                    </div>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="lg:col-span-2 flex flex-col items-end gap-3 min-w-[150px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
                    <div>
                      <p className="text-[10px] text-right font-black uppercase tracking-wider text-slate-400">Harga per orang</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tight mt-0.5">IDR {j.hargaPerTiket.toLocaleString()}</p>
                    </div>
                    <Link 
                      href={`/customer/beli-tiket?jadwalId=${j.id}&penumpang=${penumpang}`} 
                      className={cn(buttonVariants(), "w-full bg-slate-950 hover:bg-slate-800 text-white font-bold h-11 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95")}
                    >
                      Pilih Penerbangan
                    </Link>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
