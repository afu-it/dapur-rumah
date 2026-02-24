import { apiFetch } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('seller-container');

    // Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('id');

    if (!sellerId) {
        container.innerHTML = '<div style="text-align: center; padding: 4rem;"><h2>Ralat 404</h2><p>Profil peniaga tidak dijumpai.</p></div>';
        return;
    }

    try {
        const res = await apiFetch(`/api/sellers/${sellerId}`);

        if (res.success && res.data) {
            renderSeller(res.data.profile, res.data.products);
        } else {
            throw new Error(res.error || 'Peniaga tidak dijumpai');
        }
    } catch (e) {
        container.innerHTML = `<div style="text-align: center; padding: 4rem; color: var(--error-color);"><h2>Oops!</h2><p>${e.message}</p></div>`;
    }

    function renderSeller(profile, products) {
        document.title = `${profile.shop_name} | Dapur Rumah`;

        const initial = profile.shop_name.charAt(0).toUpperCase();
        const avatarHtml = profile.profile_image
            ? `<img src="${profile.profile_image}" class="seller-avatar-large" alt="${profile.shop_name}">`
            : `<div class="seller-avatar-large">${initial}</div>`;

        // We reuse the Grid structure from home.css to render the items
        let productsHtml = '<div class="empty-state" style="grid-column:1/-1;text-align:center;">Tiada produk tersedia buat masa ini.</div>';

        if (products.length > 0) {
            productsHtml = products.map(p => `
                <a href="/product.html?id=${p.id}" class="product-card">
                    <div class="product-badges">
                        <span class="badge badge-${p.status}">${p.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    ${p.image_url ? `<img src="${p.image_url}" class="product-image" loading="lazy" alt="${p.name}">` : `<div class="product-image" style="display:flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>`}
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <div class="product-price">RM ${p.price.toFixed(2)}${p.price_note ? ` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${p.price_note}</small>` : ''}</div>
                    </div>
                </a>
            `).join('');
        }

        const html = `
            <div class="seller-header">
                ${avatarHtml}
                <div class="seller-details">
                    <h1>${profile.shop_name}</h1>
                    <div class="seller-meta">
                        <span>📍 ${profile.state}</span>
                    </div>
                    <div class="seller-desc">
                        ${profile.description ? profile.description.replace(/\n/g, '<br>') : 'Menjual pelbagai juadah rumah yang lazat.'}
                    </div>
                </div>
            </div>

            <h2 class="section-title">Produk dari ${profile.shop_name}</h2>
            <div class="catalog-section">
                <div class="products-grid">
                    ${productsHtml}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
});
