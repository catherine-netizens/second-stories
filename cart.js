const SHIPPING_COST_DEFAULT=15000;
let promoRate=0;
const VALID_PROMOS={SECONDLOVE:.1,RELOVED20:.2};
function $(s){return document.querySelector(s)}
function $all(s){return [...document.querySelectorAll(s)]}
function formatRupiah(n){return "Rp "+Math.round(Number(n||0)).toLocaleString("id-ID")}
function updateStepperUI(step){$all(".step-item").forEach(i=>{const n=Number(i.dataset.step);i.classList.remove("active","completed");if(n<step)i.classList.add("completed");if(n===step)i.classList.add("active")})}
async function showStep(step,dir="forward"){$all(".cart-step").forEach(p=>{p.hidden=Number(p.dataset.stepPanel)!==step;p.classList.toggle("slide-back",Number(p.dataset.stepPanel)===step&&dir==="back")});updateStepperUI(step);if(step===2)renderCheckoutRecap();if(step===3)await finalizeOrder();scrollTo({top:0,behavior:"smooth"})}
async function renderCartItems(){

  await SSCart.refresh();

  const cart = SSCart.get();

  const col = $("#cartItemsCol");
  const wrap = $("#cartGridWrap");
  const empty = $("#emptyCartState");

  if(!cart.length){

    wrap.hidden = true;
    empty.hidden = false;

    return;
  }

  wrap.hidden = false;
  empty.hidden = true;


  col.innerHTML = cart.map((item,i)=>{

    const image =
      typeof ssProductImgSrc === "function"
        ? ssProductImgSrc(item.img)
        : (item.img && String(item.img).trim()
            ? String(item.img).trim()
            : SS_FALLBACK_IMG);

    return `

      <div
        class="cart-item-card"
        style="animation-delay:${i*.06}s"
        data-id="${item.id}"
      >

        <a
          href="product.html?id=${item.id}"
          class="cart-item-img-link"
        >

          <img
            class="cart-item-img"
            src="${image}"
            alt="${item.name || "Produk"}"
            loading="lazy"
            onerror="ssImageFallback(this)"
          >

        </a>


        <div class="cart-item-info">

          <a
            href="product.html?id=${item.id}"
            class="cart-item-name-link"
          >

            <p class="cart-item-name">
              ${item.name || "Produk"}
            </p>

          </a>


          <p class="cart-item-meta">
            ${item.category || "Barang preloved"}
            ·
            Stok ${item.stock || 0}
          </p>


          <p class="cart-item-price">
            ${formatRupiah(item.price)}
          </p>


          <div class="qty-stepper">

            <button
              type="button"
              class="qty-btn"
              data-action="dec"
              data-id="${item.id}"
              aria-label="Kurangi jumlah"
            >
              −
            </button>

            <span class="qty-value">
              ${item.qty}
            </span>

            <button
              type="button"
              class="qty-btn"
              data-action="inc"
              data-id="${item.id}"
              aria-label="Tambah jumlah"
            >
              +
            </button>

          </div>

        </div>


        <div class="cart-item-right">

          <p class="cart-item-subtotal">
            ${formatRupiah(
              Number(item.price) *
              Number(item.qty)
            )}
          </p>


          <button
            type="button"
            class="remove-item-btn"
            data-id="${item.id}"
          >
            🗑 Hapus
          </button>

        </div>

      </div>

    `;

  }).join("");


  /*
   * Tombol + dan -
   */
  col.querySelectorAll(".qty-btn")
    .forEach(btn=>{

      btn.addEventListener(
        "click",
        async()=>{

          btn.disabled = true;

          const id =
            Number(btn.dataset.id);

          const item =
            SSCart
              .get()
              .find(
                i=>Number(i.id) === id
              );

          if(!item){

            btn.disabled = false;
            return;

          }


          const q =
            btn.dataset.action === "inc"
              ? Number(item.qty) + 1
              : Number(item.qty) - 1;


          try{

            if(q <= 0){

              await SSCart.remove(id);

            }else{

              await SSCart.setQty(
                id,
                q
              );

            }


            await renderCartItems();

            updateSummary();

          }catch(e){

            SSToast.show(
              e.message,
              "error"
            );

          }finally{

            btn.disabled = false;

          }

        }
      );

    });


  /*
   * Tombol hapus
   */
  col.querySelectorAll(
    ".remove-item-btn"
  )
  .forEach(btn=>{

    btn.addEventListener(
      "click",
      async()=>{

        btn.disabled = true;

        try{

          const id = Number(btn.dataset.id);
          const card = btn.closest(".cart-item-card");

          if(card){
            card.classList.add("removing");
          }

          await SSCart.remove(id);

          await renderCartItems();
          updateSummary();

          SSToast.show(
            "Produk dihapus dari keranjang.",
            "info"
          );

        }catch(e){

          SSToast.show(
            e.message,
            "error"
          );

        }finally{

          btn.disabled = false;

        }

      }
    );

  });

}
function getSelectedShippingCost(){const x=document.querySelector('input[name="shipping"]:checked');return x?Number(x.dataset.cost):SHIPPING_COST_DEFAULT}
function currentDiscount(){return SSCart.subtotal()*promoRate}
function updateSummary(){const subtotal=SSCart.subtotal(),shipping=SSCart.get().length?getSelectedShippingCost():0,discount=currentDiscount(),total=Math.max(0,subtotal-discount+shipping);$("#sumSubtotal").textContent=formatRupiah(subtotal);$("#sumShipping").textContent=formatRupiah(shipping);$("#sumTotal").textContent=formatRupiah(total);$("#discountLine").hidden=!(discount>0);if(discount)$("#sumDiscount").textContent="- "+formatRupiah(discount);$("#toCheckoutBtn").disabled=!SSCart.get().length}
function setupPromo(){$("#promoApplyBtn")?.addEventListener("click",()=>{const code=$("#promoInput").value.trim().toUpperCase(),msg=$("#promoMsg");promoRate=VALID_PROMOS[code]||0;if(promoRate){msg.hidden=false;msg.className="promo-msg success";msg.textContent=`Kode berhasil dipakai! Diskon ${promoRate*100}% diterapkan 🎉`;}else{msg.hidden=false;msg.className="promo-msg error";msg.textContent="Kode promo tidak ditemukan atau sudah kedaluwarsa."}updateSummary()})}
function renderCheckoutRecap(){const cart=SSCart.get(),subtotal=SSCart.subtotal(),shipping=getSelectedShippingCost(),discount=currentDiscount(),total=Math.max(0,subtotal-discount+shipping);$("#recapItems").innerHTML=cart.map(i=>`<div class="recap-item-row"><span>${i.name} × ${i.qty}</span><span>${formatRupiah(i.price*i.qty)}</span></div>`).join("");$("#ckSubtotal").textContent=formatRupiah(subtotal);$("#ckShipping").textContent=formatRupiah(shipping);$("#ckTotal").textContent=formatRupiah(total);$("#ckDiscountLine").hidden=!(discount>0);if(discount)$("#ckDiscount").textContent="- "+formatRupiah(discount)}
function setupOptionCards(){$all(".option-cards").forEach(group=>group.querySelectorAll(".option-card").forEach(card=>card.addEventListener("click",()=>{group.querySelectorAll(".option-card").forEach(c=>c.classList.remove("selected"));card.classList.add("selected");const input=card.querySelector("input");if(input)input.checked=true;updateSummary();renderCheckoutRecap()})))}
function setupCheckoutForm(){$("#checkoutForm")?.addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget;if(!f.checkValidity()){f.reportValidity();return}await showStep(3)})}
function setupBackButtons(){
  $all("[data-action='back-to-cart']").forEach(b=>b.addEventListener("click",()=>{
    window.orderFinalized=false;
    showStep(1,"back");
  }));
}
async function finalizeOrder(){if(window.orderFinalized)return;window.orderFinalized=true;const cart=SSCart.get();if(!cart.length)return;const shipping=getSelectedShippingCost(),discount=currentDiscount(),data={shippingAddress:`${$("#recvName").value}, ${$("#recvPhone").value}, ${$("#recvAddress").value}, ${$("#recvCity").value} ${$("#recvPostal").value}`,shippingCost:shipping,discount};try{const d=await apiJSON("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});$("#orderIdText").textContent="#"+d.order.id;const express=document.querySelector('input[name="shipping"]:checked')?.value==="express",eta=new Date();eta.setDate(eta.getDate()+(express?1:3));$("#orderEtaText").textContent=`Estimasi tiba: ${eta.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"})}`;await SSCart.refresh();promoRate=0;launchConfetti()}catch(e){window.orderFinalized=false;SSToast.show(e.message,"error");await showStep(2,"back")}}
function launchConfetti(){const colors=["#b8283b","#a9c6ef","#f3b8c4","#e0b96a","#7a1f31"];for(let i=0;i<45;i++){const p=document.createElement("span");p.className="confetti-piece";const s=6+Math.random()*6;p.style.width=`${s}px`;p.style.height=`${s*.4}px`;p.style.left=`${Math.random()*100}vw`;p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.animationDuration=`${2.5+Math.random()*2}s`;document.body.appendChild(p);setTimeout(()=>p.remove(),5000)}}
document.addEventListener("DOMContentLoaded",async()=>{await SSAuth.ready();if(!SSAuth.isLoggedIn()){SSAuth.openModal();return}await SSCart.refresh();await renderCartItems();updateSummary();setupPromo();$("#toCheckoutBtn")?.addEventListener("click",()=>SSCart.get().length&&showStep(2));setupOptionCards();setupCheckoutForm();setupBackButtons();const f=$("#cartNewsletterForm");f?.addEventListener("submit",e=>{e.preventDefault();const v=f.querySelector("input[type=email]")?.value.trim();if(v){SSToast.show("Terima kasih! Update promo akan dikirim ke "+v,"success");f.reset()}});updateStepperUI(1)});
