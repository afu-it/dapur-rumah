import"./globals-BEQflRq_.js";/* empty css             */import{i as C}from"./ui-CiVMqkfw.js";import{a as c}from"./api-xYnICvys.js";C("home");document.addEventListener("DOMContentLoaded",async()=>{const h=document.getElementById("nav-login-btn");try{(await c("/api/auth/get-session")).session&&(h.textContent="Papan Pemuka",h.href="dashboard.html")}catch{}let d="",u="",m="",p=0;const g=20,b=document.getElementById("search-input"),$=document.getElementById("state-filter"),E=document.getElementById("category-chips"),i=document.getElementById("catalog-grid"),f=document.getElementById("load-more-container"),o=document.getElementById("load-more-btn");await Promise.all([k(),M()]),await l(!0);let y;b.addEventListener("input",t=>{clearTimeout(y),y=setTimeout(()=>{d=t.target.value.trim(),l(!0)},500)}),$.addEventListener("change",t=>{m=t.target.value,l(!0)}),o.addEventListener("click",()=>{p++,l(!1)});async function k(){try{const t=await c("/api/categories");if(t.success&&t.data){const s=t.data.map(a=>`<button class="chip" data-id="${a.id}">${a.name}</button>`).join("");E.insertAdjacentHTML("beforeend",s),document.querySelectorAll(".chip").forEach(a=>{a.addEventListener("click",e=>{document.querySelectorAll(".chip").forEach(r=>r.classList.remove("active")),e.target.classList.add("active"),u=e.target.dataset.id,l(!0)})})}}catch(t){console.error("Failed to load categories",t)}}async function M(){try{const t=await c("/api/sellers/featured");if(t.success&&t.data&&t.data.length>0){const s=document.getElementById("featured-section"),a=document.getElementById("featured-carousel"),e=t.data.map(n=>{const w=n.shop_name?n.shop_name.charAt(0).toUpperCase():"🍽",B=n.profile_image?`<div class="featured-seller-avatar"><img src="${n.profile_image}" alt="${n.shop_name}" loading="lazy"></div>`:`<div class="featured-seller-avatar">${w}</div>`;return`
                        <a href="seller.html?id=${n.id}" class="featured-seller-card">
                            ${B}
                            <div>
                                <p class="featured-seller-name">${n.shop_name}</p>
                                <p class="featured-seller-state">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    ${n.state}
                                </p>
                            </div>
                            ${n.description?`<p class="featured-seller-desc">${n.description}</p>`:""}
                            <span class="featured-badge">⭐ Peniaga Pilihan</span>
                        </a>`}).join("");a.innerHTML=e,s.style.display="block";let r=!1,v=0,L=0;a.addEventListener("mousedown",n=>{r=!0,v=n.pageX-a.offsetLeft,L=a.scrollLeft}),a.addEventListener("mousemove",n=>{r&&(n.preventDefault(),a.scrollLeft=L-(n.pageX-a.offsetLeft-v))}),a.addEventListener("mouseup",()=>r=!1),a.addEventListener("mouseleave",()=>r=!1)}}catch{}}async function l(t=!0){t?(p=0,i.innerHTML='<p class="text-muted" style="text-align:center; grid-column:1/-1;">Memuatkan...</p>',f.style.display="none"):(o.textContent="Memuatkan...",o.disabled=!0);try{const s=p*g,a=new URLSearchParams({limit:g,offset:s});d&&a.append("q",d),u&&a.append("category",u),m&&a.append("state",m);const e=await c(`/api/products?${a.toString()}`);if(e.success)x(e.data,t),e.data.length===g?f.style.display="block":f.style.display="none";else{const r=typeof e=="string"?e:(e==null?void 0:e.error)||(e==null?void 0:e.message)||"Ralat tidak diketahui";i.innerHTML=`<p class="empty-state" style="grid-column:1/-1; text-align:center;">Ralat pelayan: ${r}</p>`}}catch{i.innerHTML='<p class="empty-state" style="grid-column:1/-1; text-align:center;">Gagal menghubungi pelayan.</p>'}finally{t||(o.textContent="Muatkan Lagi",o.disabled=!1)}}function x(t,s){if(s&&t.length===0){i.innerHTML=`
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background:var(--background-color); border-radius: 12px;">
                    <h3 style="margin-bottom:0.5rem;">Tiada Makanan Dijumpai</h3>
                    <p class="text-muted">Cuba carian atau kategori yang berbeza.</p>
                </div>
            `;return}const a=t.map(e=>`
            <a href="product.html?id=${e.id}" class="product-card">
                <div class="product-badges">
                    <span class="badge badge-${e.status}">${e.status.replace("_"," ").toUpperCase()}</span>
                </div>
                ${e.image_url?`<img src="${e.image_url}" class="product-image" loading="lazy" alt="${e.name}">`:'<div class="product-image" style="display:flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>'}
                <div class="product-info">
                    <h3 class="product-title">${e.name}</h3>
                    <div class="shop-name">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${e.seller.shop_name} &bull; ${e.seller.state}
                    </div>
                    <div class="product-price">RM ${e.price.toFixed(2)}${e.price_note?` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${e.price_note}</small>`:""}</div>
                </div>
            </a>
        `).join("");s?i.innerHTML=a:i.insertAdjacentHTML("beforeend",a)}});
