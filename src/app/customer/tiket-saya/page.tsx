"use client";

import { useQuery } from "@tanstack/react-query";
import { getTiketSaya } from "@/services/transaksi";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plane, Ticket, Clock, MapPin, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TiketSayaPage() {
  const { data: tikets, isLoading } = useQuery({ queryKey: ["tiket-saya"], queryFn: getTiketSaya });
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

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
                        <p className="text-2xl font-black">{String(t.id).slice(0, 6).toUpperCase()}</p>
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
                        <button 
                           onClick={() => setSelectedTicket(t)}
                           className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all"
                         >
                            Lihat Detail E-Tiket <ChevronRight className="h-4 w-4" />
                        </button>
                     </div>
                  </CardContent>
               </div>
            </Card>
          ))}
        </div>
      )}

      {/* Premium Boarding Pass Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-300 relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 rotate-45 text-white" />
                  <span className="font-black text-base tracking-tight uppercase">E-Boarding Pass</span>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[9px] uppercase font-bold tracking-widest opacity-85">Maskapai</p>
                  <p className="text-lg font-black leading-none">{selectedTicket.jadwalPenerbangan?.maskapai?.nama}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold tracking-widest opacity-85">Kode Penerbangan</p>
                  <p className="text-base font-black uppercase leading-none">{selectedTicket.jadwalPenerbangan?.kodePenerbangan}</p>
                </div>
              </div>
            </div>

            {/* Modal Ticket Body */}
            <div className="p-6 space-y-6">
              
              {/* Route Display */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-left">
                  <p className="text-2xl font-black text-slate-900 leading-none">{selectedTicket.jadwalPenerbangan?.bandaraKeberangkatan?.kodeIATA}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{selectedTicket.jadwalPenerbangan?.bandaraKeberangkatan?.kota}</p>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Langsung</span>
                  <div className="w-16 h-[1.5px] bg-slate-200 relative">
                    <Plane className="h-3 w-3 text-blue-600 rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-0.5" />
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold">
                    {Math.floor((selectedTicket.jadwalPenerbangan?.durasiPenerbanganMenit || 0) / 60)}j {(selectedTicket.jadwalPenerbangan?.durasiPenerbanganMenit || 0) % 60}m
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 leading-none">{selectedTicket.jadwalPenerbangan?.bandaraTujuan?.kodeIATA}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{selectedTicket.jadwalPenerbangan?.bandaraTujuan?.kota}</p>
                </div>
              </div>

              {/* Boarding Info Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs py-2 border-b border-slate-100">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tanggal Pergi</p>
                  <p className="font-black text-slate-800 mt-0.5">{selectedTicket.jadwalPenerbangan?.tanggalKeberangkatan}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Waktu Keberangkatan</p>
                  <p className="font-black text-slate-800 mt-0.5">{selectedTicket.jadwalPenerbangan?.waktuKeberangkatan}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Kelas Kabin</p>
                  <p className="font-black text-blue-600 mt-0.5">Ekonomi (Y)</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status Live</p>
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider mt-0.5",
                    selectedTicket.jadwalPenerbangan?.statusTerakhir?.status === "Delay" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                    selectedTicket.jadwalPenerbangan?.statusTerakhir?.status === "Dibatalkan" ? "bg-red-100 text-red-800 border border-red-200" :
                    "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  )}>
                    {selectedTicket.jadwalPenerbangan?.statusTerakhir?.status || "Sesuai Jadwal"}
                  </span>
                </div>
              </div>

              {/* Passengers Listing */}
              <div className="space-y-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Daftar Penumpang</p>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {selectedTicket.penumpang?.map((p: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                      <span className="font-bold text-slate-700">{p.titel}. {p.namaLengkap}</span>
                      <span className="text-[9px] font-bold text-slate-400">Seat {12 + idx}B / Bagasi 20kg</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boarding Tear-off Line */}
              <div className="relative h-4 my-2">
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] border-t border-dashed border-slate-200" />
                <div className="absolute -left-9 -top-1 w-6 h-6 bg-slate-900/60 rounded-full" />
                <div className="absolute -right-9 -top-1 w-6 h-6 bg-slate-900/60 rounded-full" />
              </div>

              {/* Barcode & Booking Code Section */}
              <div className="text-center space-y-4 pt-2">
                <div className="inline-block bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">KODE BOOKING</p>
                     <p className="text-xl font-black text-slate-900 tracking-widest">{String(selectedTicket.id).slice(0, 6).toUpperCase()}</p>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mx-auto w-64 h-12 flex items-center justify-between bg-white p-2 border border-slate-100 rounded-lg shadow-inner select-none" title="E-Ticket Barcode">
                  {[1,3,1,2,4,1,2,1,3,2,1,4,1,2,3,1,2,1,4,3,1,2,1,3,1,2,1,4,1,3,2,1,4].map((width, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-950 h-full" 
                      style={{ width: `${width}px`, opacity: idx % 3 === 0 ? 0.35 : 1 }} 
                    />
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold leading-normal">Harap tunjukkan e-boarding pass ini di bandara saat proses check-in mandiri atau boarding.</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
