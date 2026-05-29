"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plane, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  // Live Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}.${mm}.${ss}`);
      
      const days = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
      const months = [
        "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
        "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
      ];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      setDateStr(`${dayName}, ${day} ${monthName} ${year}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login gagal. Periksa username dan password Anda.");
      } else {
        toast.success("Login berhasil!");
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        const role = (session?.user as any)?.role;
        
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/customer");
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Column: Cover Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Branding Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <Plane className="h-7 w-7 text-blue-500 rotate-45" />
          <span className="text-xl font-black tracking-tight">Horizon <span className="text-blue-500">Air</span></span>
        </Link>

        {/* Copywriting */}
        <div className="relative z-10 space-y-6 max-w-sm">
          <div className="h-1.5 w-16 bg-blue-500 rounded-full" />
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Terbang Lebih Tinggi Bersama Horizon Air.
          </h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Pesan tiket penerbangan kelas eksekutif dengan harga membumi. Nikmati kenyamanan penerbangan tanpa batas ke seluruh destinasi impian Anda.
          </p>
        </div>

        {/* Footer legal */}
        <p className="relative z-10 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          © 2026 Horizon Air. LKS Provinsi Jawa Timur.
        </p>
      </div>

      {/* Right Column: Interactive Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:p-16 relative overflow-y-auto">
        
        {/* Back Link Nav */}
        <div className="w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>

        {/* Center Content Form */}
        <div className="max-w-md w-full mx-auto my-auto py-10 space-y-8">
          
          {/* Logo & Headline */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Plane className="h-6 w-6 rotate-45" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Horizon <span className="text-blue-600">Air</span></span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">Selamat Datang! 👋</h1>
              <p className="text-slate-500 text-sm font-medium">
                Silakan masuk ke akun Anda atau <Link href="/register" className="text-blue-600 hover:underline font-bold">daftar baru</Link>.
              </p>
            </div>
          </div>

          {/* Form component */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan username Anda" 
                        {...field} 
                        className="h-13 px-4 rounded-2xl border-none bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Masukkan kata sandi Anda" 
                          {...field} 
                          className="h-13 pl-4 pr-12 rounded-2xl border-none bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember & Forgot options */}
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>
                <Link href="#" className="text-blue-600 hover:underline">Lupa kata sandi?</Link>
              </div>

              {/* Submit CTA Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-13 text-sm font-bold uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-blue-600/10 hover:scale-[1.02] active:scale-95 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>

            </form>
          </Form>

        </div>

        {/* Footer section matching hydro-flow */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Dilindungi oleh enkripsi aman. Syarat & Ketentuan • Privasi</span>
          </div>
          
          {/* Live Date/Time Badge */}
          {time && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl normal-case font-bold text-slate-600">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="text-right leading-tight">
                <p className="font-mono text-xs font-black tracking-widest">{time}</p>
                <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">{dateStr}</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
