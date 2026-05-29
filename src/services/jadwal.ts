import { MOCK_JADWAL } from "@/lib/mock-data";
import axiosInstance from "./axios-instance";
import { Bandara, getBandara } from "./bandara";
import { Maskapai, getMaskapai } from "./maskapai";
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
    const [resJadwal, resStatus, bandaras, maskapais] = await Promise.all([
      axiosInstance.get("/JadwalPenerbangan"),
      axiosInstance.get("/StatusPenerbangan/Jadwal").catch(() => null),
      getBandara().catch(() => []),
      getMaskapai().catch(() => []),
    ]);

    const data = resJadwal.data?.data || resJadwal.data;
    const statusData = resStatus?.data?.data || resStatus?.data || [];

    if (Array.isArray(data)) {
      return data.map((j: any) => {
        // Find matching status from /StatusPenerbangan/Jadwal
        const statusItem = Array.isArray(statusData)
          ? statusData.find((s: any) => String(s.id) === String(j.id))
          : null;

        // Resolve bandaraKeberangkatan
        const bandaraKeberangkatanObj = typeof j.bandaraKeberangkatan === "string"
          ? bandaras.find(b => b.nama.toLowerCase() === j.bandaraKeberangkatan.toLowerCase() || b.kodeIATA.toLowerCase() === j.bandaraKeberangkatan.toLowerCase())
          : j.bandaraKeberangkatan;

        // Resolve bandaraTujuan
        const bandaraTujuanObj = typeof j.bandaraTujuan === "string"
          ? bandaras.find(b => b.nama.toLowerCase() === j.bandaraTujuan.toLowerCase() || b.kodeIATA.toLowerCase() === j.bandaraTujuan.toLowerCase())
          : j.bandaraTujuan;

        // Resolve maskapai
        const maskapaiObj = typeof j.maskapai === "string"
          ? maskapais.find(m => m.nama.toLowerCase() === j.maskapai.toLowerCase())
          : j.maskapai;

        // Parse durasiPenerbangan string (e.g., "1 jam 15 menit" -> 75)
        let durasiMins = j.durasiPenerbanganMenit || 0;
        if (typeof j.durasiPenerbangan === "string") {
          const matchHours = j.durasiPenerbangan.match(/(\d+)\s*jam/);
          const matchMins = j.durasiPenerbangan.match(/(\d+)\s*menit/);
          const hrs = matchHours ? parseInt(matchHours[1]) : 0;
          const mins = matchMins ? parseInt(matchMins[1]) : 0;
          durasiMins = (hrs * 60) + mins;
        } else if (typeof j.durasiPenerbangan === "number") {
          durasiMins = j.durasiPenerbangan;
        }

        // Construct statusTerakhir object
        let normalizedStatus: any = "Sesuai Jadwal";
        if (statusItem?.statusTerakhir) {
          const statusStr = String(statusItem.statusTerakhir).toLowerCase();
          if (statusStr.includes("delay")) normalizedStatus = "Delay";
          else if (statusStr.includes("batal") || statusStr.includes("cancel")) normalizedStatus = "Dibatalkan";
          else if (statusStr.includes("berangkat")) normalizedStatus = "Berangkat";
          else if (statusStr.includes("mendarat")) normalizedStatus = "Mendarat";
        }

        return {
          ...j,
          bandaraKeberangkatanId: bandaraKeberangkatanObj?.id || "",
          bandaraTujuanId: bandaraTujuanObj?.id || "",
          maskapaiId: maskapaiObj?.id || "",
          bandaraKeberangkatan: bandaraKeberangkatanObj,
          bandaraTujuan: bandaraTujuanObj,
          maskapai: maskapaiObj,
          durasiPenerbanganMenit: durasiMins,
          statusTerakhir: {
            id: statusItem?.id ? String(statusItem.id) : String(j.id),
            jadwalPenerbanganId: String(j.id),
            status: normalizedStatus,
            waktuPerubahan: statusItem?.terakhirDiubah || "-",
          }
        };
      });
    }
    return [];
  } catch (error) {
    console.error("API Error in getJadwal:", error);
    throw error;
  }
};

export const createJadwal = async (data: Omit<JadwalPenerbangan, "id">) => {
  const [bandaras, maskapais] = await Promise.all([
    getBandara().catch(() => []),
    getMaskapai().catch(() => []),
  ]);

  const bandaraKeberangkatanObj = bandaras.find(b => b.id === data.bandaraKeberangkatanId);
  const bandaraTujuanObj = bandaras.find(b => b.id === data.bandaraTujuanId);
  const maskapaiObj = maskapais.find(m => m.id === data.maskapaiId);

  const payload = {
    kodePenerbangan: data.kodePenerbangan,
    bandaraKeberangkatan: bandaraKeberangkatanObj?.nama || "",
    bandaraTujuan: bandaraTujuanObj?.nama || "",
    maskapai: maskapaiObj?.nama || "",
    tanggal: data.tanggalKeberangkatan,
    waktuKeberangkatan: data.waktuKeberangkatan,
    durasiPenerbangan: data.durasiPenerbanganMenit,
    hargaPerTiket: data.hargaPerTiket,
  };

  const response = await axiosInstance.post("/JadwalPenerbangan", payload);
  return response.data;
};

export const updateJadwal = async (id: string, data: Partial<JadwalPenerbangan>) => {
  const [bandaras, maskapais] = await Promise.all([
    getBandara().catch(() => []),
    getMaskapai().catch(() => []),
  ]);

  const bandaraKeberangkatanObj = bandaras.find(b => b.id === data.bandaraKeberangkatanId);
  const bandaraTujuanObj = bandaras.find(b => b.id === data.bandaraTujuanId);
  const maskapaiObj = maskapais.find(m => m.id === data.maskapaiId);

  const payload: any = {};
  if (data.kodePenerbangan !== undefined) payload.kodePenerbangan = data.kodePenerbangan;
  if (bandaraKeberangkatanObj) payload.bandaraKeberangkatan = bandaraKeberangkatanObj.nama;
  if (bandaraTujuanObj) payload.bandaraTujuan = bandaraTujuanObj.nama;
  if (maskapaiObj) payload.maskapai = maskapaiObj.nama;
  if (data.tanggalKeberangkatan !== undefined) payload.tanggal = data.tanggalKeberangkatan;
  if (data.waktuKeberangkatan !== undefined) payload.waktuKeberangkatan = data.waktuKeberangkatan;
  if (data.durasiPenerbanganMenit !== undefined) payload.durasiPenerbangan = data.durasiPenerbanganMenit;
  if (data.hargaPerTiket !== undefined) payload.hargaPerTiket = data.hargaPerTiket;

  const response = await axiosInstance.put(`/JadwalPenerbangan/${id}`, payload);
  return response.data;
};

export const deleteJadwal = async (id: string) => {
  const response = await axiosInstance.delete(`/JadwalPenerbangan/${id}`);
  return response.data;
};
