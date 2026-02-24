import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                */import{a as i}from"./api-Cl8Z2mE8.js";let d=[];document.addEventListener("DOMContentLoaded",async()=>{const c=document.getElementById("admin-content"),m=document.getElementById("access-denied"),u=document.getElementById("admin-user"),f=document.getElementById("logout-btn");let y;try{const e=await i("/api/auth/get-session");if(!e.session){window.location.href="login.html";return}y=e,u.textContent=e.user.name||e.user.email}catch{window.location.href="login.html";return}try{const e=await i("/api/admin/sellers");if(!e.success)throw new Error("not admin");c.style.display="block",s(e.data),l(e.data)}catch{m.style.display="block";return}f.addEventListener("click",async()=>{await i("/api/auth/sign-out",{method:"POST"}),window.location.href="login.html"}),document.getElementById("refresh-btn").addEventListener("click",r),document.getElementById("seller-search").addEventListener("input",e=>{const a=e.target.value.toLowerCase(),t=d.filter(n=>n.shop_name.toLowerCase().includes(a)||(n.state||"").toLowerCase().includes(a));l(t)});async function r(){const e=await i("/api/admin/sellers");e.success&&(d=e.data,s(d),l(d))}function s(e){document.getElementById("total-sellers").textContent=e.length,document.getElementById("total-featured").textContent=e.filter(a=>a.is_featured).length,document.getElementById("total-active").textContent=e.filter(a=>a.is_active).length}function l(e){d=e;const a=document.getElementById("seller-rows");if(e.length===0){a.innerHTML='<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:2rem;">Tiada peniaga dijumpai.</td></tr>';return}a.innerHTML=e.map(t=>{const n=t.shop_name?t.shop_name.charAt(0).toUpperCase():"?",o=t.profile_image?`<img src="${t.profile_image}" class="seller-mini-avatar" style="border-radius:50%; width:36px; height:36px; object-fit:cover;" alt="">`:`<div class="seller-mini-avatar">${n}</div>`;return`
            <tr data-id="${t.id}">
                <td>
                    <div class="seller-cell">
                        ${o}
                        <div>
                            <div style="font-weight:600; font-size:0.875rem;">${t.shop_name||'<em style="color:#94a3b8">Belum ditetapkan</em>'}</div>
                            <div style="font-size:0.75rem; color:#94a3b8;">${t.phone_whatsapp||"—"}</div>
                        </div>
                    </div>
                </td>
                <td style="color:var(--text-muted); font-size:0.875rem;">${t.state||"—"}</td>
                <td style="text-align:center; font-weight:600;">${t.product_count}</td>
                <td style="text-align:center;">
                    <button class="toggle-btn feature-btn ${t.is_featured?"on":"off"}"
                        data-id="${t.id}" data-state="${t.is_featured?1:0}">
                        ${t.is_featured?"⭐ Pilihan":"☆ Biasa"}
                    </button>
                </td>
                <td style="text-align:center;">
                    <button class="toggle-btn activate-btn ${t.is_active?"on":"off"}"
                        data-id="${t.id}" data-state="${t.is_active?1:0}">
                        ${t.is_active?"✓ Aktif":"✗ Tidak Aktif"}
                    </button>
                </td>
                <td>
                    <a href="seller.html?id=${t.id}" target="_blank" style="font-size:0.75rem; color:var(--primary-color); text-decoration:none; font-weight:600;">Lihat →</a>
                </td>
            </tr>`}).join(""),a.querySelectorAll(".feature-btn").forEach(t=>{t.addEventListener("click",async()=>{const n=t.dataset.id,o=t.dataset.state==="1";t.disabled=!0;try{await i(`/api/admin/sellers/${n}/feature`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({featured:!o})}),await r()}finally{t.disabled=!1}})}),a.querySelectorAll(".activate-btn").forEach(t=>{t.addEventListener("click",async()=>{const n=t.dataset.id,o=t.dataset.state==="1";t.disabled=!0;try{await i(`/api/admin/sellers/${n}/activate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!o})}),await r()}finally{t.disabled=!1}})})}});
