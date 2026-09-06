require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { SS_PRODUCTS } = require("./seed-data");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || "second_stories_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 }
}));

function ok(res, data = {}) { return res.json({ success: true, ...data }); }
function fail(res, status, message) { return res.status(status).json({ success: false, message }); }
function requireAuth(req, res, next) {
  if (!req.session.userId) return fail(res, 401, "Silakan login terlebih dahulu.");
  next();
}

async function seedDatabase() {
  const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM products");
  if (Number(countRows[0].total) > 0) return;

  const sellers = {};
  const sellerNames = [...new Set(SS_PRODUCTS.map(p => p.seller.name))];
  const demoPassword = await bcrypt.hash("demo1234", 10);

  for (const name of sellerNames) {
    const email = name.toLowerCase().replace(/[^a-z0-9]+/g, ".") + "@demo.secondstories.local";
    const avatar = SS_PRODUCTS.find(p => p.seller.name === name)?.seller.avatar || "";
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    let id;
    if (existing.length) id = existing[0].id;
    else {
      const [r] = await pool.query(
        "INSERT INTO users (name,email,password,location,bio,avatar) VALUES (?,?,?,?,?,?)",
        [name, email, demoPassword, "Indonesia", "Seller demo Second Stories", avatar]
      );
      id = r.insertId;
    }
    sellers[name] = id;
  }

  for (const p of SS_PRODUCTS) {
    const sellerId = sellers[p.seller.name];
    await pool.query(
      `INSERT INTO products
       (seller_id,name,category,condition_name,price,original_price,rating,sold,stock,location,featured,image,gallery,description,ownership,note,status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [sellerId,p.name,p.category,p.condition,p.price,p.originalPrice || null,p.rating || 0,p.sold || 0,p.stock || 0,
       p.location || "Indonesia",p.featured ? 1 : 0,p.img,JSON.stringify(p.gallery || [p.img]),p.description || "","", "", "active"]
    );
  }
  console.log(`Seed ${SS_PRODUCTS.length} produk demo berhasil.`);
}

app.get("/api/health", async (req,res) => {
  try { await pool.query("SELECT 1"); return ok(res, { message: "Server dan MySQL aktif." }); }
  catch (e) { console.error(e); return fail(res,500,"MySQL belum terhubung."); }
});

// ---------------- AUTH ----------------
app.post("/api/register", async (req,res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return fail(res,400,"Nama, email, dan password wajib diisi.");
    if (password.length < 4) return fail(res,400,"Password minimal 4 karakter.");
    const [exists] = await pool.query("SELECT id FROM users WHERE email=?", [email.trim().toLowerCase()]);
    if (exists.length) return fail(res,400,"Email sudah terdaftar.");
    const hash = await bcrypt.hash(password,10);
    const [r] = await pool.query("INSERT INTO users (name,email,password) VALUES (?,?,?)", [name.trim(),email.trim().toLowerCase(),hash]);
    req.session.userId = r.insertId;
    return ok(res,{message:"Akun berhasil dibuat!",user:{id:r.insertId,name:name.trim(),email:email.trim().toLowerCase()}});
  } catch(e) { console.error(e); return fail(res,500,"Gagal membuat akun."); }
});

app.post("/api/login", async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res,400,"Email dan password wajib diisi.");
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email.trim().toLowerCase()]);
    if (!rows.length) return fail(res,401,"Email atau password salah.");
    const user=rows[0];
    if (!(await bcrypt.compare(password,user.password))) return fail(res,401,"Email atau password salah.");
    req.session.userId=user.id;
    return ok(res,{message:"Login berhasil!",user:{id:user.id,name:user.name,email:user.email,location:user.location,bio:user.bio,avatar:user.avatar}});
  } catch(e){console.error(e);return fail(res,500,"Gagal login.");}
});

app.get("/api/me", async (req,res) => {
  if (!req.session.userId) return fail(res,401,"Belum login.");
  try {
    const [rows]=await pool.query("SELECT id,name,email,location,bio,avatar,created_at FROM users WHERE id=?",[req.session.userId]);
    if(!rows.length){req.session.destroy(()=>{});return fail(res,401,"User tidak ditemukan.");}
    return ok(res,{user:rows[0]});
  } catch(e){console.error(e);return fail(res,500,"Gagal mengambil data user.");}
});

app.post("/api/logout",(req,res)=>req.session.destroy(e=>e?fail(res,500,"Gagal logout."):ok(res,{message:"Berhasil logout."})));

// ---------------- PRODUCTS ----------------
function productSelect() {
  return `SELECT p.*, u.name AS seller_name, u.avatar AS seller_avatar, u.email AS seller_email, u.location AS seller_location, u.bio AS seller_bio, COALESCE((SELECT AVG(r.rating) FROM reviews r JOIN products rp ON rp.id=r.product_id WHERE rp.seller_id=p.seller_id),0) AS seller_rating
          FROM products p JOIN users u ON u.id=p.seller_id`;
}
function mapProduct(p){
  let gallery = [];

  try {
    gallery =
      typeof p.gallery === "string"
        ? JSON.parse(p.gallery)
        : (p.gallery || []);
  } catch(e) {
    gallery = [];
  }

  // Pastikan gambar utama selalu punya nilai
  const image =
    p.image ||
    (gallery.length ? gallery[0] : "");

  return {
    id: Number(p.id),
    name: p.name,
    category: p.category,
    condition: p.condition_name,

    price: Number(p.price || 0),

    originalPrice:
      p.original_price == null
        ? null
        : Number(p.original_price),

    rating: Number(p.rating || 0),
    sold: Number(p.sold || 0),
    stock: Number(p.stock || 0),

    location:
      p.location || "Indonesia",

    featured: !!p.featured,

    // PENTING
    img: image,

    gallery: gallery,

    seller: {
      id: Number(p.seller_id),
      name: p.seller_name || "",
      avatar: p.seller_avatar || "",
      rating: Number(p.seller_rating || 0)
    },

    description: p.description || "",
    ownership: p.ownership || "",
    note: p.note || "",
    status: p.status,

    createdAt: p.created_at
  };
}

app.get("/api/products",async(req,res)=>{
  try{
    const {category,condition,search,maxPrice,sort,featured}=req.query;
    const where=["p.status='active'"]; const args=[];
    if(category){where.push("p.category=?");args.push(category);}
    if(condition){where.push("p.condition_name=?");args.push(condition);}
    if(search){where.push("(p.name LIKE ? OR p.category LIKE ?)");args.push(`%${search}%`,`%${search}%`);}
    if(maxPrice && Number(maxPrice)>0){where.push("p.price<=?");args.push(Number(maxPrice));}
    if(featured==='true') where.push("p.featured=1");
    let order="p.created_at DESC, p.id DESC";
    if(sort==='termurah') order="p.price ASC";
    if(sort==='termahal') order="p.price DESC";
    if(sort==='terlaris') order="p.sold DESC, p.id DESC";
    const [rows]=await pool.query(`${productSelect()} WHERE ${where.join(" AND ")} ORDER BY ${order}`,args);
    return ok(res,{products:rows.map(mapProduct)});
  }catch(e){console.error(e);return fail(res,500,"Gagal mengambil produk.");}
});

app.get("/api/products/:id",async(req,res)=>{
  try{const [rows]=await pool.query(`${productSelect()} WHERE p.id=? AND p.status='active'`,[req.params.id]);if(!rows.length)return fail(res,404,"Produk tidak ditemukan.");return ok(res,{product:mapProduct(rows[0])});}
  catch(e){console.error(e);return fail(res,500,"Gagal mengambil produk.");}
});

// ---------------- WISHLIST ----------------
app.get("/api/wishlist",requireAuth,async(req,res)=>{try{const [rows]=await pool.query("SELECT product_id FROM wishlist_items WHERE user_id=? ORDER BY created_at DESC",[req.session.userId]);return ok(res,{ids:rows.map(r=>Number(r.product_id))});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil wishlist.");}});
app.post("/api/wishlist/:id",requireAuth,async(req,res)=>{try{const [p]=await pool.query("SELECT id FROM products WHERE id=? AND status='active'",[req.params.id]);if(!p.length)return fail(res,404,"Produk tidak tersedia.");await pool.query("INSERT IGNORE INTO wishlist_items(user_id,product_id) VALUES(?,?)",[req.session.userId,req.params.id]);return ok(res,{added:true});}catch(e){console.error(e);return fail(res,500,"Gagal menambah wishlist.");}});
app.delete("/api/wishlist/:id",requireAuth,async(req,res)=>{try{await pool.query("DELETE FROM wishlist_items WHERE user_id=? AND product_id=?",[req.session.userId,req.params.id]);return ok(res,{added:false});}catch(e){console.error(e);return fail(res,500,"Gagal menghapus wishlist.");}});

// ---------------- CART ----------------
app.get("/api/cart",requireAuth,async(req,res)=>{try{const [rows]=await pool.query(`SELECT p.*, u.name AS seller_name, u.avatar AS seller_avatar, u.email AS seller_email, u.location AS seller_location, u.bio AS seller_bio, c.quantity FROM cart_items c JOIN products p ON p.id=c.product_id JOIN users u ON u.id=p.seller_id WHERE c.user_id=? ORDER BY c.created_at DESC`,[req.session.userId]);return ok(res,{cart:rows.map(r=>({...mapProduct(r),qty:Number(r.quantity)}))});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil keranjang.");}});
app.post("/api/cart",requireAuth,async(req,res)=>{try{const {productId,quantity=1}=req.body;const qty=Math.max(1,Number(quantity));const [p]=await pool.query("SELECT id,stock FROM products WHERE id=? AND status='active'",[productId]);if(!p.length)return fail(res,404,"Produk tidak ditemukan.");const [existing]=await pool.query("SELECT quantity FROM cart_items WHERE user_id=? AND product_id=?",[req.session.userId,productId]);const newQty=Number(existing[0]?.quantity||0)+qty;if(newQty>p[0].stock)return fail(res,400,`Jumlah melebihi stok yang tersedia. Maksimal ${p[0].stock}.`);await pool.query("INSERT INTO cart_items(user_id,product_id,quantity) VALUES(?,?,?) ON DUPLICATE KEY UPDATE quantity=?",[req.session.userId,productId,qty,newQty]);return ok(res,{message:"Produk ditambahkan ke keranjang."});}catch(e){console.error(e);return fail(res,500,"Gagal menambah keranjang.");}});
app.put("/api/cart/:id",requireAuth,async(req,res)=>{try{const qty=Math.max(1,Number(req.body.quantity));const [p]=await pool.query("SELECT stock FROM products WHERE id=? AND status='active'",[req.params.id]);if(!p.length)return fail(res,404,"Produk tidak ditemukan atau sudah tidak tersedia.");if(qty>p[0].stock)return fail(res,400,`Jumlah melebihi stok. Maksimal ${p[0].stock}.`);const [r]=await pool.query("UPDATE cart_items SET quantity=? WHERE user_id=? AND product_id=?",[qty,req.session.userId,req.params.id]);if(!r.affectedRows)return fail(res,404,"Produk tidak ada di keranjang.");return ok(res); }catch(e){console.error(e);return fail(res,500,"Gagal mengubah jumlah.");}});
app.delete("/api/cart/:id",requireAuth,async(req,res)=>{
  try{
    const productId=Number(req.params.id);

    if(!Number.isInteger(productId)||productId<=0){
      return fail(res,400,"ID produk tidak valid.");
    }

    const [r]=await pool.query(
      "DELETE FROM cart_items WHERE user_id=? AND product_id=?",
      [req.session.userId,productId]
    );

    if(!r.affectedRows){
      return fail(res,404,"Produk tidak ada di keranjang.");
    }

    return ok(res,{
      message:"Produk berhasil dihapus dari keranjang.",
      removed:Number(r.affectedRows)
    });
  }catch(e){
    console.error("DELETE CART ERROR:",e);
    return fail(res,500,"Gagal menghapus produk.");
  }
});
app.delete("/api/cart",requireAuth,async(req,res)=>{try{await pool.query("DELETE FROM cart_items WHERE user_id=?",[req.session.userId]);return ok(res);}catch(e){console.error(e);return fail(res,500,"Gagal mengosongkan keranjang.");}});

// ---------------- ORDERS ----------------
app.post("/api/orders",requireAuth,async(req,res)=>{
  const conn=await pool.getConnection();
  try{
    const {shippingAddress,shippingCost=15000,discount=0}=req.body;
    await conn.beginTransaction();
    const [cart]=await conn.query("SELECT c.product_id,c.quantity,p.name,p.price,p.stock FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=? FOR UPDATE",[req.session.userId]);
    if(!cart.length){await conn.rollback();return fail(res,400,"Keranjang kosong.");}
    let subtotal=0;
    for(const item of cart){if(item.quantity>item.stock){await conn.rollback();return fail(res,400,`Stok ${item.name} tidak mencukupi.`);}subtotal+=Number(item.price)*item.quantity;}
    const total=Math.max(0,subtotal-Number(discount||0)+Number(shippingCost||0));
    const [order]=await conn.query("INSERT INTO orders(user_id,total_amount,status,shipping_address,shipping_cost,discount) VALUES(?,?,?,?,?,?)",[req.session.userId,total,"pending",shippingAddress||"",Number(shippingCost||0),Number(discount||0)]);
    for(const item of cart){await conn.query("INSERT INTO order_items(order_id,product_id,quantity,price) VALUES(?,?,?,?)",[order.insertId,item.product_id,item.quantity,item.price]);await conn.query("UPDATE products SET stock=stock-?, sold=sold+? WHERE id=?",[item.quantity,item.quantity,item.product_id]);}
    await conn.query("DELETE FROM cart_items WHERE user_id=?",[req.session.userId]);
    await conn.commit();
    return ok(res,{order:{id:order.insertId,subtotal,shipping:Number(shippingCost||0),discount:Number(discount||0),total,status:"pending"}});
  }catch(e){await conn.rollback();console.error(e);return fail(res,500,"Gagal membuat pesanan.");}finally{conn.release();}
});
app.get("/api/orders",requireAuth,async(req,res)=>{try{const [orders]=await pool.query("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",[req.session.userId]);for(const o of orders){const [items]=await pool.query("SELECT oi.*,p.name,p.image FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?",[o.id]);o.items=items.map(i=>({name:i.name,qty:Number(i.quantity),price:Number(i.price),img:i.image}));o.total=Number(o.total_amount);o.date=o.created_at;}return ok(res,{orders});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil pesanan.");}});

// ---------------- MY PRODUCTS ----------------
app.get("/api/my-products",requireAuth,async(req,res)=>{try{const [rows]=await pool.query(`${productSelect()} WHERE p.seller_id=? ORDER BY p.created_at DESC`,[req.session.userId]);return ok(res,{products:rows.map(mapProduct)});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil barangmu.");}});
app.post("/api/products",requireAuth,async(req,res)=>{try{const {name,price,category,condition,description,ownership,note,location="Indonesia",images=[]}=req.body;if(!name||!price||!category||!condition||!description)return fail(res,400,"Data barang belum lengkap.");if(!Array.isArray(images)||!images.length)return fail(res,400,"Minimal satu foto barang diperlukan.");const [r]=await pool.query(`INSERT INTO products(seller_id,name,category,condition_name,price,rating,sold,stock,location,featured,image,gallery,description,ownership,note,status) VALUES(?,?,?,?,?,0,0,1,?,0,?,?,?, ?,?, 'active')`,[req.session.userId,name.trim(),category,condition,Number(price),location,images[0],JSON.stringify(images),description,ownership||"",note||""]);return ok(res,{message:"Barang berhasil dipublikasikan!",productId:r.insertId});}catch(e){console.error(e);return fail(res,500,"Gagal menyimpan barang.");}});
app.delete("/api/products/:id",requireAuth,async(req,res)=>{try{const [r]=await pool.query("UPDATE products SET status='hidden' WHERE id=? AND seller_id=?",[req.params.id,req.session.userId]);if(!r.affectedRows)return fail(res,404,"Barang tidak ditemukan.");await pool.query("DELETE FROM cart_items WHERE product_id=?",[req.params.id]);await pool.query("DELETE FROM wishlist_items WHERE product_id=?",[req.params.id]);return ok(res,{message:"Barang disembunyikan dari etalase."});}catch(e){console.error(e);return fail(res,500,"Gagal menghapus barang.");}});
app.patch("/api/products/:id/sold",requireAuth,async(req,res)=>{try{const [r]=await pool.query("UPDATE products SET status='sold',stock=0 WHERE id=? AND seller_id=?",[req.params.id,req.session.userId]);if(!r.affectedRows)return fail(res,404,"Barang tidak ditemukan.");await pool.query("DELETE FROM cart_items WHERE product_id=?",[req.params.id]);await pool.query("DELETE FROM wishlist_items WHERE product_id=?",[req.params.id]);return ok(res,{message:"Barang ditandai terjual."});}catch(e){console.error(e);return fail(res,500,"Gagal memperbarui barang.");}});

// ---------------- PROFILE ----------------
app.get("/api/profile",requireAuth,async(req,res)=>{try{const [[u]]=await pool.query("SELECT id,name,email,location,bio,avatar,created_at FROM users WHERE id=?",[req.session.userId]);const [[s]]=await pool.query("SELECT COALESCE(SUM(sold),0) sold, COUNT(*) posted FROM products WHERE seller_id=?",[req.session.userId]);const [[rv]]=await pool.query("SELECT COALESCE(AVG(r.rating),0) rating, COUNT(r.id) review_count FROM reviews r JOIN products p ON p.id=r.product_id WHERE p.seller_id=?",[req.session.userId]);return ok(res,{user:u,stats:{sold:Number(s.sold),posted:Number(s.posted),rating:Number(rv.rating||0),reviewCount:Number(rv.review_count||0)}});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil profil.");}});
app.put("/api/profile",requireAuth,async(req,res)=>{
  try{
    const {name,location,bio,avatar}=req.body;
    const cleanName = typeof name==="string" ? name.trim() : undefined;
    const cleanLocation = typeof location==="string" ? location.trim() : undefined;
    const cleanBio = typeof bio==="string" ? bio.trim() : undefined;
    const cleanAvatar = typeof avatar==="string" ? avatar : undefined;

    if(cleanName !== undefined && !cleanName) return fail(res,400,"Nama wajib diisi.");
    if(cleanLocation !== undefined && !cleanLocation) return fail(res,400,"Lokasi wajib diisi.");

    await pool.query(
      "UPDATE users SET name=COALESCE(?,name), location=COALESCE(?,location), bio=COALESCE(?,bio), avatar=COALESCE(?,avatar) WHERE id=?",
      [cleanName ?? null, cleanLocation ?? null, cleanBio ?? null, cleanAvatar ?? null, req.session.userId]
    );

    const [[u]]=await pool.query("SELECT id,name,email,location,bio,avatar,created_at FROM users WHERE id=?",[req.session.userId]);
    return ok(res,{user:u});
  }catch(e){
    console.error("PROFILE UPDATE ERROR:",e);
    return fail(res,500,"Gagal memperbarui profil.");
  }
});

// ---------------- REVIEWS ----------------
app.get("/api/products/:id/reviews",async(req,res)=>{try{const [rows]=await pool.query("SELECT r.*,u.name,u.avatar FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? ORDER BY r.created_at DESC",[req.params.id]);return ok(res,{reviews:rows.map(r=>({id:r.id,name:r.name,avatar:r.avatar,rating:Number(r.rating),comment:r.comment,date:r.created_at}))});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil ulasan.");}});
app.post("/api/products/:id/reviews",requireAuth,async(req,res)=>{try{const rating=Number(req.body.rating);const comment=(req.body.comment||"").trim();if(rating<1||rating>5||!comment)return fail(res,400,"Rating dan komentar wajib diisi.");const [pRows]=await pool.query("SELECT seller_id FROM products WHERE id=?",[req.params.id]);if(!pRows.length)return fail(res,404,"Produk tidak ditemukan.");if(Number(pRows[0].seller_id)===Number(req.session.userId))return fail(res,400,"Kamu tidak bisa mengulas barang sendiri.");const [bought]=await pool.query("SELECT oi.id FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE o.user_id=? AND oi.product_id=? LIMIT 1",[req.session.userId,req.params.id]);if(!bought.length)return fail(res,403,"Ulasan hanya dapat diberikan setelah membeli produk.");const [already]=await pool.query("SELECT id FROM reviews WHERE user_id=? AND product_id=? LIMIT 1",[req.session.userId,req.params.id]);if(already.length)return fail(res,400,"Kamu sudah memberi ulasan untuk produk ini.");await pool.query("INSERT INTO reviews(user_id,product_id,rating,comment) VALUES(?,?,?,?)",[req.session.userId,req.params.id,rating,comment]);await pool.query("UPDATE products SET rating=(SELECT AVG(rating) FROM reviews WHERE product_id=?) WHERE id=?",[req.params.id,req.params.id]);return ok(res,{message:"Ulasan berhasil ditambahkan."});}catch(e){console.error(e);return fail(res,500,"Gagal menyimpan ulasan.");}});

// ---------------- MY REVIEWS ----------------
app.get("/api/my-reviews",requireAuth,async(req,res)=>{try{const [rows]=await pool.query(`SELECT r.*,u.name AS reviewer_name,p.name AS product_name FROM reviews r JOIN users u ON u.id=r.user_id JOIN products p ON p.id=r.product_id WHERE p.seller_id=? ORDER BY r.created_at DESC`,[req.session.userId]);return ok(res,{reviews:rows.map(r=>({id:r.id,name:r.reviewer_name,rating:Number(r.rating),comment:r.comment,date:r.created_at,item:r.product_name}))});}catch(e){console.error(e);return fail(res,500,"Gagal mengambil ulasan.");}});

// ---------------- CHAT ----------------
app.get("/api/conversations",requireAuth,async(req,res)=>{
  try{
    // Tampilkan hanya satu thread untuk setiap pasangan user, walaupun database
    // pernah memiliki duplikat percakapan lama.
    const [rows]=await pool.query(`
      SELECT c.*,
        CASE WHEN c.buyer_id=? THEN seller.name ELSE buyer.name END AS other_name,
        CASE WHEN c.buyer_id=? THEN seller.avatar ELSE buyer.avatar END AS other_avatar
      FROM conversations c
      JOIN users buyer ON buyer.id=c.buyer_id
      JOIN users seller ON seller.id=c.seller_id
      WHERE (c.buyer_id=? OR c.seller_id=?)
        AND c.id = (
          SELECT MIN(c2.id)
          FROM conversations c2
          WHERE LEAST(c2.buyer_id,c2.seller_id)=LEAST(c.buyer_id,c.seller_id)
            AND GREATEST(c2.buyer_id,c2.seller_id)=GREATEST(c.buyer_id,c.seller_id)
        )
      ORDER BY c.created_at DESC
    `,[req.session.userId,req.session.userId,req.session.userId,req.session.userId]);

    for(const c of rows){
      const [m]=await pool.query("SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at ASC",[c.id]);
      c.messages=m;
    }
    return ok(res,{conversations:rows});
  }catch(e){
    console.error(e);
    return fail(res,500,"Gagal mengambil percakapan.");
  }
});
app.post("/api/conversations",requireAuth,async(req,res)=>{try{const {sellerId,productId}=req.body;if(!sellerId)return fail(res,400,"Penjual tidak ditemukan.");if(Number(sellerId)===Number(req.session.userId))return fail(res,400,"Kamu tidak bisa chat dengan akun sendiri.");
  // Satu percakapan per pasangan pembeli-penjual, TIDAK dipecah per produk.
  const [r]=await pool.query(
    "SELECT id FROM conversations WHERE (buyer_id=? AND seller_id=?) OR (buyer_id=? AND seller_id=?) ORDER BY id ASC LIMIT 1",
    [req.session.userId,sellerId,sellerId,req.session.userId]
  );
  if(r.length)return ok(res,{conversationId:r[0].id});const [n]=await pool.query("INSERT INTO conversations(buyer_id,seller_id,product_id) VALUES(?,?,?)",[req.session.userId,sellerId,productId||null]);return ok(res,{conversationId:n.insertId});}catch(e){console.error(e);return fail(res,500,"Gagal membuat percakapan.");}});
app.post("/api/conversations/:id/messages",requireAuth,async(req,res)=>{try{const text=(req.body.message||"").trim();if(!text)return fail(res,400,"Pesan kosong.");const [c]=await pool.query("SELECT id FROM conversations WHERE id=? AND (buyer_id=? OR seller_id=?)",[req.params.id,req.session.userId,req.session.userId]);if(!c.length)return fail(res,403,"Akses percakapan ditolak.");const [r]=await pool.query("INSERT INTO messages(conversation_id,sender_id,message) VALUES(?,?,?)",[req.params.id,req.session.userId,text]);return ok(res,{message:{id:r.insertId,sender_id:req.session.userId,message:text}});}catch(e){console.error(e);return fail(res,500,"Gagal mengirim pesan.");}});

// Serve frontend AFTER API routes.
app.use(express.static(path.join(__dirname,"..")));
app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"..","homepage.html")));

// ===== GLOBAL ERROR HANDLER =====
app.use((err,req,res,next)=>{
  console.error(err);
  if(err && (err.type==="entity.too.large" || err.status===413)){
    return fail(res,413,"Ukuran total foto terlalu besar. Coba kurangi jumlah foto atau gunakan foto dengan ukuran file lebih kecil.");
  }
  if(err && err.type==="entity.parse.failed"){
    return fail(res,400,"Data yang dikirim tidak valid.");
  }
  return fail(res,500,"Terjadi kesalahan pada server.");
});

(async()=>{
  try {
    await pool.query("SELECT 1");
    console.log("Database berhasil terhubung!");
    await seedDatabase();
    app.listen(PORT,()=>console.log(`Server berjalan di http://localhost:${PORT}`));
  } catch(e){
    console.error("Database gagal terhubung.");
    console.error("Kode error:", e.code || "TIDAK DIKETAHUI");
    console.error("Pesan:", e.message || "Tidak ada pesan error dari driver MySQL.");
    console.error("Host:", process.env.DB_HOST || "belum diatur", "| User:", process.env.DB_USER || "belum diatur", "| Database:", process.env.DB_NAME || "belum diatur", "| Port:", process.env.DB_PORT || "3306");
    process.exit(1);
  }
})();