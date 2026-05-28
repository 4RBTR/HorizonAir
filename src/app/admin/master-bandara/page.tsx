"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBandara, createBandara, updateBandara, deleteBandara, Bandara } from "@/services/bandara";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Undo2, Save, Palmtree, MapPin, Globe, Landmark, Eye } from "lucide-react";

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

const bandaraSchema = z.object({
  nama: z.string().min(1, "Nama bandara wajib diisi"),
  kodeIATA: z.string().length(3, "Kode IATA harus 3 huruf"),
  kota: z.string().min(1, "Kota wajib diisi"),
  negara: z.string().min(1, "Negara wajib diisi"),
  jumlahTerminal: z.coerce.number().min(1, "Minimal 1 terminal"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
});

export default function MasterBandaraPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: bandaras, isLoading: isTableLoading } = useQuery({
    queryKey: ["bandara"],
    queryFn: getBandara,
  });

  const form = useForm<z.infer<typeof bandaraSchema>>({
    resolver: zodResolver(bandaraSchema) as any,
    defaultValues: {
      nama: "",
      kodeIATA: "",
      kota: "",
      negara: "",
      jumlahTerminal: 1,
      alamat: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createBandara,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bandara"] });
      toast.success("Bandara berhasil ditambahkan");
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menambah bandara"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bandara> }) => updateBandara(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bandara"] });
      toast.success("Bandara berhasil diperbarui");
      setEditingId(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal memperbarui bandara"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBandara,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bandara"] });
      toast.success("Bandara berhasil dihapus");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menghapus bandara"),
  });

  const onEdit = (bandara: Bandara) => {
    setEditingId(bandara.id);
    form.setValue("nama", bandara.nama);
    form.setValue("kodeIATA", bandara.kodeIATA);
    form.setValue("kota", bandara.kota);
    form.setValue("negara", bandara.negara);
    form.setValue("jumlahTerminal", bandara.jumlahTerminal);
    form.setValue("alamat", bandara.alamat);
  };

  const onCancel = () => {
    setEditingId(null);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof bandaraSchema>) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const sortedBandaras = bandaras?.sort((a, b) => a.nama.localeCompare(b.nama)) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <Palmtree className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Master Bandara</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola data bandara operasional terdaftar di sistem Horizon Air.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Bandara Aktif</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">{sortedBandaras.length} Bandara</span>
              </CardTitle>
              <CardDescription>Menampilkan seluruh kode IATA dan lokasi fisik bandara.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <Table className="relative">
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">Bandara</TableHead>
                      <TableHead className="font-bold">Kode</TableHead>
                      <TableHead className="font-bold">Lokasi</TableHead>
                      <TableHead className="font-bold">Terminal</TableHead>
                      <TableHead className="font-bold className=hidden md:table-cell">Alamat</TableHead>
                      <TableHead className="text-right font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20">
                          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
                        </TableCell>
                      </TableRow>
                    ) : sortedBandaras.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-slate-500 font-medium">
                          Belum ada data bandara terdaftar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedBandaras.map((b) => (
                        <TableRow key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-bold text-slate-900">{b.nama}</TableCell>
                          <TableCell>
                            <span className="text-xs font-black uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">{b.kodeIATA}</span>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-slate-800 text-xs">{b.kota}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{b.negara}</p>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">{b.jumlahTerminal} Terminal</span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-500 hidden md:table-cell">{b.alamat}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button variant="outline" size="icon" onClick={() => onEdit(b)} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50">
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  if (confirm("Hapus data bandara ini?")) deleteMutation.mutate(b.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
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

        {/* Input Form Card (1/3 width) */}
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 w-full" />
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
              {editingId ? "Ubah Bandara" : "Tambah Bandara"}
            </CardTitle>
            <CardDescription>{editingId ? "Ubah detail informasi bandara." : "Daftarkan terminal bandara baru ke sistem."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-5">
                
                <FormField
                  control={form.control as any}
                  name="nama"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Nama Bandara</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Juanda" {...field} className="h-11 rounded-xl border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="kodeIATA"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold text-slate-600">Kode IATA</FormLabel>
                        <FormControl>
                          <Input placeholder="SUB" maxLength={3} {...field} className="h-11 rounded-xl border-slate-200 uppercase font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="jumlahTerminal"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold text-slate-600">Terminal</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} className="h-11 rounded-xl border-slate-200 font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="kota"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold text-slate-600">Kota</FormLabel>
                        <FormControl>
                          <Input placeholder="Surabaya" {...field} className="h-11 rounded-xl border-slate-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="negara"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold text-slate-600">Negara</FormLabel>
                        <FormControl>
                          <Input placeholder="Indonesia" {...field} className="h-11 rounded-xl border-slate-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control as any}
                  name="alamat"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Jl. Raya Juanda, Sidoarjo" {...field} className="h-11 rounded-xl border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={onCancel} className="gap-1.5 h-11 rounded-xl font-bold">
                    <Undo2 className="h-4 w-4" /> Batal
                  </Button>
                  <Button type="submit" className="bg-slate-950 hover:bg-slate-800 text-white gap-1.5 h-11 rounded-xl font-bold px-6" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <><Save className="h-4 w-4" /> {editingId ? "Perbarui" : "Simpan"}</>
                    )}
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
