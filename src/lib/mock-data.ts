import { Bandara } from "@/services/bandara";
import { Maskapai } from "@/services/maskapai";
import { JadwalPenerbangan } from "@/services/jadwal";
import { KodePromo } from "@/services/promo";

export const MOCK_BANDARA: Bandara[] = [
  { id: "1", nama: "Juanda", kodeIATA: "SUB", kota: "Surabaya", negara: "Indonesia", jumlahTerminal: 2, alamat: "Jl. Raya Juanda" },
  { id: "2", nama: "Soekarno-Hatta", kodeIATA: "CGK", kota: "Jakarta", negara: "Indonesia", jumlahTerminal: 3, alamat: "Tangerang, Banten" },
  { id: "3", nama: "Ngurah Rai", kodeIATA: "DPS", kota: "Denpasar", negara: "Indonesia", jumlahTerminal: 2, alamat: "Tuban, Bali" },
  { id: "4", nama: "Changi Airport", kodeIATA: "SIN", kota: "Singapore", negara: "Singapore", jumlahTerminal: 4, alamat: "Airport Blvd" },
];

export const MOCK_MASKAPAI: Maskapai[] = [
  { id: "1", nama: "Horizon Express", perusahaan: "PT Horizon Air Indonesia", jumlahKru: 120, deskripsi: "Layanan premium antar kota." },
  { id: "2", nama: "Sky Blue", perusahaan: "Sky Group", jumlahKru: 85, deskripsi: "Maskapai bertarif rendah kualitas bintang 5." },
  { id: "3", nama: "Garuda Indonesia", perusahaan: "PT Garuda Indonesia", jumlahKru: 500, deskripsi: "Maskapai nasional kebanggaan bangsa." },
];

export const MOCK_JADWAL: JadwalPenerbangan[] = [
  { 
    id: "1", 
    kodePenerbangan: "HX-0101", 
    bandaraKeberangkatanId: "1", 
    bandaraTujuanId: "2", 
    maskapaiId: "1", 
    tanggalKeberangkatan: "2026-06-01", 
    waktuKeberangkatan: "08:00", 
    durasiPenerbanganMenit: 90, 
    hargaPerTiket: 850000,
    bandaraKeberangkatan: MOCK_BANDARA[0],
    bandaraTujuan: MOCK_BANDARA[1],
    maskapai: MOCK_MASKAPAI[0]
  },
  { 
    id: "2", 
    kodePenerbangan: "SB-0502", 
    bandaraKeberangkatanId: "2", 
    bandaraTujuanId: "3", 
    maskapaiId: "2", 
    tanggalKeberangkatan: "2026-06-02", 
    waktuKeberangkatan: "13:45", 
    durasiPenerbanganMenit: 110, 
    hargaPerTiket: 1200000,
    bandaraKeberangkatan: MOCK_BANDARA[1],
    bandaraTujuan: MOCK_BANDARA[2],
    maskapai: MOCK_MASKAPAI[1]
  },
];

export const MOCK_PROMO: KodePromo[] = [
  { id: "1", kode: "HORIZON2026", persentaseDiskon: 20, maksimumDiskon: 50000, berlakuSampai: "2026-12-31", deskripsi: "Diskon spesial member baru." },
  { id: "2", kode: "LIBURANSERU", persentaseDiskon: 10, maksimumDiskon: 100000, berlakuSampai: "2026-07-01", deskripsi: "Promo liburan sekolah." },
];
