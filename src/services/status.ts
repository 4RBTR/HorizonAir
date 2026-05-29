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
    const response = await axiosInstance.get(`/StatusPenerbangan/Jadwal`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      const match = list.find((s: any) => String(s.id) === String(jadwalId));
      if (match) {
        let normalizedStatus: any = "Sesuai Jadwal";
        if (match.statusTerakhir) {
          const statusStr = String(match.statusTerakhir).toLowerCase();
          if (statusStr.includes("delay")) normalizedStatus = "Delay";
          else if (statusStr.includes("batal") || statusStr.includes("cancel")) normalizedStatus = "Dibatalkan";
          else if (statusStr.includes("berangkat")) normalizedStatus = "Berangkat";
          else if (statusStr.includes("mendarat")) normalizedStatus = "Mendarat";
        }
        return {
          id: String(match.id),
          jadwalPenerbanganId: String(match.id),
          status: normalizedStatus,
          waktuPerubahan: match.terakhirDiubah || "-",
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
