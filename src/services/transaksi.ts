import axiosInstance from "./axios-instance";

export interface Transaksi {
  id: string;
  jadwalPenerbanganId: string;
  kodePromo?: string | null;
  totalHarga: number;
  jumlahPenumpang: number;
  tanggalTransaksi: string;
  penumpang: {
    titel: string;
    namaLengkap: string;
  }[];
}

export const createTransaksi = async (data: {
  jadwalPenerbanganId: string;
  kodePromo?: string | null;
  penumpang: {
    titel: string;
    namaLengkap: string;
  }[];
  jadwalPenerbangan?: any;
  totalHarga?: number;
}) => {
  const response = await axiosInstance.post(`/Tiket/Beli/${data.jadwalPenerbanganId}`, {
    kodePromo: data.kodePromo || null,
    penumpang: data.penumpang,
  });
  
  // Save to local storage for Tiket Saya page fallback
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("horizon_tickets");
      const list = stored ? JSON.parse(stored) : [];
      list.push({
        id: response.data?.id || Math.random().toString(36).substr(2, 9),
        jadwalPenerbanganId: data.jadwalPenerbanganId,
        kodePromo: data.kodePromo,
        penumpang: data.penumpang,
        jumlahPenumpang: data.penumpang.length,
        totalHarga: data.totalHarga || 0,
        tanggalTransaksi: new Date().toISOString(),
        jadwalPenerbangan: data.jadwalPenerbangan,
      });
      localStorage.setItem("horizon_tickets", JSON.stringify(list));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  return response.data;
};

export const getTiketSaya = async (): Promise<any[]> => {
  try {
    // Attempt backend call if there's any undocumented, otherwise return local + mock
    const response = await axiosInstance.get("/transaksi/me").catch(() => null);
    if (response && response.data) return response.data;
    
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("horizon_tickets");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    return [];
  }
};
