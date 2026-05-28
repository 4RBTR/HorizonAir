import { MOCK_BANDARA } from "@/lib/mock-data";
import axiosInstance from "./axios-instance";

export interface Bandara {
  id: string;
  nama: string;
  kodeIATA: string;
  kota: string;
  negara: string;
  jumlahTerminal: number;
  alamat: string;
}

export const getBandara = async (): Promise<Bandara[]> => {
  try {
    const response = await axiosInstance.get("/Bandara");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("API Error, using mock data for Bandara");
    return MOCK_BANDARA;
  }
};

export const createBandara = async (data: Omit<Bandara, "id">) => {
  const response = await axiosInstance.post("/Bandara", data);
  return response.data;
};

export const updateBandara = async (id: string, data: Partial<Bandara>) => {
  const response = await axiosInstance.put(`/Bandara/${id}`, data);
  return response.data;
};

export const deleteBandara = async (id: string) => {
  const response = await axiosInstance.delete(`/Bandara/${id}`);
  return response.data;
};
