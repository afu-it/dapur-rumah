import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                */const y=[{id:1,name:"Nasi Lemak Ayam Berempah",seller:"Kak Mah Kitchen",price:8.5,category:"masakan_panas",img:"https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=300"},{id:2,name:"Kek Coklat Moist",seller:"Bake By Sarah",price:15,category:"pencuci_mulut",img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300"},{id:3,name:"Mee Goreng Mamak",seller:"Warisan Nenek",price:6,category:"masakan_panas",img:"https://images.unsplash.com/photo-1626082896492-766af4eb65ed?auto=format&fit=crop&q=80&w=300"},{id:4,name:"Karipap Pusing (10pcs)",seller:"Makcik Kiah",price:5,category:"kuih",img:"https://images.unsplash.com/photo-1605333396914-230f293a9089?auto=format&fit=crop&q=80&w=300"},{id:5,name:"Ayam Masak Merah",seller:"Dapur Nisa",price:12,category:"berlauk",img:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300"},{id:6,name:"Keropok Lekor",seller:"Pok Jeli",price:4,category:"makanan_ringan",img:"https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=300"},{id:7,name:"Roti Canai Kari",seller:"Abang Roti",price:3.5,category:"masakan_panas",img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300"},{id:8,name:"Biskut Coklat Chip",seller:"Baker Sofea",price:12,category:"kuih",img:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=300"}];let c=[],o={name:"",phone:"",address:""},r=[];function h(){const e=localStorage.getItem("dapur_rumah_products");return e?JSON.parse(e).map(t=>({id:t.id,name:t.name,seller:localStorage.getItem("dapur_rumah_seller")?JSON.parse(localStorage.getItem("dapur_rumah_seller")).name:"Demo Seller",price:t.price,category:"masakan_panas",img:t.image})):y}document.addEventListener("DOMContentLoaded",()=>{E(),r=h(),l(r,"home-products"),f(),m()});window.switchTab=function(e){document.querySelectorAll(".tab-page").forEach(t=>t.classList.remove("active")),document.getElementById(`tab-${e}`).classList.add("active"),document.querySelectorAll(".nav-item").forEach(t=>t.classList.remove("active")),document.querySelector(`.nav-item[data-tab="${e}"]`).classList.add("active"),e==="cart"&&g(),e==="search"&&setTimeout(()=>document.getElementById("main-search-input").focus(),100)};window.openLocationModal=function(){switchTab("account"),typeof window.switchAccountSection=="function"&&window.switchAccountSection("address"),setTimeout(()=>{const e=document.getElementById("acc-address");e&&e.focus()},120)};function f(){document.querySelectorAll(".category-item").forEach(a=>{a.addEventListener("click",n=>{const s=n.currentTarget;document.querySelectorAll(".category-item").forEach(d=>d.classList.remove("active")),s.classList.add("active");let i=s.dataset.cat,u=i==="all"?r:r.filter(d=>d.category===i);l(u,"home-products"),document.getElementById("product-count").textContent=`${u.length} items`})});const e=document.getElementById("main-search-input"),t=document.getElementById("clear-search");e.addEventListener("input",a=>{const n=a.target.value.toLowerCase();if(n.length>0){t.style.display="block",document.getElementById("search-suggestions").style.display="none",document.getElementById("search-results").style.display="grid";const s=r.filter(i=>i.name.toLowerCase().includes(n)||i.seller.toLowerCase().includes(n));l(s,"search-results")}else t.style.display="none",document.getElementById("search-suggestions").style.display="block",document.getElementById("search-results").style.display="none"}),t.addEventListener("click",()=>{e.value="",e.dispatchEvent(new Event("input")),e.focus()}),document.getElementById("profile-form").addEventListener("submit",a=>{a.preventDefault(),o.name=document.getElementById("acc-name").value,o.phone=document.getElementById("acc-phone").value,localStorage.setItem("dapur_rumah_profile",JSON.stringify(o)),p()}),document.getElementById("address-form").addEventListener("submit",a=>{a.preventDefault(),o.address=document.getElementById("acc-address").value,localStorage.setItem("dapur_rumah_profile",JSON.stringify(o)),p()}),document.getElementById("btn-whatsapp-seller").addEventListener("click",B)}function p(){const e=document.getElementById("save-msg");e.classList.add("show"),setTimeout(()=>e.classList.remove("show"),3e3)}window.switchAccountSection=function(e){document.querySelectorAll(".section-tab").forEach(t=>t.classList.remove("active")),document.querySelector(`.section-tab[data-section="${e}"]`).classList.add("active"),document.querySelectorAll(".account-section").forEach(t=>t.classList.remove("active")),document.getElementById(`section-${e}`).classList.add("active")};function l(e,t){const a=document.getElementById(t);if(e.length===0){a.innerHTML=`
            <div class="products-empty-state">
                <p style="font-size:24px; margin-bottom:8px;">🔍</p>
                <p>Tiada makanan dijumpai</p>
            </div>
        `;return}a.innerHTML=e.map(n=>`
        <div class="product-card">
            <img src="${n.img}" alt="${n.name}" loading="lazy">
            <div class="product-info">
                <div class="product-title">${n.name}</div>
                <div class="product-bottom">
                    <div class="product-price">RM ${n.price.toFixed(2)}</div>
                    <div class="product-rating">
                        <span class="star">★</span>
                        <span>${(4.6+n.id%4*.1).toFixed(1)} (${100+n.id%3*100}+)</span>
                    </div>
                </div>
            </div>
            <button class="btn-add" onclick="addToCart(${n.id})" aria-label="Tambah ke troli">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </button>
        </div>
    `).join("")}window.setSearch=function(e){const t=document.getElementById("main-search-input");t.value=e,t.dispatchEvent(new Event("input"))};window.addToCart=function(e){const t=r.find(n=>n.id===e),a=c.find(n=>n.id===e);a?a.qty++:c.push({...t,qty:1}),m(),v()};window.updateQty=function(e,t){const a=c.find(n=>n.id===e);a&&(a.qty+=t,a.qty<=0&&(c=c.filter(n=>n.id!==e)),m(),g())};function m(){const e=c.reduce((a,n)=>a+n.qty,0),t=document.getElementById("cart-badge");t.textContent=e,t.style.display=e>0?"flex":"none"}function v(){const e=document.querySelector(".cart-icon");e.style.transform="scale(1.2)",setTimeout(()=>e.style.transform="scale(1)",200)}function g(){const e=document.getElementById("cart-empty"),t=document.getElementById("cart-filled"),a=document.getElementById("cart-items");if(c.length===0){e.style.display="flex",t.style.display="none";return}e.style.display="none",t.style.display="block",a.innerHTML=c.map(s=>`
        <div class="cart-item">
            <img src="${s.img}" alt="${s.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${s.name}</div>
                <div class="cart-item-price">RM ${(s.price*s.qty).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${s.id}, -1)">-</button>
                    <span>${s.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${s.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join("");const n=c.reduce((s,i)=>s+i.price*i.qty,0);document.getElementById("cart-subtotal").textContent=`RM ${n.toFixed(2)}`,document.getElementById("review-name").textContent=`Nama: ${o.name||"-"}`,document.getElementById("review-phone").textContent=`Tel: ${o.phone||"-"}`,document.getElementById("review-address").textContent=`Alamat: ${o.address||"-"}`,w(n)}function E(){const e=localStorage.getItem("dapur_rumah_profile");e&&(o=JSON.parse(e),document.getElementById("acc-name").value=o.name,document.getElementById("acc-phone").value=o.phone,document.getElementById("acc-address").value=o.address,document.getElementById("display-location").textContent=o.address?"Alamat Disimpan":"Pilih Lokasi")}function w(e){if(c.length===0)return;let t=`*PESANAN BARU - DAPUR RUMAH*

`;c.forEach((a,n)=>{t+=`${n+1}. ${a.name}
   Qty: ${a.qty} x RM ${a.price.toFixed(2)} = RM ${(a.price*a.qty).toFixed(2)}

`}),t+=`------------------------
`,t+=`*JUMLAH: RM ${e.toFixed(2)}*

`,t+=`*MAKLUMAT PENGGUNA:*
`,t+=`Nama: ${o.name||"Belum diisi"}
`,t+=`No. Telefon: ${o.phone||"Belum diisi"}
`,t+=`Alamat: ${o.address||"Belum diisi"}`,document.getElementById("ai-message-text").value=t}function B(){if(c.length===0)return;if(!o.name||!o.phone||!o.address){alert("Sila lengkapkan maklumat profil anda terlebih dahulu!"),switchTab("account");return}const e=document.getElementById("ai-message-text").value,t=encodeURIComponent(e);window.open(`https://wa.me/60123456789?text=${t}`,"_blank")}
