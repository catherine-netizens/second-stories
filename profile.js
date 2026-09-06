function $(s){return document.querySelector(s)}
function $all(s){return [...document.querySelectorAll(s)]}

function formatRupiah(n){
  return "Rp "+Number(n||0).toLocaleString("id-ID")
}

let activeChatId=null,conversations=[];

function starsHtml(r){
  const n=Math.max(0,Math.min(5,Math.round(Number(r)||0)));
  return "★".repeat(n)+"☆".repeat(5-n)
}

function setupTabs(){
  $all(".tab-btn").forEach(b=>{
    b.addEventListener("click",()=>{
      activateTab(b.dataset.tab)
    })
  })
}

function activateTab(t){
  $all(".tab-btn").forEach(b=>{
    b.classList.toggle(
      "active",
      b.dataset.tab===t
    )
  })

  $all(".tab-panel").forEach(p=>{
    p.hidden=p.dataset.tabPanel!==t
  })
}

function applyTabFromQuery(){
  const t=new URLSearchParams(location.search).get("tab");

  if(
    t &&
    document.querySelector(
      `.tab-btn[data-tab="${t}"]`
    )
  ){
    activateTab(t)
  }
}


/* =========================================================
   AVATAR
   ========================================================= */

function setupAvatar(){

  const btn=$("#avatarEditBtn");
  const img=$("#avatarImg");

  if(!btn || !img) return;

  let input=document.getElementById("avatarInput");

  /*
   * Kalau input file belum tersedia di HTML,
   * buat otomatis.
   */
  if(!input){

    input=document.createElement("input");

    input.type="file";
    input.id="avatarInput";
    input.accept="image/jpeg,image/png,image/webp";
    input.style.display="none";

    document.body.appendChild(input);
  }

  /*
   * Klik tombol edit avatar
   */
  btn.onclick=function(){

    input.value="";
    input.click();

  };


  /*
   * Ketika user memilih foto
   */
  input.onchange=async function(){

    const file=input.files && input.files[0];

    if(!file) return;


    /*
     * Validasi tipe file
     */
    if(!file.type.startsWith("image/")){

      SSToast.show(
        "File foto profil harus berupa gambar.",
        "error"
      );

      input.value="";
      return;
    }


    /*
     * Maksimal file asli 10 MB
     */
    if(file.size>10*1024*1024){

      SSToast.show(
        "Ukuran foto maksimal 10 MB.",
        "error"
      );

      input.value="";
      return;
    }


    /*
     * Simpan avatar lama untuk fallback
     */
    const oldAvatar=img.src;


    try{

      btn.disabled=true;

      SSToast.show(
        "Sedang memproses foto...",
        "info"
      );


      /*
       * Kompres dan resize foto
       */
      const dataUrl=await resizeAvatarImage(
        file,
        600,
        0.80
      );


      /*
       * Tampilkan preview langsung
       */
      img.src=dataUrl;


      /*
       * Kirim avatar ke server
       */
      const result=await apiJSON(
        "/api/profile",
        {
          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            avatar:dataUrl
          })
        }
      );


      /*
       * Gunakan avatar dari server.
       * Kalau server tidak mengembalikan avatar,
       * gunakan data yang baru dikirim.
       */
      const savedAvatar=
        result.user &&
        result.user.avatar
          ? result.user.avatar
          : dataUrl;


      /*
       * Tampilkan avatar yang sudah tersimpan
       */
      img.src=ssAvatarImgSrc(savedAvatar);


      /*
       * Update user yang sedang login
       */
      SSAuth.currentUser=Object.assign(
        SSAuth.currentUser||{},
        {
          avatar:savedAvatar
        }
      );


      /*
       * Refresh avatar/navbar kalau fungsi tersedia
       */
      if(
        typeof SSAuth.refreshHeaders==="function"
      ){
        SSAuth.refreshHeaders();
      }


      SSToast.show(
        "Foto profil berhasil diperbarui.",
        "success"
      );


    }catch(e){

      console.error(
        "Gagal memperbarui avatar:",
        e
      );


      /*
       * Kalau gagal, kembalikan avatar lama
       */
      img.src=oldAvatar;


      SSToast.show(
        e.message ||
        "Gagal memperbarui foto profil.",
        "error"
      );


    }finally{

      btn.disabled=false;
      input.value="";

    }

  };
}


/*
 * Resize + compress foto avatar
 *
 * maxSize = ukuran maksimal sisi foto
 * quality = kualitas JPEG
 */
function resizeAvatarImage(
  file,
  maxSize=600,
  quality=0.80
){

  return new Promise(
    (resolve,reject)=>{

      const reader=new FileReader();


      reader.onerror=function(){

        reject(
          new Error(
            "Foto gagal dibaca."
          )
        );

      };


      reader.onload=function(){

        const image=new Image();


        image.onerror=function(){

          reject(
            new Error(
              "Format foto tidak dapat diproses."
            )
          );

        };


        image.onload=function(){

          const originalWidth=image.naturalWidth;
          const originalHeight=image.naturalHeight;


          if(
            !originalWidth ||
            !originalHeight
          ){

            reject(
              new Error(
                "Ukuran foto tidak valid."
              )
            );

            return;
          }


          /*
           * Jangan memperbesar foto kecil.
           */
          const scale=Math.min(
            1,
            maxSize/
            Math.max(
              originalWidth,
              originalHeight
            )
          );


          const width=Math.max(
            1,
            Math.round(
              originalWidth*scale
            )
          );


          const height=Math.max(
            1,
            Math.round(
              originalHeight*scale
            )
          );


          /*
           * Buat canvas
           */
          const canvas=
            document.createElement("canvas");


          canvas.width=width;
          canvas.height=height;


          const ctx=
            canvas.getContext("2d");


          if(!ctx){

            reject(
              new Error(
                "Browser tidak mendukung pemrosesan foto."
              )
            );

            return;
          }


          /*
           * Background putih untuk PNG transparan
           */
          ctx.fillStyle="#ffffff";

          ctx.fillRect(
            0,
            0,
            width,
            height
          );


          /*
           * Gambar foto ke canvas
           */
          ctx.drawImage(
            image,
            0,
            0,
            width,
            height
          );


          /*
           * Convert ke JPEG agar ukurannya lebih kecil
           */
          const compressed=
            canvas.toDataURL(
              "image/jpeg",
              quality
            );


          resolve(compressed);

        };


        image.src=reader.result;

      };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================================================
   LOAD PROFILE
   ========================================================= */

async function loadProfile(){

  const d=await apiJSON("/api/profile");
  const u=d.user;
  const s=d.stats;

  $("#profileName")
    .childNodes[0]
    .textContent=(u.name||"User")+" ";

  $("#profileLocation").textContent=
    u.location||
    "Belum ada lokasi";

  $("#aboutBio").textContent=
    u.bio||
    "Belum ada bio. Kamu bisa menambahkan cerita tentang dirimu melalui tombol Edit Profil.";

  $("#joinDate").textContent=
    u.created_at
      ? new Date(
          u.created_at
        ).toLocaleDateString(
          "id-ID",
          {
            month:"long",
            year:"numeric"
          }
        )
      :"—";

  $("#ratingValue").textContent=
    Number(s.rating||0).toFixed(1);

  $("#reviewCount").textContent=
    Number(s.reviewCount||0);

  $("#profileStars").textContent=
    starsHtml(s.rating);

  $("#statSold").textContent=
    Number(s.sold||0);

  $("#statPosted").textContent=
    Number(s.posted||0);

  $("#statTrust").textContent=
    Number(s.reviewCount||0)
      ? `${Number(s.rating||0).toFixed(1)}/5`
      :"Belum ada";

  $("#avatarImg").src=
    ssAvatarImgSrc(u.avatar);

  return d;
}


/* =========================================================
   MY PRODUCTS
   ========================================================= */

async function renderMyItems(
  sortBy="terbaru"
){

  const grid=$("#myItemsGrid");

  const d=
    await apiJSON(
      "/api/my-products"
    );

  const items=d.products||[];


  if(sortBy==="termurah"){
    items.sort(
      (a,b)=>a.price-b.price
    );
  }


  if(sortBy==="termahal"){
    items.sort(
      (a,b)=>b.price-a.price
    );
  }


  grid.innerHTML=
    items.length
      ?items.map(
        (x,i)=>`

<div
  class="my-item-card ${
    x.status!=="active"
      ?"item-unavailable"
      :""
  }"
  data-id="${x.id}"
  style="animation-delay:${i*.05}s"
>

  <div class="item-img-wrap">

    <img
      src="${ssProductImgSrc(x.img)}"
      alt="${x.name}"
      loading="lazy"
      onerror="ssImageFallback(this)"
    >

    <button
      type="button"
      class="item-menu-btn"
      data-index="${i}"
    >
      ⋯
    </button>

    <div
      class="item-dropdown"
      id="dropdown-${i}"
    >

      <button
        type="button"
        data-action="sold"
        ${
          x.status!=="active"
            ?"disabled"
            :""
        }
      >
        ✔ Tandai Terjual
      </button>

      <button
        type="button"
        data-action="delete"
        class="danger"
      >
        🗑 Hapus
      </button>

    </div>

  </div>


  <div class="my-item-info">

    <p class="my-item-name">
      ${x.name}
    </p>

    ${
      x.status!=="active"
        ?`
          <span class="item-status">
            ${
              x.status==="sold"
                ?"Terjual"
                :"Disembunyikan"
            }
          </span>
        `
        :""
    }

    <div class="my-item-price-row">

      <p class="my-item-price">
        ${formatRupiah(x.price)}
      </p>

      <button
        type="button"
        class="my-item-wish"
        data-id="${x.id}"
      >
        ♡
      </button>

    </div>

  </div>

</div>

`
      ).join("")
      :`
<div class="profile-empty-state">

  <span>📦</span>

  <h4>
    Belum ada barang
  </h4>

  <p>
    Barang yang kamu jual akan muncul di sini.
  </p>

  <a
    href="sell.html"
    class="btn btn-primary"
  >
    Jual Barang
  </a>

</div>
`;

  setupItemActions();
}


/* =========================================================
   PRODUCT ACTIONS
   ========================================================= */

function setupItemActions(){

  /*
   * Menu ⋯
   */
  $all(".item-menu-btn")
    .forEach(b=>{

      b.onclick=e=>{

        e.stopPropagation();

        const d=
          $("#dropdown-"+b.dataset.index);

        $all(".item-dropdown")
          .forEach(x=>{
            if(x!==d){
              x.classList.remove("open");
            }
          });

        d.classList.toggle("open");
      };

    });


  /*
   * Tandai terjual / hapus
   */
  $all(".item-dropdown button")
    .forEach(b=>{

      b.onclick=async e=>{

        e.stopPropagation();

        const card=
          b.closest(".my-item-card");

        const id=
          card.dataset.id;

        const name=
          card
            .querySelector(".my-item-name")
            .textContent;


        try{

          /*
           * Hapus
           */
          if(
            b.dataset.action==="delete"
          ){

            if(
              !confirm(
                `Hapus "${name}" dari daftar barangmu?`
              )
            ){
              return;
            }

            await apiJSON(
              `/api/products/${id}`,
              {
                method:"DELETE"
              }
            );

            await renderMyItems();
            await loadProfile();

            SSToast.show(
              "Barang dihapus.",
              "success"
            );

          }


          /*
           * Tandai terjual
           */
          else if(
            b.dataset.action==="sold"
          ){

            await apiJSON(
              `/api/products/${id}/sold`,
              {
                method:"PATCH"
              }
            );

            await renderMyItems();
            await loadProfile();

            SSToast.show(
              `"${name}" ditandai sebagai Terjual.`,
              "success"
            );

          }

        }catch(err){

          SSToast.show(
            err.message,
            "error"
          );

        }

      };

    });


  /*
   * Wishlist barang milik sendiri
   */
  $all(".my-item-wish")
    .forEach(b=>{

      b.onclick=async()=>{

        try{

          const a=
            await SSWishlist.toggle(
              Number(b.dataset.id)
            );

          b.textContent=
            a
              ?"♥"
              :"♡";

          b.classList.toggle(
            "active",
            a
          );

        }catch(e){

          SSToast.show(
            e.message,
            "error"
          );

        }

      };

    });

}


/* =========================================================
   ORDERS
   ========================================================= */

async function renderOrders(){

  const list=$("#orderHistoryList");
  const empty=$("#orderEmptyState");

  const d=
    await apiJSON(
      "/api/orders"
    );

  const orders=
    d.orders||[];


  list.hidden=!orders.length;

  empty.hidden=!!orders.length;


  list.innerHTML=
    orders
      .map(
        o=>`

<div class="order-card">

  <div class="order-card-head">

    <span class="order-card-id">
      #${o.id}
    </span>

    <span class="order-status-pill">
      ${o.status||"Diproses"}
    </span>

    <span class="order-card-date">
      ${new Date(o.date)
        .toLocaleDateString("id-ID")}
    </span>

  </div>


  <div class="order-card-items">

    ${
      o.items
        .map(
          i=>`

<div class="order-item-row">

  <span>
    ${i.name} × ${i.qty}
  </span>

  <span>
    ${formatRupiah(
      i.price*i.qty
    )}
  </span>

</div>

`
        )
        .join("")
    }

  </div>


  <div class="order-card-total">

    <span>
      Total Bayar
    </span>

    <span>
      ${formatRupiah(o.total)}
    </span>

  </div>

</div>

`
      )
      .join("");
}


/* =========================================================
   REVIEWS
   ========================================================= */

async function renderReviews(){

  const list=$("#reviewList");

  const d=
    await apiJSON(
      "/api/my-reviews"
    )
    .catch(
      ()=>({reviews:[]})
    );

  const rows=
    d.reviews||[];

  const total=
    rows.length;

  const counts=
    [0,0,0,0,0];


  rows.forEach(r=>{

    const n=
      Number(r.rating);

    if(
      n>=1 &&
      n<=5
    ){
      counts[n-1]++;
    }

  });


  const avg=
    total
      ?rows.reduce(
        (a,r)=>
          a+Number(
            r.rating||0
          ),
        0
      )/total
      :0;


  $("#reviewsScoreBig")
    .textContent=
      avg.toFixed(1);

  $("#reviewsStars")
    .textContent=
      starsHtml(avg);

  $("#reviewsScoreSub")
    .textContent=
      total
        ?`dari ${total} ulasan`
        :"Belum ada ulasan";


  for(
    let n=1;
    n<=5;
    n++
  ){

    const c=
      counts[n-1];

    const pct=
      total
        ?Math.round(
          c/total*100
        )
        :0;

    $("#bar"+n)
      .style.width=
        pct+"%";

    $("#count"+n)
      .textContent=
        c;
  }


  list.innerHTML=
    rows.length
      ?rows
        .map(
          r=>`

<div class="review-card">

  <div class="review-head">

    <div class="review-avatar">
      ${r.name
        .slice(0,2)
        .toUpperCase()}
    </div>

    <div>

      <p class="review-name">
        ${r.name}
      </p>

      <p class="review-date">
        ${new Date(r.date)
          .toLocaleDateString("id-ID")}
      </p>

    </div>

  </div>


  <p class="review-stars">
    ${starsHtml(r.rating)}
  </p>

  <p class="review-text">
    ${r.comment}
  </p>

  <p class="review-product">
    Produk:
    ${r.item||"—"}
  </p>

</div>

`
        )
        .join("")
      :`

<div class="profile-empty-state">

  <span>⭐</span>

  <h4>
    Belum ada ulasan
  </h4>

  <p>
    Ulasan dari pembeli akan muncul di sini setelah ada transaksi.
  </p>

</div>

`;

}


/* =========================================================
   EDIT PROFILE
   ========================================================= */

function setupEdit(){

  const overlay=
    $("#editModalOverlay");

  const form=
    $("#editProfileForm");

  const editBtn=
    $("#editProfileBtn");


  if(
    !overlay ||
    !form ||
    !editBtn
  ){
    return;
  }


  /*
   * Buka modal
   */
  editBtn.onclick=()=>{

    const name=
      $("#profileName")
        .childNodes[0]
        .textContent
        .trim();


    $("#editName").value=
      name==="User"
        ?""
        :name;


    $("#editLocation").value=
      $("#profileLocation")
        .textContent
        .trim();


    const bioText=
      $("#aboutBio")
        .textContent
        .trim();


    $("#editBio").value=
      bioText.includes(
        "Belum ada bio"
      )
        ?""
        :bioText;


    overlay.hidden=false;

  };


  /*
   * Tutup modal
   */
  const close=()=>{
    overlay.hidden=true;
  };


  $("#editModalClose")
    .onclick=close;

  $("#editCancelBtn")
    .onclick=close;


  /*
   * Klik luar modal
   */
  overlay.onclick=e=>{

    if(e.target===overlay){
      close();
    }

  };


  /*
   * Simpan profil
   */
  form.addEventListener(
    "submit",
    async e=>{

      e.preventDefault();


      const name=
        $("#editName")
          .value
          .trim();

      const location=
        $("#editLocation")
          .value
          .trim();

      const bio=
        $("#editBio")
          .value
          .trim();


      if(!name){

        SSToast.show(
          "Nama wajib diisi.",
          "error"
        );

        return;
      }


      if(!location){

        SSToast.show(
          "Lokasi wajib diisi.",
          "error"
        );

        return;
      }


      try{

        const result=
          await apiJSON(
            "/api/profile",
            {
              method:"PUT",

              headers:{
                "Content-Type":
                  "application/json"
              },

              body:JSON.stringify({
                name:name,
                location:location,
                bio:bio
              })
            }
          );


        await loadProfile();


        SSAuth.currentUser=
          Object.assign(
            SSAuth.currentUser||{},
            {
              name:name,
              location:location,
              bio:bio
            }
          );


        if(
          typeof SSAuth.refreshHeaders===
          "function"
        ){
          SSAuth.refreshHeaders();
        }


        close();


        SSToast.show(
          "Profil berhasil diperbarui.",
          "success"
        );


      }catch(err){

        console.error(
          "Gagal menyimpan profil:",
          err
        );


        SSToast.show(
          err.message||
          "Gagal menyimpan perubahan profil.",
          "error"
        );

      }

    }
  );

}


/* =========================================================
   CHAT
   ========================================================= */

async function loadChats(){

  const d=
    await apiJSON(
      "/api/conversations"
    );

  conversations=
    d.conversations||[];

  renderChatList();

}


function renderChatList(){

  const list=
    $("#chatList");


  list.innerHTML=
    conversations.length

      ?conversations
        .map(
          c=>`

<div
  class="chat-list-item"
  data-id="${c.id}"
>

  <div class="chat-list-info">

    <p class="chat-list-name">
      ${c.other_name}
    </p>

    <p class="chat-list-preview">
      ${
        c.messages?.length
          ?c.messages[
            c.messages.length-1
          ].message
          :"Belum ada pesan"
      }
    </p>

  </div>

</div>

`
        )
        .join("")

      :`
        <p style="padding:20px">
          Belum ada percakapan.
        </p>
      `;


  $all(".chat-list-item")
    .forEach(i=>{

      i.onclick=()=>
        openChat(
          i.dataset.id
        );

    });


  $("#chatBadge").style.display=
    conversations.length
      ?"flex"
      :"none";


  $("#chatBadge").textContent=
    conversations.length;

}


function openChat(id){

  activeChatId=
    Number(id);

  const c=
    conversations.find(
      x=>Number(x.id)===
        activeChatId
    );

  if(!c) return;

  $("#chatList").hidden=true;

  $("#chatThread").hidden=false;

  $("#chatBackBtn").hidden=false;

  /*
   * Header chat tetap menggunakan
   * tulisan "Chat", bukan nama toko.
   */
  $("#chatPanelTitle")
    .textContent=
      "Chat";

  renderMessages(c);
}


function renderMessages(c){

  $("#chatMessages").innerHTML=
    (c.messages||[])
      .map(
        m=>`

<div
  class="chat-bubble ${
    Number(m.sender_id)===
    Number(
      SSAuth.currentUser.id
    )
      ?"me"
      :"them"
  }"
>
  ${m.message}
</div>

`
      )
      .join("");

}


function setupChat(){

  const panel=
    $("#chatPanel");

  const overlay=
    $("#chatOverlay");


  /*
   * Buka chat
   */
  $("#chatToggleBtn").onclick=()=>{

    panel.classList.add("open");

    overlay.hidden=false;

  };


  /*
   * Tutup chat
   */
  const close=()=>{

    panel.classList.remove("open");

    overlay.hidden=true;

    $("#chatList").hidden=false;

    $("#chatThread").hidden=true;

    $("#chatBackBtn").hidden=true;

  };


  $("#chatCloseBtn")
    .onclick=close;


  overlay.onclick=close;


  /*
   * Kembali ke daftar chat
   */
  $("#chatBackBtn").onclick=()=>{

    $("#chatList").hidden=false;

    $("#chatThread").hidden=true;

    $("#chatBackBtn").hidden=true;

  };


  /*
   * Kirim pesan
   */
  $("#chatInputForm").onsubmit=
    async e=>{

      e.preventDefault();


      const input=
        $("#chatInput");

      const text=
        input.value.trim();


      if(
        !text ||
        !activeChatId
      ){
        return;
      }


      try{

        await apiJSON(
          `/api/conversations/${activeChatId}/messages`,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
              message:text
            })
          }
        );


        const c=
          conversations.find(
            x=>Number(x.id)===
              activeChatId
          );


        if(!c.messages){
          c.messages=[];
        }


        c.messages.push({
          sender_id:
            SSAuth.currentUser.id,

          message:text
        });


        renderMessages(c);

        input.value="";


      }catch(err){

        SSToast.show(
          err.message,
          "error"
        );

      }

    };

}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async()=>{

    await SSAuth.ready();


    const gate=
      $("#profileLoggedOutState");

    const hero=
      $("#profileHeroSection");

    const tabsSec=
      $("#profileTabsSection");

    const main=
      $("#profileMainContent");


    /*
     * Jika belum login
     */
    if(!SSAuth.isLoggedIn()){

      if(gate){
        gate.hidden=false;
      }


      [
        hero,
        tabsSec,
        main
      ]
      .forEach(el=>{
        if(el){
          el.hidden=true;
        }
      });


      $("#profileLoginPromptBtn")
        ?.addEventListener(
          "click",
          ()=>{
            SSAuth.openModal();
          }
        );


      SSAuth.openModal();


      /*
       * Setelah berhasil login,
       * refresh halaman.
       */
      document.addEventListener(
        "ss-auth-success",
        ()=>location.reload(),
        {
          once:true
        }
      );


      return;
    }


    /*
     * Jika sudah login
     */
    if(gate){
      gate.hidden=true;
    }


    [
      hero,
      tabsSec,
      main
    ]
    .forEach(el=>{
      if(el){
        el.hidden=false;
      }
    });


    /*
     * Jika logout,
     * reload halaman.
     */
    document.addEventListener(
      "ss-auth-logout",
      ()=>location.reload(),
      {
        once:true
      }
    );


    try{

      await loadProfile();

      await renderMyItems();

      await renderOrders();

      await renderReviews();

      await SSWishlist.ready();

      await loadChats();


      setupTabs();

      setupEdit();

      setupAvatar();

      setupChat();


      const s=
        $("#sortSelect");


      s?.addEventListener(
        "change",
        ()=>{
          renderMyItems(
            s.value
          );
        }
      );


      applyTabFromQuery();


    }catch(e){

      console.error(e);

      SSToast.show(
        e.message,
        "error"
      );

    }


    /*
     * Newsletter
     */
    const f=
      $("#profileNewsletterForm");


    f?.addEventListener(
      "submit",
      e=>{

        e.preventDefault();

        SSToast.show(
          "Terima kasih! Update promo akan dikirim ke email kamu.",
          "success"
        );

        f.reset();

      }
    );

  }
);