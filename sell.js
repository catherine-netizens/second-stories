const MAX_PHOTOS=8;const state={currentStep:1,photos:[],ktpFile:null,ktpUrl:null};
function $(s){return document.querySelector(s)}function $all(s){return [...document.querySelectorAll(s)]}function fileToDataUrl(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function updateStepperUI(step){$all(".step-item").forEach(i=>{const n=Number(i.dataset.step);i.classList.remove("active","completed");if(n<step)i.classList.add("completed");if(n===step)i.classList.add("active")})}
function showStep(step,dir="forward"){$all(".sell-step").forEach(p=>{p.hidden=Number(p.dataset.stepPanel)!==step;p.classList.toggle("slide-back",Number(p.dataset.stepPanel)===step&&dir==="back")});const hero=$("#sellHero");if(hero)hero.style.display=step===1?"":"none";state.currentStep=step;updateStepperUI(step);if(step===3)renderPreview();if(step===4)launchConfetti();scrollTo({top:0,behavior:"smooth"})}
function setupCounters(){[["#itemDesc","#descCount"],["#itemNote","#noteCount"]].forEach(([a,b])=>$(a)?.addEventListener("input",()=>$(b).textContent=$(a).value.length))}
function setupConditions(){$all(".condition-btn").forEach(b=>b.addEventListener("click",()=>{$all(".condition-btn").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");$("#conditionError").hidden=true}))}
function condition(){return $(".condition-btn.selected")?.dataset.value||""}
function renderPhotos(){const g=$("#photoGrid");g.innerHTML="";state.photos.forEach((p,i)=>{const t=document.createElement("div");t.className="photo-tile";t.innerHTML=`<img src="${p.url}" alt="Foto barang ${i+1}"><button type="button" class="remove-photo" data-index="${i}">✕</button>`;g.appendChild(t)});for(let i=state.photos.length;i<MAX_PHOTOS;i++){const t=document.createElement("div");t.className="photo-tile empty-tile";t.innerHTML="<span>+</span>";t.onclick=()=>$("#photoInput").click();g.appendChild(t)}g.querySelectorAll(".remove-photo").forEach(b=>b.onclick=e=>{e.stopPropagation();state.photos.splice(Number(b.dataset.index),1);renderPhotos()})}
async function addPhotos(files){for(const f of [...files].slice(0,MAX_PHOTOS-state.photos.length)){if(!f.type.startsWith("image/"))continue;if(f.size>5*1024*1024){SSToast.show(`${f.name} lebih dari 5MB.`,"error");continue}state.photos.push({file:f,url:await fileToDataUrl(f)})}renderPhotos();if(state.photos.length)$("#photoError").hidden=true}
function setupPhoto(){const d=$("#dropzone"),i=$("#photoInput");d.onclick=()=>i.click();i.onchange=e=>addPhotos(e.target.files);["dragenter","dragover"].forEach(x=>d.addEventListener(x,e=>{e.preventDefault();d.classList.add("dragover")}));["dragleave","drop"].forEach(x=>d.addEventListener(x,e=>{e.preventDefault();d.classList.remove("dragover")}));d.addEventListener("drop",e=>e.dataTransfer.files.length&&addPhotos(e.dataTransfer.files));renderPhotos()}
function setupKtp(){const u=$("#ktpUpload"),i=$("#ktpInput"),w=$("#ktpPreviewWrap"),img=$("#ktpPreviewImg");u.onclick=()=>i.click();i.onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>5*1024*1024){SSToast.show("Ukuran file KTP lebih dari 5MB.","error");return}state.ktpFile=f;state.ktpUrl=await fileToDataUrl(f);img.src=state.ktpUrl;w.hidden=false;u.style.display="none"};$("#ktpRemove").onclick=()=>{state.ktpFile=null;state.ktpUrl=null;i.value="";w.hidden=true;u.style.display=""}}
function setupStep1(){const f=$("#dataProdukForm");f.onsubmit=e=>{e.preventDefault();let ok=true;if(Number($("#itemPrice").value)<=0){$("#priceError").hidden=false;ok=false}else $("#priceError").hidden=true;if(!condition()){$("#conditionError").hidden=false;ok=false}if(!state.photos.length){$("#photoError").hidden=false;ok=false}if(!state.ktpFile){SSToast.show("Upload foto KTP terlebih dahulu ya.","error");ok=false}if(!$("#agreeCheck").checked){$("#agreeWrap").dispatchEvent(new Event("invalid-shake"));ok=false}if(!f.checkValidity()){f.reportValidity();ok=false}if(!ok)return;$("#agreeCheck2").checked=true;$("#toPreviewBtn").disabled=false;showStep(2)}}
function renderPreview(){$("#pvName").textContent=$("#itemName").value||"—";$("#pvPrice").textContent=ssFormatRupiah($("#itemPrice").value);$("#pvCondition").textContent=condition()||"—";$("#pvDesc").textContent=$("#itemDesc").value||"—";$("#pvOwnership").textContent=$("#ownership").value||"—";$("#pvNote").textContent=$("#itemNote").value||"-";$("#pvPhotoGrid").innerHTML=state.photos.map(p=>`<img src="${p.url}" alt="Foto barang">`).join("");$("#pvKtpName").textContent=$("#ktpName").value||"—";$("#pvKtpNik").textContent=$("#ktpNik").value||"—";if(state.ktpUrl)$("#pvKtpImg").src=state.ktpUrl}
async function publish(){
  try{
    await SSAuth.ready();
    if(!SSAuth.isLoggedIn()){SSAuth.openModal();return}
    const images=state.photos.map(p=>p.url);
    // Cek total ukuran foto (base64) sebelum kirim, supaya user dapat pesan yang
    // jelas kalau totalnya kelewat batas server, bukan gagal diam-diam.
    const totalSize=images.reduce((s,u)=>s+u.length,0);
    if(totalSize>25*1024*1024){
      SSToast.show("Total ukuran foto terlalu besar. Kurangi jumlah foto atau pakai foto dengan ukuran lebih kecil, lalu coba lagi.","error");
      return;
    }
    const submitBtn=$("#submitBtn");if(submitBtn){submitBtn.disabled=true;submitBtn.textContent="Mengirim...";}
    try{
      await apiJSON("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:$("#itemName").value,price:Number($("#itemPrice").value),category:$("#itemCategory").value,condition:condition(),description:$("#itemDesc").value,ownership:$("#ownership").value,note:$("#itemNote").value,images})});
      showStep(4);
      SSToast.show("Barang berhasil masuk ke database!","success");
    } finally {
      if(submitBtn){submitBtn.disabled=false;submitBtn.textContent="Ya, Promosikan Barang Saya →";}
    }
  }catch(e){SSToast.show(e.message,"error")}
}
function setupStep2(){$("#agreeCheck2").addEventListener("change",()=>$("#toPreviewBtn").disabled=!$("#agreeCheck2").checked);$("#toPreviewBtn").onclick=()=>$("#agreeCheck2").checked&&showStep(3)}
function setupBack(){$all("[data-action]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.action==="back-to-1")showStep(1,"back");if(b.dataset.action==="back-to-2")showStep(2,"back")}))}
function launchConfetti(){const colors=["#b8283b","#a9c6ef","#f3b8c4","#e0b96a","#7a1f31"];for(let i=0;i<40;i++){const p=document.createElement("span"),s=6+Math.random()*6;p.className="confetti-piece";p.style.width=`${s}px`;p.style.height=`${s*.4}px`;p.style.left=`${Math.random()*100}vw`;p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.animationDuration=`${2.5+Math.random()*2}s`;document.body.appendChild(p);setTimeout(()=>p.remove(),5000)}}
document.addEventListener("DOMContentLoaded",async()=>{await SSAuth.ready();if(!SSAuth.isLoggedIn())SSAuth.openModal();setupCounters();setupConditions();setupPhoto();setupKtp();setupStep1();setupStep2();setupBack();$("#submitBtn").onclick=publish;$("#viewMyItemsBtn").onclick=()=>location.href="profile.html";const f=$("#sellNewsletterForm");f?.addEventListener("submit",e=>{e.preventDefault();SSToast.show("Terima kasih! Update promo akan dikirim ke email kamu.","success");f.reset()});updateStepperUI(1)});