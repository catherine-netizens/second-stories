<div align="center">

# SECOND STORIES
### Give Pre-Loved Things a Second Story

**Submission for ITECHNO CUP 2026 - Web Development**

**By Alpha**

</div>

---

## 👥 Tim Developer

| Nama | Peran | GitHub |
|------|-------|--------|
| **[Darlene Maria Josephine]** | Frontend Developer | [GitHub Username] |
| **[Catherine Nathaniel Wijaya]** | Backend Developer | [catherine-netizens] |
| **[Amelia Phoebe]** | UI/UX Designer | [GitHub Username] |

> Ganti bagian `[Nama Anggota]` dan `[GitHub Username]` dengan data anggota tim yang sebenarnya sebelum submission.

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Unggulan](#-fitur-unggulan)
- [Demo & Screenshot](#-demo--screenshot)
- [Teknologi](#-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Database Schema](#-database-schema)
- [Folder Structure](#-folder-structure)
- [Instalasi & Setup](#-instalasi--setup)
- [Penggunaan](#-penggunaan)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Lisensi](#-lisensi)

---

# 🎯 Tentang Proyek

## Latar Belakang

Penggunaan barang secara berulang dapat membantu memperpanjang masa pakai produk dan mengurangi barang yang berakhir sebagai limbah. Berdasarkan data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN), data tahun 2024 yang berasal dari 317 kabupaten/kota mencatat timbulan sampah sebesar **34.214.607,36 ton per tahun**, dengan **40,26%** tercatat sebagai sampah yang tidak terkelola. Data tersebut menunjukkan bahwa pengelolaan sampah masih menjadi tantangan yang membutuhkan berbagai pendekatan, termasuk penggunaan kembali barang yang masih memiliki nilai. [SIPSN/Kementerian Lingkungan Hidup dan Kehutanan](https://sipsn.menlhk.go.id/sipsn/?q=Kebijakan+kehutanan+pemerintah+Indonesia+dari+masa+ke+masa.)

Pada sektor tekstil, United Nations Environment Programme (UNEP) menyebutkan bahwa sektor tekstil menghasilkan sekitar **2–8% emisi gas rumah kaca global**. UNEP juga mencatat sekitar **92 juta ton limbah tekstil dihasilkan setiap tahun** secara global. Kondisi tersebut memperkuat pentingnya pola konsumsi yang lebih berkelanjutan, termasuk penggunaan kembali dan pembelian barang second-hand. [UNEP](https://www.unep.org/technical-highlight/sustainable-fashion-take-centre-stage-zero-waste-day)

Di sisi lain, proses jual beli barang preloved masih dapat dilakukan melalui berbagai media yang belum secara khusus mengintegrasikan katalog produk, informasi kondisi barang, wishlist, keranjang, checkout, review, dan komunikasi antara buyer dan seller dalam satu tempat.

**Second Stories** dikembangkan sebagai marketplace barang preloved yang memberikan kesempatan kepada barang yang masih layak digunakan untuk mendapatkan pemilik baru dan memiliki “cerita kedua”.

## Solusi yang Ditawarkan

Second Stories merupakan website marketplace yang memungkinkan pengguna membeli maupun menjual barang preloved melalui satu platform. Pengguna dapat menjelajahi produk, melihat informasi dan kondisi barang, menyimpan produk ke wishlist, memasukkannya ke shopping cart, melakukan checkout, memberikan review, serta berkomunikasi dengan seller melalui fitur chat.

Pengguna juga dapat berperan sebagai seller dengan mengunggah barang miliknya sendiri. Sistem backend berbasis Node.js dan Express.js terhubung dengan MySQL untuk menyimpan dan mengelola data pengguna, produk, wishlist, cart, order, review, conversation, dan message.

## Tujuan Proyek

- **Tujuan Utama:** Membuat platform marketplace yang memudahkan pengguna dalam membeli dan menjual barang preloved.
- **Target Pengguna:** Pelajar, mahasiswa, anak muda, dan masyarakat umum yang ingin membeli atau menjual barang bekas yang masih layak digunakan.
- **Value Proposition:** Mempertemukan buyer dan seller dalam satu platform sehingga barang yang masih memiliki nilai dapat digunakan kembali oleh pemilik baru.

---

# ✨ Fitur Unggulan

## Fitur Utama

| Fitur | Deskripsi | Keunggulan |
|---|---|---|
| **Marketplace** | Menampilkan berbagai produk preloved yang tersedia untuk dibeli. | Memudahkan pengguna menemukan barang sesuai kebutuhan. |
| **Product Category** | Mengelompokkan produk berdasarkan kategori. | Membantu pengguna menemukan produk secara lebih terarah. |
| **Product Detail** | Menampilkan informasi lengkap mengenai produk. | Pengguna dapat melihat harga, kondisi, seller, stok, lokasi, foto, dan deskripsi. |
| **Sell Product** | Pengguna dapat mengunggah barang untuk dijual. | Pengguna dapat menjadi buyer sekaligus seller. |
| **Shopping Cart** | Menyimpan produk yang ingin dibeli sebelum checkout. | Memudahkan pengguna mengatur produk dan jumlah pembelian. |
| **Wishlist** | Menyimpan produk yang disukai pengguna. | Produk dapat dilihat kembali tanpa harus mencarinya dari awal. |
| **Checkout & Order** | Mengelola proses pembelian dan menyimpan data order. | Proses pembelian terintegrasi dengan database. |
| **Chat** | Memungkinkan buyer berkomunikasi dengan seller. | Buyer dapat menanyakan informasi produk sebelum membeli. |
| **Review & Rating** | Pengguna dapat memberikan rating dan ulasan setelah membeli produk. | Membantu pengguna lain memperoleh informasi tambahan mengenai produk. |
| **User Profile** | Mengelola informasi pengguna dan aktivitas terkait akun. | Pengguna dapat mengelola profil, produk, order, review, dan percakapan. |

## Fitur Tambahan

- **Register & Login** - Sistem autentikasi untuk mengelola akun pengguna.
- **User Profile** - Pengguna dapat mengubah nama, lokasi, bio, dan informasi profil.
- **Profile Avatar** - Pengguna dapat mengunggah avatar profil.
- **Product Search** - Membantu pengguna menemukan produk berdasarkan nama atau kategori.
- **Category Filtering** - Produk dapat disaring berdasarkan kategori.
- **Price Filtering** - Produk dapat disaring berdasarkan batas harga.
- **Sorting** - Produk dapat diurutkan berdasarkan harga dan waktu penambahan.
- **Stock Management** - Sistem mengelola jumlah stok produk.
- **Cart Quantity Management** - Pengguna dapat mengubah jumlah produk di dalam cart sesuai stok.
- **Order History** - Pengguna dapat melihat riwayat pesanan.
- **Seller Product Management** - Seller dapat melihat barang miliknya, menyembunyikan barang, dan menandai barang sebagai terjual.
- **Conversation Management** - Sistem mengelola percakapan antara buyer dan seller.
- **Message Management** - Pesan disimpan dan dapat ditampilkan kembali dalam conversation.
- **Responsive Interface** - Tampilan dirancang agar dapat digunakan pada berbagai ukuran layar.

---

# 📸 Demo & Screenshot

## Live Demo

Website saat ini dijalankan menggunakan local development server.

```text
http://localhost:3000
```

## Screenshot Aplikasi

Screenshot belum disertakan sebagai file terpisah di repository project. Halaman utama yang tersedia adalah:

- **Homepage** - Menampilkan katalog dan produk unggulan.
- **Category Page** - Menampilkan produk berdasarkan kategori.
- **Product Detail** - Menampilkan detail produk, kondisi, harga, seller, lokasi, stok, dan deskripsi.
- **Shopping Cart** - Menampilkan produk yang dipilih, jumlah, subtotal, dan checkout.
- **Wishlist** - Menampilkan produk yang disimpan pengguna.
- **Sell Product** - Halaman untuk mengunggah barang preloved.
- **Profile** - Menampilkan profil, produk seller, order, review, dan aktivitas pengguna.

## Video Demo

Link video demo: Akan ditambahkan.

---

# ⚙️ Teknologi

## Tech Stack

### Frontend

```text
Framework   : Vanilla HTML5
UI Library  : Custom CSS
State Mgmt  : JavaScript (shared.js dan module halaman)
Validation  : Native HTML validation + JavaScript validation
HTTP Client : Fetch API
```

### Backend

```text
Runtime     : Node.js
Framework   : Express.js
Database    : MySQL
ORM         : None (raw SQL menggunakan mysql2)
Auth        : Express Session + bcrypt
```

### DevOps & Tools

```text
Deployment  : Local Development Server
CI/CD       : None
Testing     : Functional / Manual Testing
Monitoring  : Console Logging
```

### Database

```text
Database    : MySQL
Database Tool : phpMyAdmin
```

## Alasan Pemilihan Teknologi

| Teknologi | Alasan Pemilihan |
|---|---|
| **HTML5** | Digunakan untuk membangun struktur halaman website tanpa framework frontend tambahan. |
| **CSS3** | Digunakan untuk mengatur layout, visual, animasi, dan responsive interface. |
| **JavaScript** | Digunakan untuk interaksi halaman, pengelolaan state sederhana, dan komunikasi dengan API backend. |
| **Fetch API** | Digunakan untuk mengirim request dari frontend ke REST API backend. |
| **Node.js** | Digunakan sebagai runtime untuk menjalankan server backend. |
| **Express.js** | Digunakan untuk membangun server dan REST API. |
| **MySQL** | Digunakan sebagai database utama untuk menyimpan data aplikasi. |
| **mysql2** | Digunakan untuk menghubungkan aplikasi Node.js dengan MySQL dan menjalankan query SQL. |
| **Express Session** | Digunakan untuk mempertahankan session pengguna setelah login. |
| **bcrypt** | Digunakan untuk melakukan hashing dan verifikasi password pengguna. |
| **dotenv** | Digunakan untuk mengelola environment variables seperti konfigurasi database dan session secret. |
| **phpMyAdmin** | Digunakan untuk mengelola dan memonitor database MySQL selama pengembangan. |

## Dependencies Utama

```json
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-session": "^1.19.0",
    "mysql2": "^3.24.3"
  }
}
```

Versi dependencies mengikuti `server/package.json` pada project.

---

# 🏗️ Arsitektur Sistem

## System Architecture

Second Stories menggunakan arsitektur **Client-Server**. Browser menjalankan frontend HTML, CSS, dan JavaScript. Frontend berkomunikasi dengan backend menggunakan Fetch API. Backend menggunakan Node.js dan Express.js untuk menyediakan REST API, mengelola session, menjalankan business logic, dan berkomunikasi dengan MySQL menggunakan mysql2.

```text
                         SECOND STORIES
                               │
                               ▼
                    ┌─────────────────────┐
                    │       USER          │
                    │      Browser        │
                    └──────────┬──────────┘
                               │
                               │ HTTP Request
                               ▼
                    ┌─────────────────────┐
                    │      FRONTEND       │
                    │                     │
                    │ HTML5               │
                    │ CSS3                │
                    │ JavaScript          │
                    │ Fetch API           │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       BACKEND       │
                    │                     │
                    │ Node.js             │
                    │ Express.js          │
                    │ Session Auth        │
                    │ Business Logic      │
                    └──────────┬──────────┘
                               │
                               │ SQL Query
                               ▼
                    ┌─────────────────────┐
                    │      DATABASE       │
                    │       MySQL         │
                    │                     │
                    │ users               │
                    │ products            │
                    │ cart_items          │
                    │ wishlist_items      │
                    │ orders              │
                    │ order_items         │
                    │ reviews             │
                    │ conversations       │
                    │ messages            │
                    └─────────────────────┘
```

## Database Schema

Database Second Stories terdiri dari beberapa tabel yang saling berhubungan melalui foreign key dan relasi antar data pengguna, produk, transaksi, review, serta komunikasi.

```text
users
  │
  ├───────────────┬───────────────┬───────────────┐
  ▼               ▼               ▼               ▼
products      cart_items     wishlist_items     orders
  │                               │               │
  │                               │               ▼
  │                               │          order_items
  ▼                               │
reviews                           │
                                  │
users ─────── conversations ──────┘
                    │
                    ▼
                 messages
```

### Database Tables

#### `users`
Menyimpan data akun pengguna.

- `id`
- `name`
- `email`
- `password`
- `location`
- `bio`
- `avatar`
- `created_at`

#### `products`
Menyimpan data barang preloved yang dijual oleh pengguna.

- `id`
- `seller_id`
- `name`
- `category`
- `condition_name`
- `price`
- `original_price`
- `rating`
- `sold`
- `stock`
- `location`
- `featured`
- `image`
- `gallery`
- `description`
- `ownership`
- `note`
- `status`
- `created_at`

#### `cart_items`
Menyimpan produk yang dimasukkan pengguna ke shopping cart.

#### `wishlist_items`
Menyimpan produk yang disimpan pengguna ke wishlist.

#### `orders`
Menyimpan data transaksi pembelian.

#### `order_items`
Menyimpan produk dan jumlah barang pada setiap order.

#### `reviews`
Menyimpan rating dan komentar pengguna terhadap produk.

#### `conversations`
Menyimpan percakapan antara buyer dan seller.

#### `messages`
Menyimpan pesan yang dikirim di dalam conversation.

---

# 📁 Folder Structure

```text
Second-Stories-CART-FIXED-CLEAN/
│
├── homepage.html
├── category.html
├── product.html
├── profile.html
├── sell.html
├── wishlist.html
├── cart.html
│
├── homepage.js
├── category.js
├── product.js
├── profile.js
├── sell.js
├── wishlist.js
├── cart.js
├── cart_shared.js
├── shared.js
├── products-data.js
│
├── homepage.css
├── category.css
├── product.css
├── profile.css
├── sell.css
├── wishlist.css
├── cart.css
├── shared.css
│
├── second_stories_database.sql
│
└── server/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── seed-data.js
    ├── .env
    └── .env.example
```

---

# ⚙️ Instalasi & Setup

## Prerequisites

Pastikan perangkat telah memiliki:

- **Node.js** versi 18 atau lebih tinggi
- **npm**
- **MySQL**
- **phpMyAdmin**
- **Google Chrome** atau web browser lainnya
- **Git** (opsional)

## Langkah Instalasi

### 1. Clone Repository / Extract Project

Jika project tersedia dalam repository:

```bash
git clone [URL_REPOSITORY]
cd [NAMA_FOLDER_PROJECT]
```

Jika project diperoleh dalam bentuk ZIP, extract project terlebih dahulu.

### 2. Install Dependencies

Masuk ke folder server:

```bash
cd server
npm install
```

### 3. Setup Database

Buka phpMyAdmin dan buat database:

```text
second_stories
```

Kemudian import:

```text
second_stories_database.sql
```

Database memiliki tabel:

```text
users
products
cart_items
wishlist_items
orders
order_items
reviews
conversations
messages
```

### 4. Setup Environment Variables

Buat atau gunakan file:

```text
server/.env
```

Isi konfigurasi sesuai MySQL lokal:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=second_stories
DB_PORT=3306
PORT=3000
SESSION_SECRET=YOUR_SESSION_SECRET
```

Jangan memasukkan password database yang sebenarnya ke repository publik.

### 5. Menjalankan Server

Dari folder `server`:

```bash
npm start
```

Jika berhasil, server berjalan pada:

```text
http://localhost:3000
```

Endpoint pengecekan server dan database:

```text
http://localhost:3000/api/health
```

Respons yang diharapkan:

```json
{"success":true,"message":"Server dan MySQL aktif."}
```

> Jangan membuka file HTML dengan double-click atau Live Server port 5500 karena frontend menggunakan endpoint API dari Express pada port 3000.

---

# 🚀 Penggunaan

## Menjalankan Aplikasi

```bash
cd server
npm start
```

Kemudian buka browser dan akses:

```text
http://localhost:3000
```

## User Guide

### Untuk Pengguna Umum

1. **Registrasi/Login** - Buat akun baru atau login menggunakan akun yang sudah tersedia.
2. **Menjelajahi Produk** - Buka Homepage atau Category untuk melihat barang preloved.
3. **Melihat Detail Produk** - Pilih produk untuk melihat nama, harga, kondisi, rating, seller, lokasi, foto, stok, dan deskripsi.
4. **Wishlist** - Simpan produk yang ingin dipertimbangkan kembali.
5. **Shopping Cart** - Tambahkan produk ke cart dan atur jumlah pembelian.
6. **Checkout** - Masukkan alamat pengiriman dan selesaikan proses checkout.
7. **Order History** - Lihat data pesanan yang telah dibuat melalui profile.
8. **Chat** - Hubungi seller melalui conversation untuk menanyakan produk.
9. **Review & Rating** - Setelah membeli produk, pengguna dapat memberikan rating dan komentar.

### Untuk Seller

1. **Membuat Produk Baru** - Buka halaman Sell dan isi informasi barang.
2. **Menambahkan Foto Produk** - Tambahkan minimal satu foto barang.
3. **Menentukan Harga** - Masukkan harga jual produk.
4. **Menentukan Kondisi** - Pilih kondisi barang sesuai keadaan sebenarnya.
5. **Menentukan Stok** - Tentukan jumlah stok barang yang tersedia.
6. **Menambahkan Informasi Produk** - Isi kategori, lokasi, deskripsi, ownership, dan catatan jika diperlukan.
7. **Mengelola Produk** - Lihat daftar barang yang dimiliki pada profile dan kelola status barang.
8. **Menandai Barang Terjual** - Seller dapat menandai produk sebagai sold sehingga stok menjadi 0 dan produk tidak lagi aktif.
9. **Menghapus dari Etalase** - Seller dapat menyembunyikan produk dari etalase.
10. **Berkomunikasi dengan Buyer** - Seller dapat menerima dan membalas pesan melalui fitur chat.

---

# 📚 API Documentation

## Base URL

```text
http://localhost:3000/api
```

## Endpoints

### Health & Authentication

```http
GET  /api/health
POST /api/register
POST /api/login
POST /api/logout
GET  /api/me
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
DELETE /api/products/:id
PATCH  /api/products/:id/sold
GET    /api/my-products
```

### Profile

```http
GET /api/profile
PUT /api/profile
```

### Cart

```http
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
DELETE /api/cart
```

### Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist/:id
DELETE /api/wishlist/:id
```

### Orders

```http
GET  /api/orders
POST /api/orders
```

### Reviews

```http
GET  /api/products/:id/reviews
POST /api/products/:id/reviews
GET  /api/my-reviews
```

### Conversations & Messages

```http
GET  /api/conversations
POST /api/conversations
POST /api/conversations/:id/messages
```

## Example Request

### Login

```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
```

---

# 🧪 Testing

## Running Tests

Second Stories menggunakan **functional/manual testing**. Pengujian dilakukan secara langsung melalui browser untuk memastikan fitur utama, komunikasi frontend-backend, session, dan penyimpanan data pada MySQL berjalan sesuai kebutuhan.

### Authentication

- [x] Register
- [x] Login
- [x] Logout
- [x] Session pengguna

### Marketplace

- [x] Menampilkan produk
- [x] Product detail
- [x] Category
- [x] Product image
- [x] Product information
- [x] Search dan filtering

### Shopping

- [x] Add to cart
- [x] Remove from cart
- [x] Change quantity
- [x] Wishlist
- [x] Checkout
- [x] Order history

### Seller

- [x] Menambahkan produk
- [x] Menambahkan foto produk
- [x] Mengelola produk
- [x] Menampilkan produk seller
- [x] Menandai produk sebagai sold
- [x] Menyembunyikan produk

### User

- [x] Profile
- [x] Edit profile
- [x] Avatar
- [x] Orders
- [x] Reviews

### Communication

- [x] Membuat conversation
- [x] Menampilkan conversation
- [x] Mengirim message
- [x] Membaca message

## Test Environment

```text
Operating System : Windows
Runtime          : Node.js
Backend          : Express.js
Database         : MySQL
Database Tool    : phpMyAdmin
Browser          : Google Chrome
Server Port      : 3000
```

## Test Coverage

Automated test coverage belum diterapkan pada versi pengembangan ini. Karena project menggunakan functional/manual testing, metrik coverage otomatis dari Jest, Vitest, atau framework sejenis belum tersedia.

```text
Statements : N/A - Manual Testing
Branches   : N/A - Manual Testing
Functions  : N/A - Manual Testing
Lines      : N/A - Manual Testing
```

Pengujian difokuskan pada fungsi utama website dan memastikan komunikasi antara frontend, backend, session, serta database berjalan sesuai kebutuhan.

---

# 📄 Lisensi

Proyek **Second Stories** dibuat untuk keperluan:

**ITECHNO CUP 2026 - Web Development**

Lisensi pada `server/package.json` saat ini tercatat sebagai **ISC**. File `LICENSE` terpisah belum disertakan pada project.

---

<div align="center">

### Give Pre-Loved Things a Second Story
**Made by Alpha for ITECHNO CUP 2026**

</div>
