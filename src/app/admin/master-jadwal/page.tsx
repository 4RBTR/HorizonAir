"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJadwal, createJadwal, updateJadwal, deleteJadwal, JadwalPenerbangan } from "@/services/jadwal";
import { getBandara } from "@/services/bandara";
import { getMaskapai } from "@/services/maskapai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Undo2, Save, CalendarDays, Clock, ArrowRight, Plane, Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const jadwalSchema = z.object({
  kodePenerbangan: z.string().regex(/^[A-Z]{2}-\d{4}$/, "Format harus XX-0000 (2 huruf, strip, 4 angka)"),
  bandaraKeberangkatanId: z.string().min(1, "Bandara asal wajib dipilih"),
  bandaraTujuanId: z.string().min(1, "Bandara tujuan wajib dipilih"),
  maskapaiId: z.string().min(1, "Maskapai wajib dipilih"),
  tanggalKeberangkatan: z.string().min(1, "Tanggal wajib diisi"),
  waktuKeberangkatan: z.string().min(1, "Waktu wajib diisi"),
  durasiJam: z.coerce.number().min(0),
  durasiMenit: z.coerce.number().min(0).max(59),
  hargaPerTiket: z.coerce.number().min(1, "Minimal harga 1"),
}).refine((data) => data.bandaraKeberangkatanId !== data.bandaraTujuanId, {
  message: "Bandara asal dan tujuan tidak boleh sama",
  path: ["bandaraTujuanId"],
});

export default function MasterJadwalPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: jadwals, isLoading: isTableLoading } = useQuery({ queryKey: ["jadwal"], queryFn: getJadwal });
  const { data: bandaras } = useQuery({ queryKey: ["bandara"], queryFn: getBandara });
  const { data: maskapais } = useQuery({ queryKey: ["maskapai"], queryFn: getMaskapai });

  const form = useForm<z.infer<typeof jadwalSchema>>({
    resolver: zodResolver(jadwalSchema) as any,
    defaultValues: {
      kodePenerbangan: "",
      bandaraKeberangkatanId: "",
      bandaraTujuanId: "",
      maskapaiId: "",
      tanggalKeberangkatan: "",
      waktuKeberangkatan: "",
      durasiJam: 1,
      durasiMenit: 0,
      hargaPerTiket: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => {
      const { durasiJam, durasiMenit, ...rest } = values;
      return createJadwal({ ...rest, durasiPenerbanganMenit: (durasiJam * 60) + durasiMenit });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal"] });
      toast.success("Jadwal berhasil ditambahkan");
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menambah jadwal"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: any }) => {
      const { durasiJam, durasiMenit, ...rest } = values;
      return updateJadwal(id, { ...rest, durasiPenerbanganMenit: (durasiJam * 60) + durasiMenit });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal"] });
      toast.success("Jadwal berhasil diperbarui");
      setEditingId(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal memperbarui jadwal"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJadwal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jadwal"] });
      toast.success("Jadwal berhasil dihapus");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menghapus jadwal"),
  });

  const onEdit = (j: JadwalPenerbangan) => {
    setEditingId(j.id);
    form.setValue("kodePenerbangan", j.kodePenerbangan);
    form.setValue("bandaraKeberangkatanId", j.bandaraKeberangkatanId);
    form.setValue("bandaraTujuanId", j.bandaraTujuanId);
    form.setValue("maskapaiId", j.maskapaiId);
    form.setValue("tanggalKeberangkatan", j.tanggalKeberangkatan);
    form.setValue("waktuKeberangkatan", j.waktuKeberangkatan);
    form.setValue("durasiJam", Math.floor(j.durasiPenerbanganMenit / 60));
    form.setValue("durasiMenit", j.durasiPenerbanganMenit % 60);
    form.setValue("hargaPerTiket", j.hargaPerTiket);
  };

  const onSubmit = (values: z.infer<typeof jadwalSchema>) => {
    if (editingId) updateMutation.mutate({ id: editingId, values });
    else createMutation.mutate(values);
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}j ${m}m`;
  };

  const sortedJadwals = jadwals?.sort((a, b) => {
    const dateA = new Date(`${a.tanggalKeberangkatan}T${a.waktuKeberangkatan}`).getTime();
    const dateB = new Date(`${b.tanggalKeberangkatan}T${b.waktuKeberangkatan}`).getTime();
    return dateB - dateA;
  }) || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
          <CalendarDays className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jadwal Penerbangan</h1>
          <p className="text-slate-500 text-sm font-medium">Atur jam keberangkatan rute dan durasi terbang.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Rute & Jadwal Aktif</span>
                <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold">{sortedJadwals.length} Jadwal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">Kode</TableHead>
                      <TableHead className="font-bold">Rute Perjalanan</TableHead>
                      <TableHead className="font-bold">Maskapai</TableHead>
                      <TableHead className="font-bold">Jadwal Keberangkatan</TableHead>
                      <TableHead className="font-bold">Durasi</TableHead>
                      <TableHead className="font-bold">Harga Tiket</TableHead>
                      <TableHead className="text-right font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                    ) : sortedJadwals.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-20 text-slate-500 font-medium">Belum ada jadwal terdaftar.</TableCell></TableRow>
                    ) : (
                      sortedJadwals.map((j) => (
                        <TableRow key={j.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-bold text-blue-600">{j.kodePenerbangan}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                              <span>{j.bandaraKeberangkatan?.kodeIATA}</span>
                              <ArrowRight className="h-3 w-3 text-slate-400" />
                              <span>{j.bandaraTujuan?.kodeIATA}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700">{j.maskapai?.nama}</TableCell>
                          <TableCell>
                            <p className="text-xs font-bold text-slate-800">{j.tanggalKeberangkatan}</p>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5"><Clock className="h-3 w-3" /> {j.waktuKeberangkatan}</p>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{formatDuration(j.durasiPenerbanganMenit)}</span>
                          </TableCell>
                          <TableCell className="font-black text-emerald-600 text-xs">IDR {j.hargaPerTiket.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button variant="outline" size="icon" onClick={() => onEdit(j)} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => { if (confirm("Hapus jadwal ini?")) deleteMutation.mutate(j.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
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

        {/* Input Form Card */}
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 w-full" />
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
              {editingId ? "Ubah Jadwal" : "Tambah Jadwal"}
            </CardTitle>
            <CardDescription>Sesuaikan detail waktu rute penerbangan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                
                <FormField control={form.control as any} name="kodePenerbangan" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Kode Penerbangan</FormLabel><FormControl><Input placeholder="Contoh: HX-1234" {...field} className="h-11 rounded-xl border-slate-200 uppercase font-bold" /></FormControl><FormMessage /></FormItem>
                )} />
                
                 <FormField control={form.control as any} name="maskapaiId" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Maskapai</FormLabel>
                    <Select onValueChange={(v) => v && field.onChange(v)} value={field.value}>
                      <FormControl><SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Pilih Maskapai" /></SelectTrigger></FormControl>
                      <SelectContent>{maskapais?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nama}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control as any} name="bandaraKeberangkatanId" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Asal</FormLabel>
                      <Select onValueChange={(v) => v && field.onChange(v)} value={field.value}>
                        <FormControl><SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Asal" /></SelectTrigger></FormControl>
                        <SelectContent>{bandaras?.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.kodeIATA} - {b.kota}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control as any} name="bandaraTujuanId" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Tujuan</FormLabel>
                      <Select onValueChange={(v) => v && field.onChange(v)} value={field.value}>
                        <FormControl><SelectTrigger className="h-11 rounded-xl border-slate-200"><SelectValue placeholder="Tujuan" /></SelectTrigger></FormControl>
                        <SelectContent>{bandaras?.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.kodeIATA} - {b.kota}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control as any} name="tanggalKeberangkatan" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Tanggal</FormLabel><FormControl><Input type="date" {...field} className="h-11 rounded-xl border-slate-200" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control as any} name="waktuKeberangkatan" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Waktu</FormLabel><FormControl><Input type="time" {...field} className="h-11 rounded-xl border-slate-200" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-purple-600" /> Durasi Penerbangan</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control as any} name="durasiJam" render={({ field }: any) => (
                      <FormItem><FormControl><Input type="number" min={0} {...field} className="h-10 rounded-lg border-slate-200 bg-white" /></FormControl><p className="text-[10px] text-slate-400 font-bold text-center mt-1">Jam</p></FormItem>
                    )} />
                    <FormField control={form.control as any} name="durasiMenit" render={({ field }: any) => (
                      <FormItem><FormControl><Input type="number" min={0} max={59} {...field} className="h-10 rounded-lg border-slate-200 bg-white" /></FormControl><p className="text-[10px] text-slate-400 font-bold text-center mt-1">Menit</p></FormItem>
                    )} />
                  </div>
                </div>

                <FormField control={form.control as any} name="hargaPerTiket" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Harga Tiket (IDR)</FormLabel><FormControl><Input type="number" min={1} {...field} className="h-11 rounded-xl border-slate-200 font-bold" /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => { setEditingId(null); form.reset(); }} className="gap-1.5 h-11 rounded-xl font-bold"><Undo2 className="h-4 w-4" /> Batal</Button>
                  <Button type="submit" className="bg-slate-950 hover:bg-slate-800 text-white gap-1.5 h-11 rounded-xl font-bold px-6" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {editingId ? "Perbarui" : "Simpan"}</>}
                  </Button>
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
