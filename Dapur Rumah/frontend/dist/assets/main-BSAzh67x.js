import"./globals-BEQflRq_.js";/* empty css             */import{i as C}from"./ui-DpRDf-P5.js";import{a as c}from"./api-C7O6TzkL.js";C("home");document.addEventListener("DOMContentLoaded",async()=>{const h=document.getElementById("nav-login-btn");try{(await c("/api/auth/get-session")).session&&(h.textContent="Papan Pemuka",h.href="/dashboard.html")}catch{}let d="",u="",m="",p=0;const g=20,b=document.getElementById("search-input"),$=document.getElementById("state-filter"),E=document.getElementById("category-chips"),r=document.getElementById("catalog-grid"),f=document.getElementById("load-more-container"),l=document.getElementById("load-more-btn");await Promise.all([M(),k()]),await o(!0);let y;b.addEventListener("input",e=>{clearTimeout(y),y=setTimeout(()=>{d=e.target.value.trim(),o(!0)},500)}),$.addEventListener("change",e=>{m=e.target.value,o(!0)}),l.addEventListener("click",()=>{p++,o(!1)});async function M(){try{const e=await c("/api/categories");if(e.success&&e.data){const s=e.data.map(t=>`<button class="chip" data-id="${t.id}">${t.name}</button>`).join("");E.insertAdjacentHTML("beforeend",s),document.querySelectorAll(".chip").forEach(t=>{t.addEventListener("click",a=>{document.querySelectorAll(".chip").forEach(i=>i.classList.remove("active")),a.target.classList.add("active"),u=a.target.dataset.id,o(!0)})})}}catch(e){console.error("Failed to load categories",e)}}async function k(){try{const e=await c("/api/sellers/featured");if(e.success&&e.data&&e.data.length>0){const s=document.getElementById("featured-section"),t=document.getElementById("featured-carousel"),a=e.data.map(n=>{const w=n.shop_name?n.shop_name.charAt(0).toUpperCase():"🍽",B=n.profile_image?`<div class="featured-seller-avatar"><img src="${n.profile_image}" alt="${n.shop_name}" loading="lazy"></div>`:`<div class="featured-seller-avatar">${w}</div>`;return`
                        <a href="/seller.html?id=${n.id}" class="featured-seller-card">
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
                        </a>`}).join("");t.innerHTML=a,s.style.display="block";let i=!1,v=0,L=0;t.addEventListener("mousedown",n=>{i=!0,v=n.pageX-t.offsetLeft,L=t.scrollLeft}),t.addEventListener("mousemove",n=>{i&&(n.preventDefault(),t.scrollLeft=L-(n.pageX-t.offsetLeft-v))}),t.addEventListener("mouseup",()=>i=!1),t.addEventListener("mouseleave",()=>i=!1)}}catch{}}async function o(e=!0){e?(p=0,r.innerHTML='<p class="text-muted" style="text-align:center; grid-column:1/-1;">Memuatkan...</p>',f.style.display="none"):(l.textContent="Memuatkan...",l.disabled=!0);try{const s=p*g,t=new URLSearchParams({limit:g,offset:s});d&&t.append("q",d),u&&t.append("category",u),m&&t.append("state",m);const a=await c(`/api/products?${t.toString()}`);a.success?(x(a.data,e),a.data.length===g?f.style.display="block":f.style.display="none"):r.innerHTML=`<p class="empty-state" style="grid-column:1/-1; text-align:center;">Ralat pelayan: ${a.error}</p>`}catch{r.innerHTML='<p class="empty-state" style="grid-column:1/-1; text-align:center;">Gagal menghubungi pelayan.</p>'}finally{e||(l.textContent="Muatkan Lagi",l.disabled=!1)}}function x(e,s){if(s&&e.length===0){r.innerHTML=`
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background:var(--background-color); border-radius: 12px;">
                    <h3 style="margin-bottom:0.5rem;">Tiada Makanan Dijumpai</h3>
                    <p class="text-muted">Cuba carian atau kategori yang berbeza.</p>
                </div>
            `;return}const t=e.map(a=>`
            <a href="/product.html?id=${a.id}" class="product-card">
                <div class="product-badges">
                    <span class="badge badge-${a.status}">${a.status.replace("_"," ").toUpperCase()}</span>
                </div>
                ${a.image_url?`<img src="${a.image_url}" class="product-image" loading="lazy" alt="${a.name}">`:'<div class="product-image" style="display:flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>'}
                <div class="product-info">
                    <h3 class="product-title">${a.name}</h3>
                    <div class="shop-name">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${a.seller.shop_name} &bull; ${a.seller.state}
                    </div>
                    <div class="product-price">RM ${a.price.toFixed(2)}${a.price_note?` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${a.price_note}</small>`:""}</div>
                </div>
            </a>
        `).join("");s?r.innerHTML=t:r.insertAdjacentHTML("beforeend",t)}});
