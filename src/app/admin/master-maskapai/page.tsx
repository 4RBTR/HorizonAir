"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaskapai, createMaskapai, updateMaskapai, deleteMaskapai, Maskapai } from "@/services/maskapai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Undo2, Save, Plane, Users, Briefcase } from "lucide-react";

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

const maskapaiSchema = z.object({
  nama: z.string().min(1, "Nama maskapai wajib diisi"),
  perusahaan: z.string().min(1, "Perusahaan wajib diisi"),
  jumlahKru: z.coerce.number().min(1, "Minimal 1 kru"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
});

export default function MasterMaskapaiPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: maskapais, isLoading: isTableLoading } = useQuery({
    queryKey: ["maskapai"],
    queryFn: getMaskapai,
  });

  const form = useForm<z.infer<typeof maskapaiSchema>>({
    resolver: zodResolver(maskapaiSchema) as any,
    defaultValues: {
      nama: "",
      perusahaan: "",
      jumlahKru: 1,
      deskripsi: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createMaskapai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maskapai"] });
      toast.success("Maskapai berhasil ditambahkan");
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menambah maskapai"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Maskapai> }) => updateMaskapai(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maskapai"] });
      toast.success("Maskapai berhasil diperbarui");
      setEditingId(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal memperbarui maskapai"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaskapai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maskapai"] });
      toast.success("Maskapai berhasil dihapus");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal menghapus maskapai"),
  });

  const onEdit = (maskapai: Maskapai) => {
    setEditingId(maskapai.id);
    form.setValue("nama", maskapai.nama);
    form.setValue("perusahaan", maskapai.perusahaan);
    form.setValue("jumlahKru", maskapai.jumlahKru);
    form.setValue("deskripsi", maskapai.deskripsi);
  };

  const onCancel = () => {
    setEditingId(null);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof maskapaiSchema>) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const sortedMaskapais = maskapais?.sort((a, b) => a.nama.localeCompare(b.nama)) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <Plane className="h-6 w-6 text-blue-600 rotate-45" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Master Maskapai</h1>
          <p className="text-slate-500 text-sm font-medium">Kelola seluruh armada pesawat dan kapasitas kru penerbangan.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Armada Aktif</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">{sortedMaskapais.length} Maskapai</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-bold">Maskapai</TableHead>
                      <TableHead className="font-bold">Perusahaan Induk</TableHead>
                      <TableHead className="font-bold">Jumlah Kru</TableHead>
                      <TableHead className="font-bold">Deskripsi</TableHead>
                      <TableHead className="text-right font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                    ) : sortedMaskapais.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-500 font-medium">Belum ada maskapai terdaftar.</TableCell></TableRow>
                    ) : (
                      sortedMaskapais.map((m) => (
                        <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-bold text-slate-900">{m.nama}</TableCell>
                          <TableCell className="text-xs font-semibold text-slate-600">{m.perusahaan}</TableCell>
                          <TableCell>
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit">
                              <Users className="h-3 w-3 text-slate-500" /> {m.jumlahKru} Kru
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-slate-500">{m.deskripsi}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button variant="outline" size="icon" onClick={() => onEdit(m)} className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" /></Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  if (confirm("Hapus armada maskapai ini?")) deleteMutation.mutate(m.id);
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

        {/* Input Form Card */}
        <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 w-full" />
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
              {editingId ? "Ubah Maskapai" : "Tambah Maskapai"}
            </CardTitle>
            <CardDescription>Sesuaikan detail kapasitas kru maskapai.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-5">
                
                <FormField
                  control={form.control as any}
                  name="nama"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Nama Maskapai</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Horizon Express" {...field} className="h-11 rounded-xl border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="perusahaan"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Perusahaan Induk</FormLabel>
                      <FormControl>
                        <Input placeholder="PT Horizon Air Indonesia" {...field} className="h-11 rounded-xl border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="jumlahKru"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Jumlah Kru Aktif</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} className="h-11 rounded-xl border-slate-200 font-bold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="deskripsi"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-bold text-slate-600">Deskripsi Armada</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Fasilitas kabin utama dan rute utama maskapai ini..." 
                          className="resize-none rounded-xl border-slate-200 h-24"
                          {...field} 
                        />
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
