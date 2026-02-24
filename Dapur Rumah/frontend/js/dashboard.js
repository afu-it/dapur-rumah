import { apiFetch } from './api.js?v=20260224e';
import { compressAndUpload } from './upload.js?v=20260224e';
import { showToast } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Determine Auth State First
    const userGreeting = document.getElementById('user-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const demoAccountId = new URLSearchParams(window.location.search).get('demo');
    const isDemoMode = demoAccountId === '1' || demoAccountId === '2';

    function setupDemoMode(accountId) {
        const demoAccounts = {
            '1': {
                greeting: 'Demo Seller 1 (Nur Aina)',
                profile: {
                    shop_name: 'Dapur Aina Kampung',
                    description: 'Masakan kampung, lauk tradisional, dan kuih harian.',
                    phone_whatsapp: '601133336601',
                    state: 'Selangor',
                },
                products: [
                    { id: 'demo-1-1', category_id: '2', name: 'Ayam Percik Madu', description: 'Ayam percik berempah.', price: 18.0, price_note: 'per set', status: 'ada_stok', image_url: '', views: 184, whatsapp_clicks: 27 },
                    { id: 'demo-1-2', category_id: '3', name: 'Kuih Seri Muka', description: 'Seri muka pandan.', price: 12.0, price_note: 'per box', status: 'preorder', image_url: '', views: 112, whatsapp_clicks: 19 },
                    { id: 'demo-1-3', category_id: '4', name: 'Air Asam Boi', description: 'Minuman sejuk segar.', price: 5.5, price_note: 'per cup', status: 'habis', image_url: '', views: 61, whatsapp_clicks: 8 },
                ],
            },
            '2': {
                greeting: 'Demo Seller 2 (Hakim Roslan)',
                profile: {
                    shop_name: 'Kitchen Hakim Utara',
                    description: 'Menu utara, dessert, dan makanan frozen homemade.',
                    phone_whatsapp: '60185550772',
                    state: 'Kedah',
                },
                products: [
                    { id: 'demo-2-1', category_id: '2', name: 'Nasi Daging Utara', description: 'Nasi daging berempah.', price: 16.5, price_note: 'per set', status: 'ada_stok', image_url: '', views: 147, whatsapp_clicks: 23 },
                    { id: 'demo-2-2', category_id: '1', name: 'Brownie Kedut', description: 'Brownie coklat pekat.', price: 28.0, price_note: 'per box', status: 'preorder', image_url: '', views: 95, whatsapp_clicks: 12 },
                    { id: 'demo-2-3', category_id: '5', name: 'Keropok Lekor Crispy', description: 'Rangup dan sedap.', price: 10.0, price_note: 'per pack', status: 'ada_stok', image_url: '', views: 132, whatsapp_clicks: 17 },
                ],
            },
        };

        const current = demoAccounts[accountId] || demoAccounts['1'];
        const statusLabels = { ada_stok: 'Ada Stok', preorder: 'Pre-Order', habis: 'Habis' };
        const demoProfile = { ...current.profile };
        let demoProducts = current.products.map((p) => ({ ...p }));
        let sequence = demoProducts.length + 1;

        const profileForm = document.getElementById('profile-form');
        const profileFeedback = document.getElementById('profile-feedback');
        const saveProfileBtn = document.getElementById('save-profile-btn');
        const productsGrid = document.getElementById('products-grid');
        const addBtn = document.getElementById('add-product-btn');

        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('modal-title');
        const closeBtn = document.getElementById('close-modal-btn');
        const productForm = document.getElementById('product-form');

        const prodIdInput = document.getElementById('prod_id');
        const prodNameInput = document.getElementById('prod_name');
        const prodPriceInput = document.getElementById('prod_price');
        const prodPriceNoteInput = document.getElementById('prod_price_note');
        const prodCatInput = document.getElementById('prod_category');
        const prodStatusInput = document.getElementById('prod_status');
        const prodDescInput = document.getElementById('prod_desc');
        const prodImageInput = document.getElementById('prod_image');
        const prodImageUrlInput = document.getElementById('prod_image_url');
        const imgPreview = document.getElementById('image-preview');
        const delBtn = document.getElementById('delete-product-btn');
        const saveProdBtn = document.getElementById('save-product-btn');
        const productFeedback = document.getElementById('product-feedback');

        if (!profileForm || !productForm || !productsGrid || !modal) return;

        userGreeting.textContent = `Hai, ${current.greeting}`;
        logoutBtn.textContent = 'Keluar Demo';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        function renderProfile() {
            document.getElementById('shop_name').value = demoProfile.shop_name || '';
            document.getElementById('description').value = demoProfile.description || '';
            document.getElementById('phone_whatsapp').value = demoProfile.phone_whatsapp || '';
            document.getElementById('state').value = demoProfile.state || '';
        }

        function renderProducts() {
            if (demoProducts.length === 0) {
                productsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 8px;">
                        <p class="text-muted">Tiada produk demo. Klik tambah untuk buat produk baru.</p>
                    </div>
                `;
                return;
            }

            productsGrid.innerHTML = demoProducts.map((p) => `
                <div class="product-card" data-id="${p.id}">
                    ${p.image_url ? `<img src="${p.image_url}" class="product-image" loading="lazy" alt="${p.name}">` : `<div class="product-image" style="display: flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>`}
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <div class="product-price">RM ${Number(p.price).toFixed(2)}${p.price_note ? ` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${p.price_note}</small>` : ''}</div>
                        <div class="product-badges">
                            <span class="badge badge-${p.status}">${p.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.product-card').forEach((card) => {
                card.addEventListener('click', () => openModal(card.dataset.id));
            });
        }

        function renderAnalytics() {
            const totalViews = demoProducts.reduce((sum, p) => sum + (p.views || 0), 0);
            const totalClicks = demoProducts.reduce((sum, p) => sum + (p.whatsapp_clicks || 0), 0);
            document.getElementById('stat-views').textContent = totalViews.toLocaleString();
            document.getElementById('stat-clicks').textContent = totalClicks.toLocaleString();
            document.getElementById('stat-products').textContent = demoProducts.length.toLocaleString();

            const tbody = document.getElementById('analytics-rows');
            if (demoProducts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Tiada data analitik buat masa ini.</td></tr>';
                return;
            }

            tbody.innerHTML = demoProducts.map((p) => `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:0.75rem;">
                            ${p.image_url ? `<img src="${p.image_url}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;" alt="">` : '<div style="width:36px;height:36px;border-radius:8px;background:#f1f5f9;"></div>'}
                            <span style="font-weight:600;font-size:0.875rem;">${p.name}</span>
                        </div>
                    </td>
                    <td><span class="badge badge-${p.status}" style="font-size:0.75rem;">${statusLabels[p.status] || p.status}</span></td>
                    <td style="text-align:right; font-variant-numeric:tabular-nums; font-weight:600;">${(p.views || 0).toLocaleString()}</td>
                    <td style="text-align:right; font-variant-numeric:tabular-nums; font-weight:600; color:var(--whatsapp-color);">${(p.whatsapp_clicks || 0).toLocaleString()}</td>
                </tr>
            `).join('');
        }

        function closeModal() {
            modal.classList.remove('active');
        }

        function openModal(id = null) {
            productForm.reset();
            productFeedback.innerHTML = '';
            imgPreview.style.display = 'none';
            prodImageUrlInput.value = '';

            if (id) {
                modalTitle.textContent = 'Kemaskini Produk (Demo)';
                delBtn.style.display = 'block';
                const p = demoProducts.find((item) => item.id === id);
                if (p) {
                    prodIdInput.value = p.id;
                    prodNameInput.value = p.name || '';
                    prodPriceInput.value = p.price ?? '';
                    prodPriceNoteInput.value = p.price_note || '';
                    prodCatInput.value = String(p.category_id || '');
                    prodStatusInput.value = p.status || 'ada_stok';
                    prodDescInput.value = p.description || '';
                    prodImageUrlInput.value = p.image_url || '';
                    if (p.image_url) {
                        imgPreview.src = p.image_url;
                        imgPreview.style.display = 'block';
                    }
                }
            } else {
                modalTitle.textContent = 'Tambah Produk Baru (Demo)';
                delBtn.style.display = 'none';
            }

            modal.classList.add('active');
        }

        profileFeedback.textContent = 'Mode demo aktif. Semua perubahan disimpan secara tempatan.';
        saveProfileBtn.textContent = 'Simpan Profil (Demo)';
        addBtn.textContent = '+ Tambah Produk (Demo)';

        renderProfile();
        renderProducts();
        renderAnalytics();

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            demoProfile.shop_name = document.getElementById('shop_name').value;
            demoProfile.description = document.getElementById('description').value;
            demoProfile.phone_whatsapp = document.getElementById('phone_whatsapp').value;
            demoProfile.state = document.getElementById('state').value;
            showToast('Profil demo dikemas kini.', 'success');
        });

        addBtn.addEventListener('click', () => openModal());
        closeBtn.addEventListener('click', closeModal);

        prodImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                imgPreview.src = URL.createObjectURL(file);
                imgPreview.style.display = 'block';
            }
        });

        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProdBtn.disabled = true;
            saveProdBtn.textContent = 'Menyimpan...';

            const id = prodIdInput.value.trim();
            const price = Number.parseFloat(prodPriceInput.value);
            const file = prodImageInput.files[0];
            const imageUrl = file
                ? URL.createObjectURL(file)
                : (prodImageUrlInput.value || '');

            if (!Number.isFinite(price)) {
                showToast('Harga tidak sah.', 'error');
                saveProdBtn.disabled = false;
                saveProdBtn.textContent = 'Simpan Produk';
                return;
            }

            const payload = {
                id: id || `demo-${accountId}-${sequence++}`,
                category_id: prodCatInput.value || '5',
                name: prodNameInput.value.trim(),
                description: prodDescInput.value.trim(),
                price,
                price_note: prodPriceNoteInput.value.trim(),
                image_url: imageUrl,
                status: prodStatusInput.value || 'ada_stok',
            };

            if (id) {
                demoProducts = demoProducts.map((item) =>
                    item.id === id ? { ...item, ...payload } : item
                );
                showToast('Produk demo dikemas kini.', 'success');
            } else {
                demoProducts.unshift({
                    ...payload,
                    views: Math.floor(Math.random() * 120) + 20,
                    whatsapp_clicks: Math.floor(Math.random() * 30) + 3,
                });
                showToast('Produk demo ditambah.', 'success');
            }

            closeModal();
            renderProducts();
            renderAnalytics();
            saveProdBtn.disabled = false;
            saveProdBtn.textContent = 'Simpan Produk';
        });

        delBtn.addEventListener('click', () => {
            const id = prodIdInput.value;
            if (!id) return;
            if (!confirm('Padam produk demo ini?')) return;

            demoProducts = demoProducts.filter((item) => item.id !== id);
            closeModal();
            renderProducts();
            renderAnalytics();
            showToast('Produk demo dipadam.', 'info');
        });

        showToast('Mode demo aktif. Anda boleh edit semua data.', 'info', 3500);
    }

    if (isDemoMode) {
        setupDemoMode(demoAccountId || '1');
        return;
    }

    try {
        const sessionRes = await apiFetch('/api/auth/get-session');
        if (!sessionRes.session) {
            window.location.href = 'login.html';
            return;
        }

        userGreeting.textContent = `Hai, ${sessionRes.user.name}`;
        logoutBtn.style.display = 'inline-block';
        logoutBtn.addEventListener('click', async () => {
            await apiFetch('/api/auth/sign-out', { method: 'POST' });
            window.location.href = 'login.html';
        });

        // Init Data
        await loadProfile();
        await loadProducts();
        loadAnalytics(); // Load analytics (non-blocking)

    } catch (e) {
        window.location.href = 'login.html';
    }

    /** Profile Management */
    const profileForm = document.getElementById('profile-form');
    const profileFeedback = document.getElementById('profile-feedback');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    async function loadProfile() {
        try {
            const res = await apiFetch('/api/dashboard/profile');
            if (res.success && res.data) {
                document.getElementById('shop_name').value = res.data.shop_name || '';
                document.getElementById('description').value = res.data.description || '';
                document.getElementById('phone_whatsapp').value = res.data.phone_whatsapp || '';
                document.getElementById('state').value = res.data.state || '';
            }
        } catch (e) {
            console.error('Gagal memuatkan profil', e);
        }
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveProfileBtn.disabled = true;
        saveProfileBtn.textContent = 'Menyimpan...';
        profileFeedback.innerHTML = '';

        const payload = {
            shop_name: document.getElementById('shop_name').value,
            description: document.getElementById('description').value,
            phone_whatsapp: document.getElementById('phone_whatsapp').value,
            state: document.getElementById('state').value,
        };

        try {
            const res = await apiFetch('/api/dashboard/profile', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (res.success) {
                showToast('Profil berjaya dikemas kini.', 'success');
            } else {
                showToast(res.error || 'Gagal menyimpan profil', 'error');
            }
        } catch (e) {
            showToast('Ralat sambungan pelayan.', 'error');
        } finally {
            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = 'Simpan Profil';
        }
    });

    /** Products Management */
    const productsGrid = document.getElementById('products-grid');
    let productsCache = [];

    async function loadProducts() {
        productsGrid.innerHTML = `
            <div class="product-card skeleton" style="height:320px;"></div>
            <div class="product-card skeleton" style="height:320px;"></div>
            <div class="product-card skeleton" style="height:320px;"></div>
        `;
        try {
            const res = await apiFetch('/api/dashboard/products');
            if (res.success) {
                productsCache = res.data;
                renderProducts(res.data);
            }
        } catch (e) {
            productsGrid.innerHTML = '<p class="text-muted">Gagal memuatkan produk.</p>';
        }
    }

    function renderProducts(products) {
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 8px;">
                    <p class="text-muted">Belum ada produk. Sila tambah produk pertama anda.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(p => `
            <div class="product-card" data-id="${p.id}">
                ${p.image_url ? `<img src="${p.image_url}" class="product-image" loading="lazy" alt="${p.name}">` : `<div class="product-image" style="display: flex; align-items:center; justify-content:center; color:#999;">Tiada Gambar</div>`}
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">RM ${p.price.toFixed(2)}${p.price_note ? ` <small class="text-muted" style="font-size:0.8rem; font-weight:normal;">/ ${p.price_note}</small>` : ''}</div>
                    <div class="product-badges">
                        <span class="badge badge-${p.status}">${p.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach edit listeners
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.id));
        });
    }

    /** Modal & Upload Logic */
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.getElementById('close-modal-btn');
    const addBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');

    // Inputs
    const prodIdInput = document.getElementById('prod_id');
    const prodNameInput = document.getElementById('prod_name');
    const prodPriceInput = document.getElementById('prod_price');
    const prodPriceNoteInput = document.getElementById('prod_price_note');
    const prodCatInput = document.getElementById('prod_category');
    const prodStatusInput = document.getElementById('prod_status');
    const prodDescInput = document.getElementById('prod_desc');
    const prodImageInput = document.getElementById('prod_image');
    const prodImageUrlInput = document.getElementById('prod_image_url');
    const imgPreview = document.getElementById('image-preview');

    const delBtn = document.getElementById('delete-product-btn');
    const saveProdBtn = document.getElementById('save-product-btn');
    const productFeedback = document.getElementById('product-feedback');

    addBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);

    // Image preview handler
    prodImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            imgPreview.src = URL.createObjectURL(file);
            imgPreview.style.display = 'block';
        }
    });

    function openModal(id = null) {
        productForm.reset();
        productFeedback.innerHTML = '';
        imgPreview.style.display = 'none';

        if (id) {
            modalTitle.textContent = 'Kemaskini Produk';
            delBtn.style.display = 'block';

            const p = productsCache.find(x => x.id === id);
            if (p) {
                prodIdInput.value = p.id;
                prodNameInput.value = p.name;
                prodPriceInput.value = p.price;
                prodPriceNoteInput.value = p.price_note || '';
                prodCatInput.value = p.category_id;
                prodStatusInput.value = p.status;
                prodDescInput.value = p.description || '';
                prodImageUrlInput.value = p.image_url || '';

                if (p.image_url) {
                    imgPreview.src = p.image_url;
                    imgPreview.style.display = 'block';
                }
            }
        } else {
            modalTitle.textContent = 'Tambah Produk Baru';
            delBtn.style.display = 'none';
        }

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveProdBtn.disabled = true;
        saveProdBtn.textContent = 'Menyimpan...';
        productFeedback.innerHTML = 'Memproses...';

        try {
            let finalImageUrl = prodImageUrlInput.value;

            // Optional Image Upload (Phase 3 Integration)
            const file = prodImageInput.files[0];
            if (file) {
                productFeedback.innerHTML = 'Memuat naik gambar (R2)...';
                const uploadRes = await compressAndUpload(file);
                if (uploadRes.success) {
                    finalImageUrl = uploadRes.url;
                } else {
                    throw new Error(uploadRes.error || 'Gagal memuat naik gambar');
                }
            }

            const payload = {
                category_id: parseInt(prodCatInput.value),
                name: prodNameInput.value,
                description: prodDescInput.value,
                price: parseFloat(prodPriceInput.value),
                price_note: prodPriceNoteInput.value,
                image_url: finalImageUrl,
                status: prodStatusInput.value
            };

            const id = prodIdInput.value;
            const endpoint = id ? `/api/dashboard/products/${id}` : '/api/dashboard/products';
            const method = id ? 'PUT' : 'POST';

            const res = await apiFetch(endpoint, {
                method,
                body: JSON.stringify(payload)
            });

            if (res.success) {
                closeModal();
                showToast(id ? 'Produk dikemaskini' : 'Produk ditambah', 'success');
                await loadProducts(); // Refresh Grid
            } else {
                showToast(res.error, 'error');
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            saveProdBtn.disabled = false;
            saveProdBtn.textContent = 'Simpan Produk';
        }
    });

    // Delete Product
    delBtn.addEventListener('click', async () => {
        const id = prodIdInput.value;
        if (!confirm('Adakah anda pasti untuk memadam produk ini?')) return;

        delBtn.disabled = true;
        try {
            const res = await apiFetch(`/api/dashboard/products/${id}`, { method: 'DELETE' });
            if (res.success) {
                closeModal();
                showToast('Produk dipadam.', 'info');
                await loadProducts();
            } else {
                showToast('Gagal memadam produk: ' + res.error, 'error');
            }
        } catch (e) {
            showToast('Ralat rangkaian.', 'error');
        } finally {
            delBtn.disabled = false;
        }
    });

    /** ==================== Analytics ==================== */
    async function loadAnalytics() {
        try {
            const res = await apiFetch('/api/dashboard/analytics');
            if (!res.success || !res.data) return;

            const { summary, products } = res.data;

            // Update summary cards
            document.getElementById('stat-views').textContent = summary.total_views.toLocaleString();
            document.getElementById('stat-clicks').textContent = summary.total_whatsapp_clicks.toLocaleString();
            document.getElementById('stat-products').textContent = summary.total_products.toLocaleString();

            // Populate table
            const tbody = document.getElementById('analytics-rows');
            if (products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Belum ada produk. Tambah produk dahulu.</td></tr>';
                return;
            }

            const statusLabels = { ada_stok: 'Ada Stok', preorder: 'Pre-Order', habis: 'Habis' };
            tbody.innerHTML = products.map(p => `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:0.75rem;">
                            ${p.image_url ? `<img src="${p.image_url}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;" alt="">` : '<div style="width:36px;height:36px;border-radius:8px;background:#f1f5f9;"></div>'}
                            <span style="font-weight:600;font-size:0.875rem;">${p.name}</span>
                        </div>
                    </td>
                    <td><span class="badge badge-${p.status}" style="font-size:0.75rem;">${statusLabels[p.status] || p.status}</span></td>
                    <td style="text-align:right; font-variant-numeric:tabular-nums; font-weight:600;">${(p.views || 0).toLocaleString()}</td>
                    <td style="text-align:right; font-variant-numeric:tabular-nums; font-weight:600; color:var(--whatsapp-color);">${(p.whatsapp_clicks || 0).toLocaleString()}</td>
                </tr>
            `).join('');
        } catch (e) {
            // Fail silently — analytics is optional
        }
    }
});
