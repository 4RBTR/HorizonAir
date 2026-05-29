import { MOCK_MASKAPAI } from "@/lib/mock-data";
import axiosInstance from "./axios-instance";

export interface Maskapai {
  id: string;
  nama: string;
  perusahaan: string;
  jumlahKru: number;
  deskripsi: string;
}

export const getMaskapai = async (): Promise<Maskapai[]> => {
  try {
    const response = await axiosInstance.get("/Maskapai");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("API Error in getMaskapai:", error);
    throw error;
  }
};

export const createMaskapai = async (data: Omit<Maskapai, "id">) => {
  const response = await axiosInstance.post("/Maskapai", data);
  return response.data;
};

export const updateMaskapai = async (id: string, data: Partial<Maskapai>) => {
  const response = await axiosInstance.put(`/Maskapai/${id}`, data);
  return response.data;
};

export const deleteMaskapai = async (id: string) => {
  const response = await axiosInstance.delete(`/Maskapai/${id}`);
  return response.data;
};
