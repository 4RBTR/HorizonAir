"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPromo, createPromo, updatePromo, deletePromo, KodePromo } from "@/services/promo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Undo2, Save, Ticket, Percent, Calendar } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

const promoSchema = z.object({
  kode: z.string().min(1, "Kode promo wajib diisi").regex(/^[A-Z0-9]+$/, "Kode harus huruf kapital/angka"),
  persentaseDiskon: z.coerce.number().min(1).max(100),
  maksimumDiskon: z.coerce.number().min(1),
  berlakuSampai: z.string().min(1, "Batas berlaku wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
});

export default function MasterPromoPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: promos, isLoading: isTableLoading } = useQuery({ queryKey: ["promo"], queryFn: getPromo });

  const form = useForm<z.infer<typeof promoSchema>>({
    resolver: zodResolver(promoSchema) as any,
    defaultValues: {
      kode: "",
      persentaseDiskon: 1,
      maksimumDiskon: 10000,
      berlakuSampai: "",
      deskripsi: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createPromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo"] });
      toast.success("Promo berhasil ditambahkan");
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menambah promo"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KodePromo> }) => updatePromo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo"] });
      toast.success("Promo berhasil diperbarui");
      setEditingId(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal memperbarui promo"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo"] });
      toast.success("Promo berhasil dihapus");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menghapus promo"),
  });

  const onEdit = (p: KodePromo) => {
    setEditingId(p.id);
    form.setValue("kode", p.kode);
    form.setValue("persentaseDiskon", p.persentaseDiskon);
    form.setValue("maksimumDiskon", p.maksimumDiskon);
    form.setValue("berlakuSampai", p.berlakuSampai);
    form.setValue("deskripsi", p.deskripsi);
  };

  const onSubmit = (values: z.infer<typeof promoSchema>) => {
    if (editingId) updateMutation.mutate({ id: editingId, data: values });
    else createMutation.mutate(values);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <Ticket className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Master Kode Promo</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola kupon potongan harga dan voucher diskon pemesanan.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Kode Kupon Aktif</span>
                <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-bold">{promos?.length || 0} Promo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">Kode Kupon</TableHead>
                      <TableHead className="font-bold">Diskon (%)</TableHead>
                      <TableHead className="font-bold">Maksimal Diskon</TableHead>
                      <TableHead className="font-bold">Masa Berlaku</TableHead>
                      <TableHead className="font-bold">Syarat & Ketentuan</TableHead>
                      <TableHead className="text-right font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                    ) : promos?.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-500 font-medium">Belum ada kode promo terdaftar.</TableCell></TableRow>
                    ) : (
                      promos?.map((p) => (
                        <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell>
                            <span className="text-xs font-black uppercase bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-100/60 tracking-wider">{p.kode}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Percent className="h-3.5 w-3.5 text-slate-400" /> {p.persentaseDiskon}%</span>
                          </TableCell>
                          <TableCell className="font-bold text-emerald-600 text-xs">IDR {p.maksimumDiskon.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {p.berlakuSampai}</span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-500">{p.deskripsi}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button variant="outline" size="icon" onClick={() => onEdit(p)} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => { if (confirm("Hapus promo ini?")) deleteMutation.mutate(p.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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
              {editingId ? "Ubah Promo" : "Tambah Promo"}
            </CardTitle>
            <CardDescription>Atur syarat dan besaran diskon promo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                
                <FormField control={form.control as any} name="kode" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Kode Kupon</FormLabel><FormControl><Input placeholder="HORIZON2026" {...field} className="h-11 rounded-xl border-slate-200 uppercase font-bold" /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control as any} name="persentaseDiskon" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Diskon (%)</FormLabel><FormControl><Input type="number" min={1} max={100} {...field} className="h-11 rounded-xl border-slate-200 font-bold" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control as any} name="maksimumDiskon" render={({ field }: any) => (
                    <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Maks Potongan</FormLabel><FormControl><Input type="number" min={1} {...field} className="h-11 rounded-xl border-slate-200 font-bold text-emerald-600" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control as any} name="berlakuSampai" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Masa Berlaku Kupon</FormLabel><FormControl><Input type="date" {...field} className="h-11 rounded-xl border-slate-200" /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control as any} name="deskripsi" render={({ field }: any) => (
                  <FormItem className="space-y-1"><FormLabel className="text-xs font-bold text-slate-600">Syarat & Ketentuan</FormLabel><FormControl><Textarea placeholder="Contoh: Diskon maksimal 50rb khusus pemesanan kabin ekonomi..." className="resize-none rounded-xl border-slate-200 h-24" {...field} /></FormControl><FormMessage /></FormItem>
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
