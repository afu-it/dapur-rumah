import"./globals-BEQflRq_.js";import{i as g}from"./ui-CiVMqkfw.js";import{a as l}from"./api-xYnICvys.js";g("home");function o(t,r){l("/api/track",{method:"POST",body:{product_id:t,event:r}}).catch(()=>{})}document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("product-container"),s=new URLSearchParams(window.location.search).get("id");if(!s){t.innerHTML='<div style="text-align: center; padding: 4rem;"><h2>Ralat 404</h2><p>Produk tidak dijumpai.</p></div>';return}try{const e=await l(`/api/products/${s}`);if(e.success&&e.data)d(e.data),o(e.data.id,"view");else throw new Error(e.error||"Produk tidak dijumpai")}catch(e){t.innerHTML=`<div style="text-align: center; padding: 4rem; color: var(--error-color);"><h2>Oops!</h2><p>${e.message}</p></div>`}function d(e){document.title=`${e.name} - ${e.seller.shop_name} | Dapur Rumah`;let a=e.seller.phone_whatsapp;a.startsWith("0")&&(a="6"+a);const h=encodeURIComponent(`Hai ${e.seller.shop_name}, saya berminat dengan produk ini:

*${e.name}* (RM ${e.price.toFixed(2)})

Adakah ia masih tersedia?

https://dapurrumah.com/product.html?id=${e.id}`),m=`https://wa.me/${a}?text=${h}`;let n='<div class="product-hero-image" style="display:flex; align-items:center; justify-content:center; color:#999; font-size:1.5rem;">Tiada Gambar</div>';e.image_url&&(n=`<img src="${e.image_url}" class="product-hero-image" alt="${e.name}">`);const p=e.seller.shop_name.charAt(0).toUpperCase(),u=`
            <div class="product-split">
                <div class="product-visual">
                    ${n}
                </div>
                
                <div class="product-details">
                    <span class="badge badge-${e.status}">${e.status.replace("_"," ").toUpperCase()}</span>
                    <h1 class="product-title">${e.name}</h1>
                    <div class="product-price">RM ${e.price.toFixed(2)}${e.price_note?` <small style="font-size:1rem;color:#64748b;font-weight:normal;">/ ${e.price_note}</small>`:""}</div>
                    
                    <div class="product-desc">
                        ${e.description?e.description.replace(/\n/g,"<br>"):'<span class="text-muted">Tiada penerangan disediakan.</span>'}
                    </div>

                    <a href="seller.html?id=${e.seller.id}" class="seller-profile-card">
                        ${e.seller.profile_image?`<img src="${e.seller.profile_image}" class="seller-avatar" style="object-fit:cover;">`:`<div class="seller-avatar">${p}</div>`}
                        <div class="seller-info">
                            <h3>${e.seller.shop_name}</h3>
                            <p>${e.seller.state}</p>
                        </div>
                    </a>

                    <div class="whatsapp-cta-wrapper" style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="${m}" target="_blank" class="whatsapp-cta">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            Tempah via WhatsApp
                        </a>
                        <button id="share-btn" class="btn btn-outline" style="display:flex; align-items:center; justify-content:center; gap:0.5rem; width:100%; padding:0.75rem; cursor:pointer;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            Kongsi Produk
                        </button>
                    </div>
                </div>
            </div>
        `;t.innerHTML=u;const i=document.getElementById("share-btn");i&&i.addEventListener("click",async()=>{const v={title:e.name,text:`${e.name} oleh ${e.seller.shop_name} — RM ${e.price.toFixed(2)}. Beli terus via WhatsApp!`,url:window.location.href};try{navigator.share?await navigator.share(v):(await navigator.clipboard.writeText(window.location.href),i.textContent="✓ Pautan disalin!",setTimeout(()=>{i.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Kongsi Produk'},2500))}catch{}});const c=t.querySelector(".whatsapp-cta");c&&c.addEventListener("click",()=>o(e.id,"whatsapp_click"))}});
