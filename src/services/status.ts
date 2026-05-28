import axiosInstance from "./axios-instance";

export interface StatusPenerbangan {
  id: string;
  jadwalPenerbanganId: string;
  status: "Sesuai Jadwal" | "Delay" | "Dibatalkan" | "Berangkat" | "Mendarat";
  perkiraanDurasiDelayMenit?: number;
  waktuPerubahan: string;
}

export const updateStatusPenerbangan = async (data: Omit<StatusPenerbangan, "id" | "waktuPerubahan">) => {
  const response = await axiosInstance.post(`/StatusPenerbangan/${data.jadwalPenerbanganId}`, {
    statusPenerbangan: data.status,
    durasiDelay: data.perkiraanDurasiDelayMenit || 0,
  });
  return response.data;
};

export const getStatusTerakhir = async (jadwalId: string): Promise<StatusPenerbangan | null> => {
  try {
    const response = await axiosInstance.get(`/StatusPenerbangan`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      const match = list
        .filter((s: any) => String(s.jadwalPenerbanganId) === String(jadwalId))
        .sort((a: any, b: any) => new Date(b.waktuPerubahan).getTime() - new Date(a.waktuPerubahan).getTime())[0];
      return match || null;
    }
    return null;
  } catch (error) {
    return null;
  }
};
