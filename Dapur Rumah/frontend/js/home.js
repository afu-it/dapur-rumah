import { apiFetch } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Determine Auth/Nav State
    const navLoginBtn = document.getElementById('nav-login-btn');
    try {
        const sessionRes = await apiFetch('/api/auth/get-session');
        if (sessionRes.session) {
            navLoginBtn.textContent = 'Papan Pemuka';
            navLoginBtn.href = '/dashboard.html';
        }
    } catch (e) { }

    // State
    let currentQuery = '';
    let currentCategory = '';
    let currentState = '';
    let currentPage = 0;
    const LIMIT = 20;

    // Elements
    const searchInput = document.getElementById('search-input');
    const stateFilter = document.getElementById('state-filter');
    const categoryChipsContainer = document.getElementById('category-chips');
    const catalogGrid = document.getElementById('catalog-grid');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Init Data
    await Promise.all([
        loadCategories(),
        loadFeaturedSellers(),
    ]);
    await fetchProducts(true);

    // Event Listeners
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentQuery = e.target.value.trim();
            fetchProducts(true);
        }, 500); // Debounce 500ms
    });

    stateFilter.addEventListener('change', (e) => {
        currentState = e.target.value;
        fetchProducts(true);
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchProducts(false);
    });

    async function loadCategories() {
        try {
            const res = await apiFetch('/api/categories');
            if (res.success && res.data) {
                const chipsHtml = res.data.map(c =>
                    `<button class="chip" data-id="${c.id}">${c.name}</button>`
                ).join('');

                // Append without overwriting the 'Semua' button
                categoryChipsContainer.insertAdjacentHTML('beforeend', chipsHtml);

                // Add click listeners to all chips
                document.querySelectorAll('.chip').forEach(chip => {
                    chip.addEventListener('click', (e) => {
                        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                        e.target.classList.add('active');
                        currentCategory = e.target.dataset.id;
                        fetchProducts(true);
                    });
                });
            }
        } catch (e) {
            console.error('Failed to load categories', e);
        }
    }

    async function loadFeaturedSellers() {
        try {
            const res = await apiFetch('/api/sellers/featured');
            if (res.success && res.data && res.data.length > 0) {
                const section = document.getElementById('featured-section');
                const carousel = document.getElementById('featured-carousel');

                const html = res.data.map(s => {
                    const initial = s.shop_name ? s.shop_name.charAt(0).toUpperCase() : '🍽';
                    const avatar = s.profile_image
                        ? `<div class="featured-seller-avatar"><img src="${s.profile_image}" alt="${s.shop_name}" loading="lazy"></div>`
                        : `<div class="featured-seller-avatar">${initial}</div>`;

                    return `
                        <a href="/seller.html?id=${s.id}" class="featured-seller-card">
                            ${avatar}
                            <div>
                                <p class="featured-seller-name">${s.shop_name}</p>
                                <p class="featured-seller-state">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    ${s.state}
                                </p>
                            </div>
                            ${s.description ? `<p class="featured-seller-desc">${s.description}</p>` : ''}
                            <span class="featured-badge">⭐ Peniaga Pilihan</span>
                        </a>`;
                }).join('');

                carousel.innerHTML = html;
                section.style.display = 'block';

                // Drag-to-scroll on desktop
                let isDragging = false, startX = 0, scrollLeft = 0;
                carousel.addEventListener('mousedown', (e) => { isDragging = true; startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
                carousel.addEventListener('mousemove', (e) => { if (!isDragging) return; e.preventDefault(); carousel.scrollLeft = scrollLeft - (e.pageX - carousel.offsetLeft - startX); });
                carousel.addEventListener('mouseup', () => isDragging = false);
                carousel.addEventListener('mouseleave', () => isDragging = false);
            }
        } catch (e) {
            // Featured carousel is optional — fail silently
        }
    }

    async function fetchProducts(reset = true) {
        if (reset) {
            currentPage = 0;
            catalogGrid.innerHTML = '<p class="text-muted" style="text-align:center; grid-column:1/-1;">Memuatkan...</p>';
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreBtn.textContent = 'Memuatkan...';
            loadMoreBtn.disabled = true;
        }

        try {
            const offset = currentPage * LIMIT;
            const params = new URLSearchParams({ limit: LIMIT, offset });

            if (currentQuery) params.append('q', currentQuery);
            if (currentCategory) params.append('category', currentCategory);
            if (currentState) params.append('state', currentState);

            const res = await apiFetch(`/api/products?${params.toString()}`);

            if (res.success) {
                renderProducts(res.data, reset);

                // Pagination Logic
                if (res.data.length === LIMIT) {
                    loadMoreContainer.style.display = 'block';
                } else {
                    loadMoreContainer.style.display = 'none';
                }
            } else {
                catalogGrid.innerHTML = `<p class="empty-state" style="grid-column:1/-1; text-align:center;">Ralat pelayan: ${res.error}</p>`;
            }
        } catch (e) {
            catalogGrid.innerHTML = '<p class="empty-state" style="grid-column:1/-1; text-align:center;">Gagal menghubungi pelayan.</p>';
        } finally {
            if (!reset) {
                loadMoreBtn.textContent = 'Muatkan Lagi';
                loadMoreBtn.disabled = false;
            }
        }
    }

    function renderProducts(products, reset) {
        if (reset && products.length === 0) {
            catalogGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background:var(--background-color); border-radius: 12px;">
                    <h3 style="margin-bottom:0.5rem;">Tiada Makanan Dijumpai</h3>
                    <p class="text-muted">Cuba carian atau kategori yang berbeza.</p>
                </div>
            `;
            return;
        }

        const html = products.map(p => `
            <a href="/product.html?id=${p.id}" class="product-card">
                <div class="product-badges">
                    <span class="badge badge-${p.status}">${p.status.replace('_', ' ').toUpperCase()}</span>
                </div>
                ${p.image_url ? `<img src="${p.image_url}" class="product-image" loading="lazy" alt="${p.name}">` : `<div class="product-image" style="display:flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>`}
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="shop-name">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${p.seller.shop_name} &bull; ${p.seller.state}
                    </div>
                    <div class="product-price">RM ${p.price.toFixed(2)}${p.price_note ? ` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${p.price_note}</small>` : ''}</div>
                </div>
            </a>
        `).join('');

        if (reset) {
            catalogGrid.innerHTML = html;
        } else {
            catalogGrid.insertAdjacentHTML('beforeend', html);
        }
    }
});
