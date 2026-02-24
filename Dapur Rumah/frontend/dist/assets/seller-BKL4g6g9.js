import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                */import{a as o}from"./api-Cl8Z2mE8.js";document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("seller-container"),s=new URLSearchParams(window.location.search).get("id");if(!s){t.innerHTML='<div style="text-align: center; padding: 4rem;"><h2>Ralat 404</h2><p>Profil peniaga tidak dijumpai.</p></div>';return}try{const a=await o(`/api/sellers/${s}`);if(a.success&&a.data)d(a.data.profile,a.data.products);else throw new Error(a.error||"Peniaga tidak dijumpai")}catch(a){t.innerHTML=`<div style="text-align: center; padding: 4rem; color: var(--error-color);"><h2>Oops!</h2><p>${a.message}</p></div>`}function d(a,i){document.title=`${a.shop_name} | Dapur Rumah`;const l=a.shop_name.charAt(0).toUpperCase(),n=a.profile_image?`<img src="${a.profile_image}" class="seller-avatar-large" alt="${a.shop_name}">`:`<div class="seller-avatar-large">${l}</div>`;let r='<div class="empty-state" style="grid-column:1/-1;text-align:center;">Tiada produk tersedia buat masa ini.</div>';i.length>0&&(r=i.map(e=>`
                <a href="product.html?id=${e.id}" class="product-card">
                    <div class="product-badges">
                        <span class="badge badge-${e.status}">${e.status.replace("_"," ").toUpperCase()}</span>
                    </div>
                    ${e.image_url?`<img src="${e.image_url}" class="product-image" loading="lazy" alt="${e.name}">`:'<div class="product-image" style="display:flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>'}
                    <div class="product-info">
                        <h3 class="product-title">${e.name}</h3>
                        <div class="product-price">RM ${e.price.toFixed(2)}${e.price_note?` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${e.price_note}</small>`:""}</div>
                    </div>
                </a>
            `).join(""));const c=`
            <div class="seller-header">
                ${n}
                <div class="seller-details">
                    <h1>${a.shop_name}</h1>
                    <div class="seller-meta">
                        <span>📍 ${a.state}</span>
                    </div>
                    <div class="seller-desc">
                        ${a.description?a.description.replace(/\n/g,"<br>"):"Menjual pelbagai juadah rumah yang lazat."}
                    </div>
                </div>
            </div>

            <h2 class="section-title">Produk dari ${a.shop_name}</h2>
            <div class="catalog-section">
                <div class="products-grid">
                    ${r}
                </div>
            </div>
        `;t.innerHTML=c}});
