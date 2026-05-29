"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getJadwal } from "@/services/jadwal";
import { getPromo, KodePromo } from "@/services/promo";
import { createTransaksi } from "@/services/transaksi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Plane, Ticket, Users, ShieldCheck, CheckCircle2, ChevronRight, Lock, Check, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { addMinutes, format } from "date-fns";

export default function BeliTiketPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const jadwalId = searchParams.get("jadwalId");
  const count = parseInt(searchParams.get("penumpang") || "1");

  const [passengers, setPassengers] = useState(
    Array.from({ length: count }, () => ({ titel: "Tuan", namaLengkap: "" }))
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<KodePromo | null>(null);

  const { data: jadwals } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });
  const { data: promos } = useQuery({ queryKey: ["promo"], queryFn: getPromo });

  const jadwal = jadwals?.find(j => String(j.id) === String(jadwalId));

  const totals = useMemo(() => {
    if (!jadwal) return { subtotal: 0, diskon: 0, total: 0 };
    const subtotal = jadwal.hargaPerTiket * count;
    let diskon = 0;
    if (appliedPromo) {
      diskon = (subtotal * appliedPromo.persentaseDiskon) / 100;
      if (diskon > appliedPromo.maksimumDiskon) diskon = appliedPromo.maksimumDiskon;
    }
    return { subtotal, diskon, total: subtotal - diskon };
  }, [jadwal, count, appliedPromo]);

  const mutation = useMutation({
    mutationFn: (total: number) => createTransaksi({
      jadwalPenerbanganId: jadwalId!,
      kodePromo: appliedPromo?.kode || null,
      penumpang: passengers as any,
      jadwalPenerbangan: {
        ...jadwal,
        bandaraKeberangkatan: jadwal?.bandaraKeberangkatan,
        bandaraTujuan: jadwal?.bandaraTujuan,
        maskapai: jadwal?.maskapai,
        statusTerakhir: jadwal?.statusTerakhir || { status: "Sesuai Jadwal" },
      },
      totalHarga: total,
    }),
    onSuccess: () => {
      toast.success("Pembayaran berhasil dikonfirmasi!");
      router.push("/customer/tiket-saya");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal konfirmasi pembayaran"),
  });

  const handleApplyPromo = () => {
    const promo = promos?.find(p => p.kode.toUpperCase() === promoCode.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Promo ${promo.kode} berhasil digunakan!`);
    } else {
      toast.error("Kode promo tidak valid atau sudah kedaluwarsa.");
      setAppliedPromo(null);
    }
  };

  if (!jadwal) return <div className="flex flex-col justify-center items-center py-32 space-y-4"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /><p className="text-slate-500 font-bold">Memuat detail tiket...</p></div>;

  return (
    <div className="space-y-8 py-4">
      {/* Checkout Header / Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full h-11 w-11 border border-slate-200 bg-white">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checkout Tiket</h1>
            <p className="text-slate-500 text-sm font-medium">Lengkapi detail perjalanan Anda untuk mengamankan tiket.</p>
          </div>
        </div>

        {/* Dynamic visual progress stepper */}
        <div className="flex items-center gap-3 bg-slate-100 p-2.5 rounded-2xl text-xs font-bold text-slate-600 self-start md:self-auto">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">1</span>
          <span>Detail</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-[10px]">2</span>
          <span className="text-slate-400">E-Tiket</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Passenger Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" /> Informasi Penumpang
            </h3>
            
            {passengers.map((p, i) => (
              <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 w-full" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>Penumpang #{i + 1}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Kabin Utama</span>
                  </CardTitle>
                  <CardDescription className="text-xs">Identitas lengkap harus sesuai KTP / Paspor.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-4 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-bold text-xs">Titel</Label>
                    <Select value={p.titel} onValueChange={(v) => {
                      const newP = [...passengers];
                      newP[i].titel = v as any;
                      setPassengers(newP);
                    }}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tuan">Tuan</SelectItem>
                        <SelectItem value="Nyonya">Nyonya</SelectItem>
                        <SelectItem value="Nona">Nona</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-3 space-y-2">
                    <Label className="text-slate-600 font-bold text-xs">Nama Lengkap</Label>
                    <Input 
                      placeholder="Contoh: Danendra Bagas Pratama" 
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-600 font-bold text-slate-800"
                      value={p.namaLengkap}
                      onChange={(e) => {
                        const newP = [...passengers];
                        newP[i].namaLengkap = e.target.value;
                        setPassengers(newP);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side: Sticky Checkout Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl rounded-3xl sticky top-24 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg font-black text-slate-900">Rincian Penerbangan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Flight Main Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Plane className="h-5 w-5 text-blue-600 rotate-45" />
                  {jadwal.maskapai?.nama}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{jadwal.kodePenerbangan}</span>
              </div>

              {/* Flight Timeline Route */}
              <div className="flex items-center gap-4 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Asal</p>
                  <p className="font-bold text-slate-900 mt-1">{jadwal.waktuKeberangkatan}</p>
                  <p className="text-xs text-slate-500 font-medium">{jadwal.bandaraKeberangkatan?.kodeIATA} - {jadwal.bandaraKeberangkatan?.kota}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0 text-[9px] font-bold text-slate-400">
                  <Clock className="h-4.5 w-4.5 text-slate-400" />
                  <span>{Math.floor(jadwal.durasiPenerbanganMenit / 60)}j</span>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tujuan</p>
                  <p className="font-bold text-slate-900 mt-1">
                    {(() => {
                      try {
                        const [h, m] = jadwal.waktuKeberangkatan.split(":").map(Number);
                        const date = addMinutes(new Date(2000, 0, 1, h, m), jadwal.durasiPenerbanganMenit);
                        return format(date, "HH:mm");
                      } catch (e) {
                        return "--:--";
                      }
                    })()}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">{jadwal.bandaraTujuan?.kodeIATA} - {jadwal.bandaraTujuan?.kota}</p>
                </div>
              </div>

              {/* Promo Section */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <Label className="text-slate-600 font-bold text-xs">Voucher Promo</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Masukkan kode promo" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 uppercase font-bold text-slate-800"
                  />
                  <Button variant="outline" onClick={handleApplyPromo} className="h-11 border-slate-200 hover:bg-slate-50 rounded-xl font-bold">Pakai</Button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100/50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Promo {appliedPromo.kode} berhasil dipasang! Diskon IDR {totals.diskon.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-3 pt-6 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span className="font-medium">Subtotal ({count} tiket)</span>
                  <span className="font-bold">IDR {totals.subtotal.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-medium">Potongan Promo</span>
                    <span className="font-bold">- IDR {totals.diskon.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-3 border-t border-dashed border-slate-100">
                  <span className="font-black text-slate-900 text-base">Total Bayar</span>
                  <span className="text-2xl font-black text-blue-600 tracking-tight">IDR {totals.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Secure Booking CTA */}
              <div className="space-y-4 pt-6">
                <Button 
                  className="w-full h-13 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-950/10 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  disabled={mutation.isPending || passengers.some(p => !p.namaLengkap)}
                  onClick={() => mutation.mutate(totals.total)}
                >
                  {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                  Proses Pembayaran Aman
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Enkripsi 256-bit SSL Secure Checkout</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
