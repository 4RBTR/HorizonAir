"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getBandara, Bandara } from "@/services/bandara";
import { MOCK_BANDARA } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Plane, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Star, 
  Globe, 
  Zap, 
  Calendar, 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Heart,
  MessageSquare,
  Compass,
  PlaneTakeoff,
  PlaneLanding
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Search widget state
  const [searchData, setSearchData] = useState({
    asal: "",
    tujuan: "",
    tanggal: "",
    penumpang: 1,
  });

  const [asalSearch, setAsalSearch] = useState("");
  const [tujuanSearch, setTujuanSearch] = useState("");
  const [showAsalDropdown, setShowAsalDropdown] = useState(false);
  const [showTujuanDropdown, setShowTujuanDropdown] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fetch airports
  const { data: apiBandaras, isError } = useQuery({
    queryKey: ["bandara"],
    queryFn: getBandara,
    retry: 1,
  });

  const bandaras = useMemo(() => {
    return apiBandaras || MOCK_BANDARA;
  }, [apiBandaras]);

  // Autocomplete filtering
  const filteredAsalAirports = useMemo(() => {
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
    const term = tujuanSearch.split(" - ")[0];
    const cleanSearch = (searchData.tujuan && term === searchData.tujuan) ? "" : tujuanSearch;

    if (!cleanSearch) return bandaras;
    return bandaras.filter(b => 
      b.kodeIATA.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.kota.toLowerCase().includes(cleanSearch.toLowerCase()) ||
      b.nama.toLowerCase().includes(cleanSearch.toLowerCase())
    );
  }, [bandaras, tujuanSearch, searchData.tujuan]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchData.asal || !searchData.tujuan) {
      toast.error("Silakan pilih bandara asal dan bandara tujuan.");
      return;
    }
    if (searchData.asal === searchData.tujuan) {
      toast.error("Bandara asal dan tujuan tidak boleh sama.");
      return;
    }
    if (!searchData.tanggal) {
      toast.error("Silakan pilih tanggal keberangkatan.");
      return;
    }

    const params = new URLSearchParams({
      asal: searchData.asal,
      tujuan: searchData.tujuan,
      tanggal: searchData.tanggal,
      penumpang: String(searchData.penumpang),
    });

    if (session) {
      // User is logged in, go straight to search results page
      router.push(`/customer/list-penerbangan?${params.toString()}`);
    } else {
      // User is not logged in, go to login first and forward params
      toast.info("Silakan login terlebih dahulu untuk melanjutkan pencarian Anda.");
      router.push(`/login?${params.toString()}`);
    }
  };

  // Popular destinations metadata
  const popularDestinations = [
    {
      city: "Denpasar",
      airportName: "Ngurah Rai International",
      code: "DPS",
      tag: "PANTAI & BUDAYA",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800&auto=format&fit=crop",
      price: "850.000",
    },
    {
      city: "Jakarta",
      airportName: "Soekarno-Hatta",
      code: "CGK",
      tag: "METROPOLITAN HUB",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
      price: "620.000",
    },
    {
      city: "Surabaya",
      airportName: "Juanda International",
      code: "SUB",
      tag: "KOTA PAHLAWAN",
      image: "https://images.unsplash.com/photo-1490430657723-4d607c1503fc?q=80&w=800&auto=format&fit=crop",
      price: "580.000",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Rian Aditya",
      role: "Business Traveler",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      comment: "Layanan Horizon Air benar-benar memuaskan. Kabin premium kelas dunia dengan harga yang bersahabat. Fitur check-in online sangat cepat dan ringkas!",
    },
    {
      name: "Clara Sativa",
      role: "Travel Vlogger",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      comment: "Desain interior pesawatnya modern dan bersih. Pramugarinya ramah sekali, makanan kabinnya juga lezat. Sangat direkomendasikan untuk liburan keluarga.",
    },
    {
      name: "Budi Prakoso",
      role: "Corporate Executive",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      comment: "Sering bepergian untuk urusan dinas, Horizon Air selalu menjadi pilihan pertama saya karena ketepatan waktunya yang luar biasa. Sangat dapat diandalkan.",
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "Bagaimana cara melakukan pemesanan tiket di Horizon Air?",
      answer: "Anda dapat mencari rute penerbangan yang diinginkan melalui form pencarian di atas, memilih penerbangan yang tersedia, mengisi data penumpang, dan menyelesaikan pembayaran secara aman.",
    },
    {
      question: "Apakah saya bisa mengubah jadwal penerbangan (Reschedule)?",
      answer: "Ya, Horizon Air menyediakan fitur reschedule melalui menu 'Tiket Saya' di dasbor pelanggan Anda. Pastikan untuk mengajukannya paling lambat 24 jam sebelum keberangkatan sesuai ketentuan yang berlaku.",
    },
    {
      question: "Berapa kapasitas bagasi gratis yang didapatkan penumpang?",
      answer: "Setiap tiket kelas Ekonomi Horizon Air sudah termasuk bagasi kabin hingga 7kg dan bagasi terdaftar cuma-cuma hingga 20kg untuk rute domestik.",
    },
    {
      question: "Metode pembayaran apa saja yang didukung?",
      answer: "Kami mendukung berbagai opsi pembayaran aman, termasuk Transfer Bank (Virtual Account), Kartu Kredit, serta berbagai e-Wallet populer untuk memudahkan transaksi Anda.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* Background Soft Glow Bubbles */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-[450px] h-[450px] bg-indigo-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-96 left-10 w-80 h-80 bg-sky-300/10 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10">
        
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/60 text-blue-700 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-1000">
                <Sparkles className="h-4.5 w-4.5 text-blue-500 fill-blue-100 animate-pulse" />
                Jelajahi Cakrawala Baru
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Fly Above the <br />
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">Horizon.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                Pengalaman penerbangan eksklusif dengan kenyamanan premium dan harga yang tetap bersahabat. Horizon Air mengantarkan Anda ke berbagai destinasi impian secara aman.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Link 
                  href="/register" 
                  className={cn(buttonVariants({ size: "lg" }), "bg-blue-600 text-white hover:bg-blue-700 h-14 px-8 text-base font-bold shadow-xl shadow-blue-500/20 rounded-2xl transition-all hover:scale-105 active:scale-95")}
                >
                  Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="#destinasi" 
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900 h-14 px-8 text-base font-bold rounded-2xl shadow-sm hover:bg-white hover:border-slate-300")}
                >
                  Jelajahi Rute
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="pt-6 flex items-center gap-6 animate-in fade-in duration-1000 delay-700">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                  ].map((url, i) => (
                    <img 
                      key={i} 
                      src={url} 
                      alt={`User avatar ${i + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md" 
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="text-slate-500 font-bold mt-0.5">Dipercaya oleh 50.000+ Penumpang Setia</p>
                </div>
              </div>
            </div>

            {/* Right Graphic card */}
            <div className="lg:col-span-5 relative hidden lg:block group">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-[80px] rounded-full animate-pulse duration-[4000ms]" />
              <div className="relative bg-white/70 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 rotate-1 group-hover:rotate-0 transition-transform duration-700">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative shadow-inner bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1000&auto=format&fit=crop"
                    alt="Horizon Air Premium Cabin/Plane"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[3000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-300">New Generation Fleet</p>
                    <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Premium cabin<br />Comfort</h3>
                  </div>
                </div>
              </div>

              {/* Floating Widget */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100 shadow-xl animate-bounce duration-[4000ms] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Zap className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ON-TIME DEPARTURE</p>
                  <p className="text-base font-black text-slate-900">Rasio Ketepatan 99.8%</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Flight Quick Search Widget Section */}
        <section className="container mx-auto px-4 relative z-20">
          <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.2rem] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/30">
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 h-2.5 w-full" />
            <CardContent className="p-8 md:p-10 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Plane className="h-6 w-6 text-blue-600 -rotate-12" /> Cari Penerbangan Terbaik
                </h3>
                <p className="text-slate-500 text-sm font-medium">Atur destinasi impian Anda dan dapatkan tiket langsung dengan tarif terjangkau.</p>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-8 pt-2">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Origin Field */}
                  <div className="space-y-2 relative">
                    <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <PlaneTakeoff className="h-4.5 w-4.5 text-blue-600" /> Berangkat Dari
                    </Label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ketik kota atau bandara asal..."
                        value={asalSearch}
                        onChange={(e) => {
                          setAsalSearch(e.target.value);
                          if (searchData.asal) {
                            setSearchData({ ...searchData, asal: "" });
                          }
                        }}
                        onFocus={() => {
                          setShowAsalDropdown(true);
                          setShowTujuanDropdown(false);
                        }}
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
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 space-y-1 scrollbar-thin">
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
                    <p className="text-[10px] text-slate-400 font-medium">Contoh: Surabaya, Jakarta, Bali</p>
                  </div>

                  {/* Destination Field */}
                  <div className="space-y-2 relative">
                    <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <PlaneLanding className="h-4.5 w-4.5 text-blue-600" /> Tujuan Destinasi
                    </Label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ketik kota atau bandara tujuan..."
                        value={tujuanSearch}
                        onChange={(e) => {
                          setTujuanSearch(e.target.value);
                          if (searchData.tujuan) {
                            setSearchData({ ...searchData, tujuan: "" });
                          }
                        }}
                        onFocus={() => {
                          setShowTujuanDropdown(true);
                          setShowAsalDropdown(false);
                        }}
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
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 space-y-1 scrollbar-thin">
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
                    <p className="text-[10px] text-slate-400 font-medium">Pilih bandara tujuan penerbangan</p>
                  </div>

                  {/* Departure Date */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <Calendar className="h-4.5 w-4.5 text-blue-600" /> Tanggal Pergi
                    </Label>
                    <input 
                      type="date" 
                      className="w-full flex h-14 items-center justify-between border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-600 font-bold text-slate-800 border px-3 py-2 text-sm rounded-2xl"
                      value={searchData.tanggal}
                      onChange={(e) => setSearchData({...searchData, tanggal: e.target.value})}
                      required
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Tanggal keberangkatan flight</p>
                  </div>

                  {/* Passengers Count */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                      <Users className="h-4.5 w-4.5 text-blue-600" /> Jumlah Penumpang
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
                    <p className="text-[10px] text-slate-400 font-medium">Batas maksimal pemesanan 10 tiket</p>
                  </div>

                </div>

                {/* Submit Action */}
                <div className="flex justify-end border-t border-slate-100 pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-slate-900 hover:bg-slate-800 text-white h-14 px-10 rounded-2xl font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95 gap-2"
                  >
                    <Search className="h-5 w-5" /> Cari Rute Penerbangan
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="py-20 mt-8 border-y border-slate-100 bg-white/40 backdrop-blur-sm relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Negara Tujuan", value: "24+" },
                { label: "Penerbangan / Hari", value: "150+" },
                { label: "Armada Modern Boeing/Airbus", value: "80+" },
                { label: "Kepuasan Penumpang", value: "4.9/5" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations Grid Section */}
        <section id="destinasi" className="py-24">
          <div className="container mx-auto px-4 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black uppercase tracking-wider">
                <Compass className="h-4 w-4" /> Destinasi Unggulan
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Destinasi Favorit <span className="text-blue-600">Horizon Air</span>
              </h2>
              <p className="text-slate-500 text-base font-medium">
                Penerbangan terpopuler yang paling diminati oleh penumpang setia kami. Pesan sekarang untuk mendapatkan harga terbaik.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularDestinations.map((dest, i) => (
                <div 
                  key={i} 
                  className="group relative rounded-[2.2rem] overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-white"
                  onClick={() => {
                    setSearchData(prev => ({ ...prev, tujuan: dest.code }));
                    setTujuanSearch(`${dest.code} - ${dest.city} (${dest.airportName})`);
                    toast.info(`Bandara tujuan diatur ke ${dest.code}`);
                    // Scroll smoothly to search form
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                >
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent z-10" />
                  
                  <img 
                    src={dest.image} 
                    alt={dest.city}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1436491865332-7a61a109c055?q=80&w=600&auto=format&fit=crop";
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Tag */}
                  <div className="absolute top-5 right-5 z-20 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-white text-[9px] font-black tracking-widest">
                    {dest.tag}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 space-y-3 text-white">
                    <p className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {dest.code} • {dest.airportName}
                    </p>
                    <h4 className="text-2xl font-black tracking-tight">{dest.city}</h4>
                    <div className="h-[1.5px] w-12 bg-white/40 group-hover:w-full transition-all duration-500" />
                    
                    <div className="flex justify-between items-end pt-1">
                      <div>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">Mulai Dari</p>
                        <p className="text-lg font-black text-emerald-400">IDR {dest.price}</p>
                      </div>
                      <span className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 transition-colors">
                        Pilih Rute
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section id="layanan" className="py-24 bg-white/60 backdrop-blur-sm border-y border-slate-100">
          <div className="container mx-auto px-4 space-y-20">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  <Zap className="h-4 w-4" /> Standar Pelayanan Elite
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                  Fasilitas & Layanan Terbaik <br />
                  Untuk Kenyamanan Anda
                </h2>
              </div>
              <Link 
                href="/register" 
                className="text-blue-600 font-bold text-base hover:text-blue-700 flex items-center gap-1 group self-start md:self-end"
              >
                Gabung Member Horizon Elite <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Keamanan Sertifikasi Global",
                  desc: "Menerapkan standar keselamatan dan sertifikasi keamanan udara internasional level tertinggi.",
                  icon: ShieldCheck,
                  gradient: "from-emerald-500 to-teal-600",
                },
                {
                  title: "Kabin & Kursi Premium",
                  desc: "Dilengkapi ruang kaki yang luas, kursi ergonomis, serta interior kabin modern yang senyap.",
                  icon: Plane,
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Akses WiFi & Hiburan Kabin",
                  desc: "Nikmati koneksi internet nirkabel gratis serta ratusan pilihan film dan musik selama perjalanan.",
                  icon: Globe,
                  gradient: "from-purple-500 to-pink-600",
                },
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-[2.2rem] bg-white border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-500", feature.gradient)}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                <MessageSquare className="h-4 w-4" /> Ulasan Penumpang
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Apa Kata <span className="text-blue-600">Mereka?</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium">
                Dengarkan langsung cerita pengalaman terbang yang tak terlupakan dari para pelanggan setia Horizon Air.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((test, i) => (
                <Card key={i} className="border border-slate-100 bg-white/80 backdrop-blur-md rounded-[2.2rem] p-8 space-y-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {Array.from({ length: test.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                    "{test.comment}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <img 
                      src={test.avatar} 
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm" 
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-snug">{test.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{test.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 max-w-4xl space-y-16">
            
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Pertanyaan Umum (FAQ)
              </h2>
              <p className="text-slate-500 text-base font-medium">
                Temukan jawaban cepat untuk beberapa pertanyaan yang paling sering diajukan seputar pemesanan, tiket, dan penerbangan.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div 
                    key={i} 
                    className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-base md:text-lg">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-100/50 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* CTA section (Re-styled to be Light and Premium) */}
        <section className="py-20 bg-slate-50/40 relative overflow-hidden border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-white to-blue-50/60 rounded-[3rem] p-10 lg:p-20 text-center relative overflow-hidden border border-slate-200/80 shadow-2xl">
              
              {/* Internal soft glows */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl lg:text-6xl font-black leading-none tracking-tight text-slate-900">
                  Terbang Hemat <br />
                  Bersama <span className="text-blue-600">Horizon Elite</span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed">
                  Daftar sebagai anggota Horizon Elite hari ini secara gratis. Dapatkan promo kupon eksklusif potongan hingga 20% untuk penerbangan pertama Anda.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/15">
                      Daftar Akun Baru
                    </Button>
                  </Link>
                  <p className="text-slate-500 font-bold italic text-sm">Gunakan kode promo: <span className="text-blue-600 font-extrabold not-italic">HORIZON2026</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t border-slate-100 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                  <Plane className="h-5 w-5 text-white rotate-45" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">Horizon Air</span>
              </div>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-sm">
                Menghubungkan Anda ke cakrawala dengan armada pesawat modern, tingkat ketepatan waktu tinggi, dan keamanan kelas dunia.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Tautan Pintar</p>
              <ul className="space-y-2.5 text-sm font-bold text-slate-600">
                <li><Link href="#layanan" className="hover:text-blue-600 transition-colors">Layanan</Link></li>
                <li><Link href="#destinasi" className="hover:text-blue-600 transition-colors">Destinasi</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 transition-colors">Masuk Member</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Media Sosial</p>
              <ul className="space-y-2.5 text-sm font-bold text-slate-600">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Twitter (X)</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">LinkedIn Profile</Link></li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-100 text-slate-400 font-semibold text-xs">
            <p className="italic text-center md:text-left">
              © 2026 Horizon Air. Dibuat dengan dedikasi penuh untuk LKS Provinsi Jawa Timur.
            </p>
            <div className="flex gap-8 text-[11px] font-bold">
              <Link href="#" className="hover:text-slate-900 transition-colors">Keamanan</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Ketentuan & Syarat</Link>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
