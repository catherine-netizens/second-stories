# Second Stories — MySQL Full-Stack Version

Versi ini mempertahankan HTML/CSS dari project asli dan memindahkan data aplikasi dari `localStorage`/data statis ke Node.js + Express + MySQL.

## Yang sudah terhubung ke MySQL
- Register, login, logout, session
- Katalog produk dan detail produk
- Wishlist
- Keranjang
- Checkout + order history
- Jual barang / Barang Saya
- Tandai barang terjual / hapus barang
- Profil + edit profil + avatar
- Review produk (read/write API)
- Percakapan + pesan

## Catatan keamanan
- Foto produk disimpan sebagai data URL di MySQL karena ini versi prototype sekolah.
- Foto KTP hanya dipakai untuk validasi/preview di browser dan **tidak disimpan ke database**.
- Untuk production, gunakan object storage untuk gambar dan session store/database yang proper.

## Instalasi

### 1. Buat database
Buka phpMyAdmin → tab **Import** → pilih `second_stories_database.sql` → jalankan.

### 2. Atur `.env`
Buka `server/.env` dan isi password MySQL milik komputer kamu pada `DB_PASSWORD`.
Jangan upload `.env` ke GitHub.

### 3. Install package
Di terminal:

```bash
cd server
npm install
```

### 4. Jalankan server

```bash
node server.js
```

Jika berhasil:

```text
Database berhasil terhubung!
Seed 18 produk demo berhasil.
Server berjalan di http://localhost:3000
```

### 5. Buka website
Gunakan:

`http://localhost:3000`

**Jangan** membuka HTML dengan double-click atau Live Server port 5500, karena endpoint `/api/...` harus menuju Express port 3000.

### 6. Tes server
Buka:

`http://localhost:3000/api/health`

Hasil yang benar:

```json
{"success":true,"message":"Server dan MySQL aktif."}
```

Untuk kondisi belum login:

`http://localhost:3000/api/me`

akan memberi JSON dengan `success:false` dan pesan `Belum login.`

## Akun demo seller
Server membuat akun seller demo otomatis saat tabel produk masih kosong. Password demo adalah `demo1234`. Untuk akun pembeli, gunakan menu Daftar.
