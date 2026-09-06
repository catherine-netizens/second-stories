SECOND STORIES - FIX CART

Perbaikan pada versi ini:
1. Tombol "Hapus" sekarang memvalidasi ID dan memastikan database benar-benar menghapus baris cart_items.
2. Frontend menghapus item dari state lokal setelah DELETE berhasil lalu sinkronisasi ulang dari MySQL.
3. Gambar keranjang memakai helper gambar yang sama dengan kartu produk + fallback.
4. CSS gambar keranjang diperkuat agar ukuran gambar selalu 90x90 dan terlihat.
5. Folder node_modules dan file .env tidak disertakan.

CARA MENJALANKAN:
1. Extract ZIP.
2. Buka CMD di:
   Second-Stories\baru\server
3. Jalankan:
   npm install
4. Pastikan MySQL AMMPS aktif dan database second_stories sudah dibuat dari:
   ..\second_stories_database.sql
5. Buat file .env di folder server:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=second_stories
   DB_PORT=3306
   SESSION_SECRET=second_stories_session_secret_2026
   PORT=3000

   Jika MySQL kamu memakai password/port berbeda, isi dengan nilai lokal kamu sendiri.
6. Jalankan:
   npm start
7. Buka:
   http://localhost:3000/cart.html

PENTING:
Jangan membuka cart.html dengan double-click. Jalankan melalui localhost:3000.
