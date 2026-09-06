const SS_CATEGORIES = [
  { name: "Fashion", icon: "👗" },
  { name: "Tas & Aksesoris", icon: "👜" },
  { name: "Elektronik", icon: "📷" },
  { name: "Rumah Tangga", icon: "💡" },
  { name: "Hobi & Koleksi", icon: "📸" },
  { name: "Buku & Majalah", icon: "📖" },
];
const SS_CONDITIONS = ["Sangat Baik", "Baik", "Cukup", "Perlu Perbaikan"];
const SS_PRODUCTS = [
  {
    id: 1, name: "Jaket Denim Vintage", category: "Fashion", condition: "Baik",
    price: 95000, originalPrice: 150000, rating: 4.8, sold: 34, stock: 3,
    location: "Surabaya", featured: true,
    img: "https://picsum.photos/seed/denimjacket/500/500",
    gallery: ["https://picsum.photos/seed/denimjacket/500/500", "https://picsum.photos/seed/denimjacketback/500/500", "https://picsum.photos/seed/denimjacketdetail/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Jaket denim vintage warna biru washed, bahan tebal dan awet. Dipakai kurang dari 6 bulan, tidak ada noda atau sobek. Cocok untuk gaya kasual sehari-hari maupun campur gaya streetwear."
  },
  {
    id: 7, name: "Sepatu Sneakers Retro", category: "Fashion", condition: "Sangat Baik",
    price: 180000, originalPrice: 320000, rating: 4.7, sold: 21, stock: 2,
    location: "Malang", featured: true,
    img: "https://picsum.photos/seed/retrosneakers/500/500",
    gallery: ["https://picsum.photos/seed/retrosneakers/500/500", "https://picsum.photos/seed/retrosneakerside/500/500", "https://picsum.photos/seed/retrosneakersole/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Sneakers retro ukuran 42, jarang dipakai (masih seperti baru). Sol masih tebal, warna belum pudar. Lengkap dengan kotak sepatu aslinya."
  },
  {
    id: 11, name: "Celana Jeans Straight", category: "Fashion", condition: "Baik",
    price: 100000, rating: 4.5, sold: 15, stock: 4,
    location: "Surabaya",
    img: "https://picsum.photos/seed/celanajeansstraight/500/500",
    gallery: ["https://picsum.photos/seed/celanajeansstraight/500/500", "https://picsum.photos/seed/jeansdetail/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Celana jeans straight cut ukuran 30, warna dark wash. Nyaman dipakai, bahan tidak melar."
  },
  {
    id: 2, name: "Tas Kulit Asli", category: "Tas & Aksesoris", condition: "Sangat Baik",
    price: 120000, originalPrice: 210000, rating: 4.9, sold: 40, stock: 1,
    location: "Surabaya", featured: true,
    img: "https://picsum.photos/seed/leatherbag/500/500",
    gallery: ["https://picsum.photos/seed/leatherbag/500/500", "https://picsum.photos/seed/leatherbaginside/500/500", "https://picsum.photos/seed/leatherbagstrap/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Tas kulit asli warna cokelat tua, jahitan rapi dan kuat. Muat laptop 13 inci. Ada sedikit bekas pemakaian wajar di bagian bawah, tidak mengurangi fungsi."
  },
  {
    id: 9, name: "Ransel Kanvas Hitam", category: "Tas & Aksesoris", condition: "Baik",
    price: 200000, rating: 4.6, sold: 18, stock: 3,
    location: "Bandung",
    img: "https://picsum.photos/seed/ranselkanvas/500/500",
    gallery: ["https://picsum.photos/seed/ranselkanvas/500/500", "https://picsum.photos/seed/ranselkanvasisi/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Ransel kanvas kokoh, banyak kompartemen, cocok untuk kuliah atau kerja harian."
  },
  {
    id: 12, name: "Jam Tangan Analog", category: "Tas & Aksesoris", condition: "Sangat Baik",
    price: 300000, originalPrice: 450000, rating: 4.9, sold: 12, stock: 1,
    location: "Surabaya",
    img: "https://picsum.photos/seed/jamtangananalog/500/500",
    gallery: ["https://picsum.photos/seed/jamtangananalog/500/500", "https://picsum.photos/seed/jamtangandial/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Jam tangan analog tali kulit, mesin masih akurat, baterai baru diganti. Kondisi mulus tanpa baret berarti."
  },
  {
    id: 3, name: "Kamera Instax Mini 8", category: "Elektronik", condition: "Baik",
    price: 750000, originalPrice: 950000, rating: 4.8, sold: 27, stock: 2,
    location: "Jakarta", featured: true,
    img: "https://picsum.photos/seed/instaxcamera/500/500",
    gallery: ["https://picsum.photos/seed/instaxcamera/500/500", "https://picsum.photos/seed/instaxcamerabox/500/500", "https://picsum.photos/seed/instaxfilm/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Kamera Instax Mini 8 warna putih, lengkap dengan tali gantung. Fungsi normal semua, cocok untuk hobi foto instan."
  },
  {
    id: 5, name: "Mesin Kopi Bekas", category: "Elektronik", condition: "Baik",
    price: 250000, originalPrice: 400000, rating: 4.6, sold: 9, stock: 1,
    location: "Surabaya", featured: true,
    img: "https://picsum.photos/seed/coffeemachine/500/500",
    gallery: ["https://picsum.photos/seed/coffeemachine/500/500", "https://picsum.photos/seed/coffeemachinetop/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Mesin kopi rumahan, sudah dites masih menyala dan berfungsi normal. Cocok untuk pemula belajar bikin kopi di rumah."
  },
  {
    id: 8, name: "Kamera Canon EOS 600D", category: "Elektronik", condition: "Sangat Baik",
    price: 2500000, originalPrice: 3200000, rating: 4.9, sold: 6, stock: 1,
    location: "Surabaya",
    img: "https://picsum.photos/seed/canoncam600d/500/500",
    gallery: ["https://picsum.photos/seed/canoncam600d/500/500", "https://picsum.photos/seed/canoncam600dlensa/500/500", "https://picsum.photos/seed/canoncam600dlayar/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Kamera DSLR Canon EOS 600D body + lensa kit 18-55mm. Shutter count rendah, sensor bersih, semua fungsi normal. Lengkap dengan charger dan tas kamera."
  },
  {
    id: 6, name: "Skateboard Second", category: "Hobi & Koleksi", condition: "Cukup",
    price: 350000, rating: 4.4, sold: 8, stock: 2,
    location: "Malang", featured: true,
    img: "https://picsum.photos/seed/skateboardstreet/500/500",
    gallery: ["https://picsum.photos/seed/skateboardstreet/500/500", "https://picsum.photos/seed/skateboardwheels/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Skateboard deck maple, roda masih halus meluncur. Ada beberapa goresan wajar pemakaian tapi struktur masih kokoh."
  },
  {
    id: 10, name: "Pemutar Piringan Hitam", category: "Hobi & Koleksi", condition: "Baik",
    price: 350000, originalPrice: 500000, rating: 4.9, sold: 5, stock: 1,
    location: "Surabaya",
    img: "https://picsum.photos/seed/piringanhitam/500/500",
    gallery: ["https://picsum.photos/seed/piringanhitam/500/500", "https://picsum.photos/seed/piringanhitamdetail/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Turntable vinyl klasik, suara masih jernih dan stabil. Cocok untuk kolektor musik vinyl."
  },
  {
    id: 13, name: "Set Kartu Koleksi Vintage", category: "Hobi & Koleksi", condition: "Sangat Baik",
    price: 90000, rating: 4.7, sold: 22, stock: 5,
    location: "Bandung",
    img: "https://picsum.photos/seed/vintagecardset/500/500",
    gallery: ["https://picsum.photos/seed/vintagecardset/500/500", "https://picsum.photos/seed/vintagecardsetback/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Kumpulan kartu koleksi jadul, kondisi masih rapi dalam album pelindung."
  },
  {
    id: 4, name: "Atomic Habits", category: "Buku & Majalah", condition: "Sangat Baik",
    price: 45000, originalPrice: 98000, rating: 4.9, sold: 61, stock: 6,
    location: "Surabaya", featured: true,
    img: "https://picsum.photos/seed/atomichabitsbook/500/500",
    gallery: ["https://picsum.photos/seed/atomichabitsbook/500/500", "https://picsum.photos/seed/atomichabitspage/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Buku Atomic Habits by James Clear, cover masih mulus, halaman lengkap tanpa coretan. Bacaan wajib soal membangun kebiasaan baik."
  },
  {
    id: 14, name: "Majalah National Geographic Edisi Lawas", category: "Buku & Majalah", condition: "Baik",
    price: 25000, rating: 4.5, sold: 14, stock: 8,
    location: "Yogyakarta",
    img: "https://picsum.photos/seed/natgeomagazine/500/500",
    gallery: ["https://picsum.photos/seed/natgeomagazine/500/500", "https://picsum.photos/seed/natgeopage/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Majalah National Geographic edisi lawas, kondisi kertas masih bagus, cocok untuk koleksi."
  },
  {
    id: 15, name: "Novel Laskar Pelangi", category: "Buku & Majalah", condition: "Cukup",
    price: 30000, rating: 4.6, sold: 28, stock: 4,
    location: "Surabaya",
    img: "https://picsum.photos/seed/novellaskarpelangi/500/500",
    gallery: ["https://picsum.photos/seed/novellaskarpelangi/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Novel Laskar Pelangi, sedikit bekas lipatan di cover tapi halaman lengkap dan nyaman dibaca."
  },
  {
    id: 16, name: "Lampu Meja Vintage", category: "Rumah Tangga", condition: "Baik",
    price: 120000, originalPrice: 180000, rating: 4.7, sold: 19, stock: 3,
    location: "Surabaya", featured: true,
    img: "https://picsum.photos/seed/lampuvintage/500/500",
    gallery: ["https://picsum.photos/seed/lampuvintage/500/500", "https://picsum.photos/seed/lampuvintagenyala/500/500"],
    seller: { name: "Darlene", avatar: "https://picsum.photos/seed/darleneprofile/100/100", rating: 4.8 },
    description: "Lampu meja bergaya vintage, kabel masih aman, cahaya hangat cocok untuk sudut baca."
  },
  {
    id: 17, name: "Set Peralatan Dapur Enamel", category: "Rumah Tangga", condition: "Sangat Baik",
    price: 175000, rating: 4.8, sold: 11, stock: 2,
    location: "Malang",
    img: "https://picsum.photos/seed/enamelkitchenset/500/500",
    gallery: ["https://picsum.photos/seed/enamelkitchenset/500/500", "https://picsum.photos/seed/enamelpan/500/500"],
    seller: { name: "Retro Corner ID", avatar: "https://picsum.photos/seed/retrocornerid/100/100", rating: 4.8 },
    description: "Set peralatan masak enamel, tidak gompal, masih layak pakai harian."
  },
  {
    id: 18, name: "Kursi Rotan Klasik", category: "Rumah Tangga", condition: "Cukup",
    price: 275000, originalPrice: 450000, rating: 4.5, sold: 7, stock: 1,
    location: "Yogyakarta",
    img: "https://picsum.photos/seed/kursirotan/500/500",
    gallery: ["https://picsum.photos/seed/kursirotan/500/500", "https://picsum.photos/seed/kursirotansamping/500/500"],
    seller: { name: "Toko Vintage Bahari", avatar: "https://picsum.photos/seed/tokovintagebahari/100/100", rating: 4.9 },
    description: "Kursi rotan klasik, anyaman masih kokoh, ada sedikit warna pudar khas barang vintage."
  },
];
module.exports = { SS_CATEGORIES, SS_CONDITIONS, SS_PRODUCTS };
