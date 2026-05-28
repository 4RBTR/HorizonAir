import { MOCK_PROMO } from "@/lib/mock-data";
import axiosInstance from "./axios-instance";

export interface KodePromo {
  id: string;
  kode: string;
  persentaseDiskon: number;
  maksimumDiskon: number;
  berlakuSampai: string;
  deskripsi: string;
}

export const getPromo = async (): Promise<KodePromo[]> => {
  try {
    const response = await axiosInstance.get("/KodePromo");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("API Error, using mock data for Promo");
    return MOCK_PROMO;
  }
};

export const createPromo = async (data: Omit<KodePromo, "id">) => {
  const response = await axiosInstance.post("/KodePromo", data);
  return response.data;
};

export const updatePromo = async (id: string, data: Partial<KodePromo>) => {
  const response = await axiosInstance.put(`/KodePromo/${id}`, data);
  return response.data;
};

export const deletePromo = async (id: string) => {
  const response = await axiosInstance.delete(`/KodePromo/${id}`);
  return response.data;
};
