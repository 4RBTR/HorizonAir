import { MOCK_JADWAL } from "@/lib/mock-data";
import axiosInstance from "./axios-instance";
import { Bandara } from "./bandara";
import { Maskapai } from "./maskapai";
import { StatusPenerbangan } from "./status";

export interface JadwalPenerbangan {
  id: string;
  kodePenerbangan: string;
  bandaraKeberangkatanId: string;
  bandaraTujuanId: string;
  maskapaiId: string;
  tanggalKeberangkatan: string;
  waktuKeberangkatan: string;
  durasiPenerbanganMenit: number;
  hargaPerTiket: number;
  // Included for display
  bandaraKeberangkatan?: Bandara;
  bandaraTujuan?: Bandara;
  maskapai?: Maskapai;
  statusTerakhir?: StatusPenerbangan;
}

export const getJadwal = async (): Promise<JadwalPenerbangan[]> => {
  try {
    const response = await axiosInstance.get("/JadwalPenerbangan");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("API Error, using mock data for Jadwal");
    return MOCK_JADWAL;
  }
};

export const createJadwal = async (data: Omit<JadwalPenerbangan, "id">) => {
  const response = await axiosInstance.post("/JadwalPenerbangan", data);
  return response.data;
};

export const updateJadwal = async (id: string, data: Partial<JadwalPenerbangan>) => {
  const response = await axiosInstance.put(`/JadwalPenerbangan/${id}`, data);
  return response.data;
};

export const deleteJadwal = async (id: string) => {
  const response = await axiosInstance.delete(`/JadwalPenerbangan/${id}`);
  return response.data;
};
