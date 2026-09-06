// Produk sekarang berasal dari MySQL melalui API /api/products.
function ssFormatRupiah(number) { return "Rp " + Math.round(Number(number || 0)).toLocaleString("id-ID"); }
function ssGetProductById(id) { return (window.SS_PRODUCT_CACHE || []).find(p => Number(p.id) === Number(id)); }
function ssGetRelatedProducts(product, limit=4) { return (window.SS_PRODUCT_CACHE || []).filter(p => p.id !== product.id && p.category === product.category).slice(0,limit); }
function ssGetFeaturedProducts() { return (window.SS_PRODUCT_CACHE || []).filter(p => p.featured); }
// Placeholder foto: dipakai dari AWAL saat produk tidak punya gambar (bukan hanya
// saat onerror). Ini mencegah <img src=""> yang bisa memicu browser memuat ulang
// URL halaman itu sendiri, dan mencegah kartu produk terlihat kosong/rusak padahal
// tetap bisa diklik untuk membuka detail produknya.
const SS_FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 500 500">

      <rect
        width="500"
        height="500"
        fill="#f7efe5"
      />

      <text
        x="250"
        y="245"
        text-anchor="middle"
        font-family="Arial"
        font-size="24"
        fill="#7a1f31"
      >
        Second Stories
      </text>

      <text
        x="250"
        y="280"
        text-anchor="middle"
        font-family="Arial"
        font-size="16"
        fill="#777"
      >
        Foto belum tersedia
      </text>

    </svg>
  `);


function ssProductImgSrc(src){

  if(
    src &&
    String(src).trim()
  ){

    return String(src).trim();

  }

  return SS_FALLBACK_IMG;
}


function ssImageFallback(img){

  img.onerror = null;

  img.src = SS_FALLBACK_IMG;

}
const SS_FALLBACK_AVATAR="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3e6da"/><circle cx="50" cy="38" r="18" fill="#c9a98f"/><path d="M18 88c4-22 22-32 32-32s28 10 32 32" fill="#c9a98f"/></svg>`);
function ssProductImgSrc(src){return (src&&String(src).trim())?src:SS_FALLBACK_IMG;}
function ssAvatarImgSrc(src){return (src&&String(src).trim())?src:SS_FALLBACK_AVATAR;}
function ssImageFallback(img){img.onerror=null;img.src=SS_FALLBACK_IMG;}
function ssAvatarFallback(img){img.onerror=null;img.src=SS_FALLBACK_AVATAR;}
function ssRenderProductCard(product) {
  const isWished = typeof SSWishlist !== "undefined" && SSWishlist.has(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return `<div class="product-card" data-id="${product.id}"><span class="tape"></span>${discount>0?`<span class="pc-discount-tag">-${discount}%</span>`:""}<button class="wishlist-heart ${isWished?"active":""}" data-id="${product.id}" aria-label="Tambah ke wishlist">${isWished?"♥":"♡"}</button><a href="product.html?id=${product.id}" class="pc-img-link"><img src="${ssProductImgSrc(product.img)}" alt="${product.name}" loading="lazy" onerror="ssImageFallback(this)"></a><a href="product.html?id=${product.id}" class="pc-name-link"><p class="product-name">${product.name}</p></a><p class="product-price">${ssFormatRupiah(product.price)}${product.originalPrice?`<span class="pc-original">${ssFormatRupiah(product.originalPrice)}</span>`:""}</p><button type="button" class="add-to-cart-btn" data-id="${product.id}">+ Keranjang</button></div>`;
}
async function ssAttachProductCardEvents(container) {
  if(!container)return;
  await SSWishlist.ready();
  container.querySelectorAll(".wishlist-heart").forEach(btn=>btn.addEventListener("click",async e=>{e.preventDefault();e.stopPropagation();try{const added=await SSWishlist.toggle(Number(btn.dataset.id));btn.classList.toggle("active",added);btn.textContent=added?"♥":"♡";SSToast.show(added?"Ditambahkan ke wishlist ♥":"Dihapus dari wishlist",added?"success":"info");}catch(err){SSToast.show(err.message,"error");}}));
  container.querySelectorAll(".add-to-cart-btn").forEach(btn=>btn.addEventListener("click",async e=>{e.preventDefault();e.stopPropagation();const p=(window.SS_PRODUCT_CACHE||[]).find(x=>Number(x.id)===Number(btn.dataset.id));if(!p)return;try{await SSCart.add({id:p.id,name:p.name,price:p.price,img:p.img},1);SSToast.show(`"${p.name}" ditambahkan ke keranjang 🛍️`,"success");const t=btn.textContent;btn.textContent="✓ Ditambahkan";btn.classList.add("added");btn.disabled=true;setTimeout(()=>{btn.textContent=t;btn.classList.remove("added");btn.disabled=false},1200);}catch(err){SSToast.show(err.message,"error");}}));
  container.querySelectorAll(".product-card").forEach(card=>card.addEventListener("click",e=>{
    if(e.target.closest("button,a"))return;
    const id=card.dataset.id;
    if(id)location.href=`product.html?id=${encodeURIComponent(id)}`;
  }));
}
