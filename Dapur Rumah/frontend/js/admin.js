import { apiFetch } from './api.js';

let allSellers = [];

document.addEventListener('DOMContentLoaded', async () => {
    const adminContent = document.getElementById('admin-content');
    const accessDenied = document.getElementById('access-denied');
    const adminUser = document.getElementById('admin-user');
    const logoutBtn = document.getElementById('logout-btn');

    // Check session
    let session;
    try {
        const res = await apiFetch('/api/auth/get-session');
        if (!res.session) { window.location.href = '/login.html'; return; }
        session = res;
        adminUser.textContent = res.user.name || res.user.email;
    } catch (e) {
        window.location.href = '/login.html';
        return;
    }

    // Check admin access
    try {
        const check = await apiFetch('/api/admin/sellers');
        if (!check.success) throw new Error('not admin');
        adminContent.style.display = 'block';
        renderStats(check.data);
        renderTable(check.data);
    } catch (e) {
        accessDenied.style.display = 'block';
        return;
    }

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await apiFetch('/api/auth/sign-out', { method: 'POST' });
        window.location.href = '/login.html';
    });

    // Refresh
    document.getElementById('refresh-btn').addEventListener('click', refreshData);

    // Search
    document.getElementById('seller-search').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = allSellers.filter(s =>
            s.shop_name.toLowerCase().includes(q) ||
            (s.state || '').toLowerCase().includes(q)
        );
        renderTable(filtered);
    });

    async function refreshData() {
        const res = await apiFetch('/api/admin/sellers');
        if (res.success) {
            allSellers = res.data;
            renderStats(allSellers);
            renderTable(allSellers);
        }
    }

    function renderStats(sellers) {
        document.getElementById('total-sellers').textContent = sellers.length;
        document.getElementById('total-featured').textContent = sellers.filter(s => s.is_featured).length;
        document.getElementById('total-active').textContent = sellers.filter(s => s.is_active).length;
    }

    function renderTable(sellers) {
        allSellers = sellers;
        const tbody = document.getElementById('seller-rows');

        if (sellers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:2rem;">Tiada peniaga dijumpai.</td></tr>';
            return;
        }

        tbody.innerHTML = sellers.map(s => {
            const initial = s.shop_name ? s.shop_name.charAt(0).toUpperCase() : '?';
            const avatar = s.profile_image
                ? `<img src="${s.profile_image}" class="seller-mini-avatar" style="border-radius:50%; width:36px; height:36px; object-fit:cover;" alt="">`
                : `<div class="seller-mini-avatar">${initial}</div>`;

            return `
            <tr data-id="${s.id}">
                <td>
                    <div class="seller-cell">
                        ${avatar}
                        <div>
                            <div style="font-weight:600; font-size:0.875rem;">${s.shop_name || '<em style="color:#94a3b8">Belum ditetapkan</em>'}</div>
                            <div style="font-size:0.75rem; color:#94a3b8;">${s.phone_whatsapp || '—'}</div>
                        </div>
                    </div>
                </td>
                <td style="color:var(--text-muted); font-size:0.875rem;">${s.state || '—'}</td>
                <td style="text-align:center; font-weight:600;">${s.product_count}</td>
                <td style="text-align:center;">
                    <button class="toggle-btn feature-btn ${s.is_featured ? 'on' : 'off'}"
                        data-id="${s.id}" data-state="${s.is_featured ? 1 : 0}">
                        ${s.is_featured ? '⭐ Pilihan' : '☆ Biasa'}
                    </button>
                </td>
                <td style="text-align:center;">
                    <button class="toggle-btn activate-btn ${s.is_active ? 'on' : 'off'}"
                        data-id="${s.id}" data-state="${s.is_active ? 1 : 0}">
                        ${s.is_active ? '✓ Aktif' : '✗ Tidak Aktif'}
                    </button>
                </td>
                <td>
                    <a href="/seller.html?id=${s.id}" target="_blank" style="font-size:0.75rem; color:var(--primary-color); text-decoration:none; font-weight:600;">Lihat →</a>
                </td>
            </tr>`;
        }).join('');

        // Feature toggle buttons
        tbody.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const current = btn.dataset.state === '1';
                btn.disabled = true;
                try {
                    await apiFetch(`/api/admin/sellers/${id}/feature`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ featured: !current }),
                    });
                    await refreshData();
                } finally { btn.disabled = false; }
            });
        });

        // Activate toggle buttons
        tbody.querySelectorAll('.activate-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const current = btn.dataset.state === '1';
                btn.disabled = true;
                try {
                    await apiFetch(`/api/admin/sellers/${id}/activate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ active: !current }),
                    });
                    await refreshData();
                } finally { btn.disabled = false; }
            });
        });
    }
});
