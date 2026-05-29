import { Navbar } from "@/components/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, ShieldCheck, Clock, MapPin, ArrowRight, Star, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen mesh-gradient selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-blue-700 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-1000">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                The Future of Air Travel
              </div>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-950 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Fly Above the <br />
                <span className="text-gradient">Horizon.</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                Pengalaman penerbangan kelas eksekutif dengan harga yang tetap membumi. Horizon Air membawa Anda ke destinasi impian dengan kenyamanan tanpa batas.
              </p>
              <div className="flex flex-wrap gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Link 
                  href="/register" 
                  className={cn(buttonVariants({ size: "lg" }), "bg-slate-950 text-white hover:bg-slate-800 h-14 px-10 text-base font-bold shadow-2xl transition-all hover:scale-105 active:scale-95")}
                >
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="#layanan" 
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "glass-card h-14 px-10 text-base font-bold hover:bg-white/50")}
                >
                  Jelajahi Rute
                </Link>
              </div>

              <div className="pt-10 flex items-center gap-6 animate-in fade-in duration-1000 delay-700">
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
                         className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                       />
                     ))}
                  </div>
                 <div className="text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                       {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                    <p className="text-slate-500 font-medium">Dipercaya oleh 50k+ Pelanggan Setia</p>
                 </div>
              </div>
            </div>

            <div className="relative hidden lg:block group">
              <div className="absolute -inset-10 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
              <div className="relative glass-card p-6 rounded-[2.5rem] premium-shadow border-white/40 rotate-1 group-hover:rotate-0 transition-transform duration-700">
                  <div className="aspect-[4/5] rounded-[2rem] bg-slate-950 overflow-hidden relative">
                     {/* Placeholder for Video or High-End Image */}
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-85 hover:scale-105 transition-transform duration-[2000ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 space-y-4">
                       <p className="text-white text-3xl font-black tracking-tight leading-none uppercase">Premium <br /> Experience</p>
                       <div className="h-1 w-20 bg-blue-500" />
                    </div>
                 </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl premium-shadow animate-bounce duration-[3000ms]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                       <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Fastest Check-in</p>
                       <p className="text-lg font-black text-slate-900">Hanya 2 Menit</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-slate-200/50 bg-white/30 backdrop-blur-sm">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                 {[
                   { label: "Negara", value: "24+" },
                   { label: "Penerbangan/Hari", value: "150+" },
                   { label: "Armada Modern", value: "80+" },
                   { label: "Customer Rating", value: "4.9/5" },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-1">
                      <p className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">{stat.value}</p>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Features Section */}
        <section id="layanan" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl space-y-6">
                <h2 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-[0.9]">
                  Standar <span className="text-blue-600 italic">Elite</span> Untuk <br /> Setiap Perjalanan.
                </h2>
                <p className="text-slate-500 text-lg">
                  Kami tidak hanya menerbangkan Anda, kami memberikan pengalaman yang tak terlupakan dari awal hingga akhir.
                </p>
              </div>
              <Button variant="link" className="text-blue-600 font-bold text-lg group p-0">
                Lihat Semua Layanan <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Keamanan Tanpa Kompromi",
                  desc: "Sertifikasi keamanan level tertinggi di industri penerbangan global.",
                  icon: ShieldCheck,
                  gradient: "from-emerald-500 to-teal-600",
                },
                {
                  title: "Akses Global Terluas",
                  desc: "Jaringan rute yang mencakup seluruh kota besar di Indonesia dan Asia.",
                  icon: Globe,
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Kenyamanan Kabin Premium",
                  desc: "Kursi ergonomis, hiburan lengkap, dan kuliner pilihan selama terbang.",
                  icon: Plane,
                  gradient: "from-purple-500 to-pink-600",
                },
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-slate-950 hover:text-white transition-all duration-500 hover-lift">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-500", feature.gradient)}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-500 group-hover:text-slate-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-slate-950 rounded-[3.5rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
               <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
               
               <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                  <h2 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter">Terbang Sekarang, Bayar <span className="text-blue-500">Hemat.</span></h2>
                  <p className="text-slate-400 text-xl font-medium">
                    Daftar sebagai member Horizon Elite dan nikmati promo eksklusif hingga 20% untuk semua rute.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
                    <Link href="/register">
                      <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-500 h-16 px-12 text-xl font-bold rounded-2xl shadow-xl shadow-blue-600/20">
                        Daftar Akun Baru
                      </Button>
                    </Link>
                    <p className="text-slate-500 font-bold italic">Promo kode: HORIZON2026</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
             <div className="col-span-2 space-y-8">
                <div className="flex items-center gap-2">
                  <Plane className="h-8 w-8 text-blue-600 rotate-45" />
                  <span className="text-2xl font-black text-slate-950 tracking-tighter">Horizon Air</span>
                </div>
                <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-lg">
                  Menghubungkan Anda ke cakrawala dengan kenyamanan dan keamanan kelas dunia.
                </p>
             </div>
             <div className="space-y-6">
                <p className="font-black uppercase tracking-widest text-xs text-slate-400">Quick Links</p>
                <ul className="space-y-4 font-bold text-slate-600">
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</Link></li>
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">Pusat Bantuan</Link></li>
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link></li>
                </ul>
             </div>
             <div className="space-y-6">
                <p className="font-black uppercase tracking-widest text-xs text-slate-400">Socials</p>
                <ul className="space-y-4 font-bold text-slate-600">
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">Instagram</Link></li>
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">Twitter (X)</Link></li>
                   <li><Link href="#" className="hover:text-blue-600 transition-colors">LinkedIn</Link></li>
                </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-50 text-slate-400 font-medium">
            <p className="text-sm italic">
              © 2026 Horizon Air. Crafting with excellence for LKS Provinsi Jawa Timur.
            </p>
            <div className="flex gap-10 text-sm">
              <Link href="#" className="hover:text-slate-900 transition-colors">Security</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
