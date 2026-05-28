"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJadwal, JadwalPenerbangan } from "@/services/jadwal";
import { updateStatusPenerbangan } from "@/services/status";
import { toast } from "sonner";
import { RefreshCcw, Loader2, Save, Undo2, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UbahStatusPage() {
  const queryClient = useQueryClient();
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalPenerbangan | null>(null);
  const [newStatus, setNewStatus] = useState<string>("Sesuai Jadwal");
  const [delayJam, setDelayJam] = useState<number>(0);
  const [delayMenit, setDelayMenit] = useState<number>(0);

  const { data: jadwals, isLoading: isTableLoading } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });

  const mutation = useMutation({
    mutationFn: () => updateStatusPenerbangan({
      jadwalPenerbanganId: selectedJadwal!.id,
      status: newStatus as any,
      perkiraanDurasiDelayMenit: newStatus === "Delay" ? (delayJam * 60) + delayMenit : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal"] });
      toast.success("Status penerbangan berhasil diperbarui");
      setSelectedJadwal(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal memperbarui status"),
  });

  const handleEdit = (j: JadwalPenerbangan) => {
    setSelectedJadwal(j);
    setNewStatus(j.statusTerakhir?.status || "Sesuai Jadwal");
    if (j.statusTerakhir?.status === "Delay") {
      setDelayJam(Math.floor((j.statusTerakhir.perkiraanDurasiDelayMenit || 0) / 60));
      setDelayMenit((j.statusTerakhir.perkiraanDurasiDelayMenit || 0) % 60);
    } else {
      setDelayJam(0);
      setDelayMenit(0);
    }
  };

  const formatUpdateDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd-MM-yyyy HH:mm:ss");
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <RefreshCcw className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ubah Status Penerbangan</h1>
          <p className="text-slate-500 text-sm font-medium">Perbarui status live delay, keberangkatan, atau kedatangan armada.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Penerbangan Aktif</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">{jadwals?.length || 0} Penerbangan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">Kode</TableHead>
                      <TableHead className="font-bold">Maskapai</TableHead>
                      <TableHead className="font-bold">Rute</TableHead>
                      <TableHead className="font-bold">Waktu</TableHead>
                      <TableHead className="font-bold">Status Terakhir</TableHead>
                      <TableHead className="font-bold">Terakhir Diubah</TableHead>
                      <TableHead className="text-right font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                    ) : jadwals?.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-20 text-slate-500 font-medium">Belum ada penerbangan.</TableCell></TableRow>
                    ) : (
                      jadwals?.map((j: any) => (
                        <TableRow key={j.id} className={cn("hover:bg-slate-50/50 transition-colors", selectedJadwal?.id === j.id ? "bg-blue-50/60" : "")}>
                          <TableCell className="font-bold text-slate-900">{j.kodePenerbangan}</TableCell>
                          <TableCell className="text-xs font-semibold text-slate-600">{j.maskapai?.nama}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold text-slate-800 text-xs">
                              <span>{j.bandaraKeberangkatan?.kodeIATA}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span>{j.bandaraTujuan?.kodeIATA}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-700">{j.waktuKeberangkatan}</TableCell>
                          <TableCell>
                            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                              j.statusTerakhir?.status === "Delay" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                              j.statusTerakhir?.status === "Dibatalkan" ? "bg-red-100 text-red-800 border border-red-200" :
                              j.statusTerakhir?.status === "Mendarat" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                              j.statusTerakhir?.status === "Berangkat" ? "bg-indigo-100 text-indigo-800 border border-indigo-200" :
                              "bg-blue-100 text-blue-800 border border-blue-200"
                            )}>
                              {j.statusTerakhir?.status || "Sesuai Jadwal"}
                              {j.statusTerakhir?.status === "Delay" && ` (${j.statusTerakhir.perkiraanDurasiDelayMenit || 0}m)`}
                            </span>
                          </TableCell>
                          <TableCell className="text-[10px] font-bold text-slate-400">
                            {formatUpdateDate(j.statusTerakhir?.waktuPerubahan)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(j)} className="h-8 rounded-lg border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50">Ubah</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Form status change block */}
        <div className="lg:col-span-1">
          {selectedJadwal ? (
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 w-full" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                  <span>Update Live Status</span>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedJadwal(null)} className="h-8 w-8 rounded-full border"><Undo2 className="h-4 w-4" /></Button>
                </CardTitle>
                <CardDescription>Penerbangan: <span className="font-bold text-blue-600">{selectedJadwal.kodePenerbangan}</span></CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Pilih Status Baru</Label>
                  <Select value={newStatus} onValueChange={(v) => v && setNewStatus(v)}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:ring-blue-600"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Sesuai Jadwal", "Delay", "Dibatalkan", "Berangkat", "Mendarat"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newStatus === "Delay" && (
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                    <Label className="text-xs font-bold text-amber-600 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Durasi Estimasi Delay</Label>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <Input type="number" value={delayJam} onChange={e => setDelayJam(parseInt(e.target.value) || 0)} min={0} className="h-10 rounded-lg border-slate-200 bg-white font-bold" />
                        <p className="text-[10px] text-slate-400 font-bold text-center">Jam</p>
                      </div>
                      <div className="space-y-1">
                        <Input type="number" value={delayMenit} onChange={e => setDelayMenit(parseInt(e.target.value) || 0)} min={0} max={59} className="h-10 rounded-lg border-slate-200 bg-white font-bold" />
                        <p className="text-[10px] text-slate-400 font-bold text-center">Menit</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={() => setSelectedJadwal(null)} className="h-11 rounded-xl font-bold">Batal</Button>
                  <Button className="bg-slate-950 hover:bg-slate-800 text-white gap-1.5 h-11 rounded-xl font-bold px-6 min-w-[130px]" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Simpan</>}
                  </Button>
                </div>

              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm rounded-3xl bg-slate-50/50 p-8 border border-dashed border-slate-200 text-center space-y-3">
              <RefreshCcw className="h-10 w-10 text-slate-300 mx-auto animate-pulse" />
              <p className="text-slate-500 font-bold text-sm">Pilih Jadwal Penerbangan</p>
              <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">Klik tombol "Ubah" pada baris tabel penerbangan untuk mulai memperbarui status operasional.</p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
