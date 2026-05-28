"use client";

import { useQuery } from "@tanstack/react-query";
import { getTiketSaya } from "@/services/transaksi";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plane, Ticket, Clock, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function TiketSayaPage() {
  const { data: tikets, isLoading } = useQuery({ queryKey: ["tiket-saya"], queryFn: getTiketSaya });

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Tiket Saya</h1>
        <p className="text-slate-500">Semua riwayat penerbangan dan tiket aktif Anda.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
      ) : tikets?.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center space-y-4">
           <Ticket className="h-12 w-12 text-slate-300 mx-auto" />
           <p className="text-slate-500">Anda belum memiliki tiket.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tikets?.map((t: any) => (
            <Card key={t.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
               <div className="flex flex-col md:flex-row">
                  <div className="bg-blue-600 md:w-48 p-6 text-white flex flex-col justify-between items-center text-center gap-4">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Kode Booking</p>
                        <p className="text-2xl font-black">{t.id.slice(0, 6).toUpperCase()}</p>
                     </div>
                     <div className="w-full aspect-square bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                        <Plane className="h-12 w-12 -rotate-12" />
                     </div>
                  </div>
                  
                  <CardContent className="flex-1 p-6 space-y-6">
                     <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plane className="h-5 w-5 text-blue-600 rotate-45" />
                           </div>
                           <div>
                              <p className="font-bold text-slate-900">{t.jadwalPenerbangan?.maskapai?.nama}</p>
                              <p className="text-xs text-slate-500">{t.jadwalPenerbangan?.kodePenerbangan}</p>
                           </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          t.jadwalPenerbangan?.statusTerakhir?.status === "Delay" ? "bg-amber-100 text-amber-700" :
                          t.jadwalPenerbangan?.statusTerakhir?.status === "Dibatalkan" ? "bg-red-100 text-red-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {t.jadwalPenerbangan?.statusTerakhir?.status || "Sesuai Jadwal"}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4 border-y border-slate-50">
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Keberangkatan</p>
                           <p className="font-bold text-slate-900">{t.jadwalPenerbangan?.waktuKeberangkatan}</p>
                           <p className="text-xs text-slate-500">{t.jadwalPenerbangan?.bandaraKeberangkatan?.kodeIATA}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Tanggal</p>
                           <p className="font-bold text-slate-900">{t.jadwalPenerbangan?.tanggalKeberangkatan}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Penumpang</p>
                           <p className="font-bold text-slate-900">{t.jumlahPenumpang} Orang</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Total Harga</p>
                           <p className="font-bold text-emerald-600">IDR {t.totalHarga.toLocaleString()}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                           {t.penumpang?.map((p: any, i: number) => (
                             <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600" title={p.namaLengkap}>
                               {p.namaLengkap[0]}
                             </div>
                           ))}
                        </div>
                        <button className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                           Lihat Detail E-Tiket <ChevronRight className="h-4 w-4" />
                        </button>
                     </div>
                  </CardContent>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
