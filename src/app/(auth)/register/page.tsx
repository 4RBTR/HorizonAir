"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plane, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  nomorTelepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^\d+$/, "Nomor telepon harus berupa angka"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      nama: "",
      tanggalLahir: "",
      nomorTelepon: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      // Call proxy API
      const response = await axios.post("/api/proxy/Auth/Register", values);
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Registrasi berhasil! Silakan masuk.");
        router.push("/login");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Plane className="h-8 w-8 text-blue-600 rotate-45" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Horizon Air
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gabung dengan Kami</h2>
          <p className="text-slate-500">Mulai pengalaman terbang terbaik Anda bersama Horizon Air</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" /> Daftar Akun Baru
            </CardTitle>
            <CardDescription>
              Isi data diri Anda dengan lengkap sesuai identitas resmi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="username"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username_kamu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Sesuai KTP/Paspor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tanggalLahir"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomorTelepon"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="081234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min. 8 karakter" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </p>
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
