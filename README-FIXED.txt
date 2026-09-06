SECOND STORIES - FIXED VERSION
================================

Perbaikan utama:
1. Semua tombol navigasi dan tombol aksi utama tetap terhubung.
2. Login / daftar / logout menggunakan session.
3. Wishlist tersimpan ke MySQL dan badge diperbarui.
4. Keranjang tersimpan ke MySQL, termasuk tambah, kurang, hapus, checkout.
5. Profil sekarang dapat disimpan dengan benar.
6. Tombol ganti foto profil sekarang berfungsi dan menyimpan foto ke database.
7. Jual barang -> preview -> publikasikan ke database.
8. Chat memakai satu percakapan per pasangan pengguna, bukan per produk.
9. Percakapan lama yang duplikat hanya ditampilkan satu kali.
10. Gambar produk memiliki fallback jika URL gambar gagal.
11. Error koneksi database menampilkan kode/pesan yang membantu troubleshooting tanpa menampilkan password.

CARA MENJALANKAN
----------------
1. Pastikan MySQL di AMMPS aktif.
2. Import:
   Second-Stories/baru/second_stories_database.sql
   ke phpMyAdmin.
3. Buka CMD di:
   Second-Stories/baru/server
4. Buat file bernama .env dengan isi:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=second_stories
DB_PORT=3306

SESSION_SECRET=second_stories_session_secret_2026
PORT=3000

Jika MySQL AMMPS kamu memakai password atau port lain, isi DB_PASSWORD/DB_PORT
sesuai konfigurasi AMMPS. Jangan membagikan password tersebut.
5. Jalankan:
   npm install
   npm start
6. Buka:
   http://localhost:3000

CATATAN
-------
File .env sengaja tidak disertakan dalam ZIP hasil perbaikan agar password database
tidak ikut terbawa. node_modules juga tidak disertakan; npm install akan memasangnya.
