# Horizon Air - Sistem Informasi Tiket Penerbangan

Horizon Air adalah aplikasi web pemesanan tiket penerbangan modern kelas eksekutif yang dikembangkan sebagai **Project UKL (Ujian Kompetensi Keahlian) SMK Telkom Malang**. 

Aplikasi ini mengintegrasikan portal pencarian tiket penerbangan bagi pelanggan (Customer) serta panel kontrol manajemen penerbangan bagi administrator (Admin).

---

## 🚀 Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi modern berikut:

- **Core & Routing:** [Next.js 16 (App Router)](https://nextjs.org) & [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com)
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org) (dengan JWT Session & Interceptor token otomatis)
- **State Management & Fetching:** [TanStack React Query v5](https://tanstack.com/query) & [Axios](https://axios-http.com)
- **Visuals & Icons:** [Lucide Icons](https://lucide.dev) & Animasi transisi custom CSS
- **Date Helpers:** [date-fns](https://date-fns.org)
- **Notifications:** [Sonner](https://sonner.dev)

---

## 🌟 Fitur Utama

### ✈️ Portal Pelanggan (Customer Experience)
- **Landing / Welcome Page:** Tampilan beranda premium dengan visual petualangan, lencana promo interaktif, dan navigasi langsung ke halaman register.
- **Flight Search Portal:** Antarmuka pencarian tiket dengan filter pencarian instan rute keberangkatan, tujuan, tanggal, dan jumlah penumpang.
- **Flight Search Results:** Dilengkapi visual **timeline penerbangan grafik**, indikator bagasi gratis (20kg), status makanan kabin (snack), fasilitas WiFi, serta tag perlindungan refund.
- **Voucher Promo & Checkout:** Form pengisian data penumpang terstruktur lengkap dengan kalkulasi potongan harga kupon otomatis pada invoice pembayaran.
- **E-Tiket & Tiket Saya:** Menggunakan *dynamic local serialization fallback* (`localStorage`) untuk menyimpan data lengkap tiket yang berhasil dipesan agar tetap dapat ditampilkan di riwayat tiket secara instan.

### 🛠️ Panel Administrator (Admin Operations)
- **Operational Dashboard:** Dasbor visual ringkasan data bandara, jadwal terbang, status live server database (Supabase) dan service API (Railway).
- **Master Bandara (Airports):** CRUD data bandara lengkap dengan kode IATA, lokasi kota/negara, dan kapasitas terminal.
- **Master Maskapai (Airlines):** CRUD armada maskapai, detail perusahaan induk, dan jumlah kru aktif.
- **Master Jadwal Penerbangan (Schedules):** Penjadwalan terbang, pemilihan asal-tujuan, dan kalkulasi durasi jam/menit terbang.
- **Master Kode Promo (Vouchers):** Pengaturan kode kupon diskon persentase dan batas maksimal potongan.
- **Ubah Status Penerbangan:** Dasbor pembaruan live status delay, berangkat, mendarat, atau pembatalan terbang.

---

## 🛠️ Langkah Menjalankan Project

### 1. Salin Environment Variables
Buat berkas `.env.local` di root direktori proyek Anda dan isikan konfigurasi berikut:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Mode Development
```bash
npm run dev
```
Buka browser Anda dan akses halaman [http://localhost:3000](http://localhost:3000).

---

## 🖥️ Hak Akses Login Akun (Demo/Uji Coba)

Karena sistem backend belum memiliki validator role bawaan pada database, frontend memetakan hak akses secara dinamis berdasarkan username yang diautentikasi:
- **Akun Administrator:** Username mengandung kata **`admin`** (Contoh: `admin`, `admin123`) -> Otomatis diarahkan ke panel dasbor `/admin`.
- **Akun Pelanggan (Customer):** Username bebas selain admin -> Diarahkan ke portal `/customer`.
