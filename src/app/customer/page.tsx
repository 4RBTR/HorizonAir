"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlaneTakeoff, PlaneLanding, Calendar, Users, Search, Ticket, MapPin, Compass, Landmark, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [searchData, setSearchData] = useState({
    asal: "",
    tujuan: "",
    tanggal: "",
    penumpang: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData as any);
    router.push(`/customer/list-penerbangan?${params.toString()}`);
  };

  const destinations = [
    { title: "Bali (Ngurah Rai)", code: "DPS", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop", price: "850.000", tag: "Pantai & Budaya" },
    { title: "Jakarta (Soekarno-Hatta)", code: "CGK", image: "https://images.unsplash.com/photo-1555660291-e738575b2639?q=80&w=600&auto=format&fit=crop", price: "620.000", tag: "Metropolitan" },
    { title: "Singapore (Changi)", code: "SIN", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=600&auto=format&fit=crop", price: "1.200.000", tag: "Internasional" },
    { title: "Labuan Bajo (Komodo)", code: "LBJ", image: "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?q=80&w=600&auto=format&fit=crop", price: "1.500.000", tag: "Keajaiban Alam" },
  ];

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
                <div className="relative">
                  <Input 
                    placeholder="Bandara Asal (contoh: SUB)" 
                    className="h-14 px-4 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl transition-all font-bold text-slate-800"
                    value={searchData.asal}
                    onChange={(e) => setSearchData({...searchData, asal: e.target.value})}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Ketik nama kota atau kode IATA</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <PlaneLanding className="h-4 w-4 text-blue-600" /> Tujuan Destinasi
                </Label>
                <div className="relative">
                  <Input 
                    placeholder="Bandara Tujuan (contoh: CGK)" 
                    className="h-14 px-4 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl transition-all font-bold text-slate-800"
                    value={searchData.tujuan}
                    onChange={(e) => setSearchData({...searchData, tujuan: e.target.value})}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Tujuan penerbangan Anda</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" /> Tanggal Pergi
                </Label>
                <Input 
                  type="date" 
                  className="h-14 px-4 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl transition-all font-bold text-slate-800"
                  value={searchData.tanggal}
                  onChange={(e) => setSearchData({...searchData, tanggal: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                  <Users className="h-4 w-4 text-blue-600" /> Jumlah Penumpang
                </Label>
                <Input 
                  type="number" 
                  min={1} 
                  max={10}
                  className="h-14 px-4 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-blue-600 rounded-2xl transition-all font-bold text-slate-800"
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Compass className="h-5 w-5 text-blue-600" /> Destinasi Terpopuler
            </h2>
            <p className="text-slate-500 text-sm font-medium">Jelajahi keindahan Indonesia dengan penawaran tiket penerbangan eksklusif.</p>
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

      {/* Promos Banner Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 flex flex-col justify-between border border-blue-100/50 hover-lift">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
               <Ticket className="h-6 w-6" />
             </div>
             <h3 className="text-2xl font-black text-slate-900">Promo Member Horizon</h3>
             <p className="text-slate-600 leading-relaxed font-medium">Gunakan kode kupon <span className="font-black text-blue-600">HORIZON2026</span> dan hemat potongan hingga 20% untuk pemesanan rute perdana Anda.</p>
          </div>
          <div className="pt-6">
             <Button variant="outline" className="border-blue-200 hover:bg-blue-600 hover:text-white rounded-xl font-bold gap-2">
               Salin Kode Promo
             </Button>
          </div>
        </div>

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
      </div>
    </div>
  );
}
