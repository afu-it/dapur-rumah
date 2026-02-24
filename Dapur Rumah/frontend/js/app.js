// Mock Data
const MOCK_PRODUCTS = [
    { id: 1, name: "Nasi Lemak Ayam Berempah", seller: "Kak Mah Kitchen", price: 8.50, category: "masakan_panas", img: "https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=300" },
    { id: 2, name: "Kek Coklat Moist", seller: "Bake By Sarah", price: 15.00, category: "pencuci_mulut", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300" },
    { id: 3, name: "Mee Goreng Mamak", seller: "Warisan Nenek", price: 6.00, category: "masakan_panas", img: "https://images.unsplash.com/photo-1626082896492-766af4eb65ed?auto=format&fit=crop&q=80&w=300" },
    { id: 4, name: "Karipap Pusing (10pcs)", seller: "Makcik Kiah", price: 5.00, category: "kuih", img: "https://images.unsplash.com/photo-1605333396914-230f293a9089?auto=format&fit=crop&q=80&w=300" },
    { id: 5, name: "Ayam Masak Merah", seller: "Dapur Nisa", price: 12.00, category: "berlauk", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300" },
    { id: 6, name: "Keropok Lekor", seller: "Pok Jeli", price: 4.00, category: "makanan_ringan", img: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=300" },
    { id: 7, name: "Roti Canai Kari", seller: "Abang Roti", price: 3.50, category: "masakan_panas", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300" },
    { id: 8, name: "Biskut Coklat Chip", seller: "Baker Sofea", price: 12.00, category: "kuih", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=300" }
];

let cart = [];
let userProfile = { name: '', phone: '', address: '' };
let currentProducts = [];

// Get products - from demo seller or mock data
function getProducts() {
    const savedProducts = localStorage.getItem('dapur_rumah_products');
    if (savedProducts) {
        return JSON.parse(savedProducts).map(p => ({
            id: p.id,
            name: p.name,
            seller: localStorage.getItem('dapur_rumah_seller') ? JSON.parse(localStorage.getItem('dapur_rumah_seller')).name : 'Demo Seller',
            price: p.price,
            category: 'masakan_panas',
            img: p.image
        }));
    }
    return MOCK_PRODUCTS;
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    currentProducts = getProducts();
    renderProducts(currentProducts, 'home-products');
    setupEventListeners();
    updateCartBadge();
});

// TAB SWITCHING
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-page').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${tabId}"]`).classList.add('active');

    if(tabId === 'cart') renderCart();
    if(tabId === 'search') {
        setTimeout(() => document.getElementById('main-search-input').focus(), 100);
    }
}

// EVENT LISTENERS
function setupEventListeners() {
    // Categories
    document.querySelectorAll('.category-item').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const target = e.currentTarget;
            document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
            target.classList.add('active');
            
            let cat = target.dataset.cat;
            let filtered = cat === 'all' ? currentProducts : currentProducts.filter(p => p.category === cat);
            
            renderProducts(filtered, 'home-products');
            document.getElementById('product-count').textContent = `${filtered.length} items`;
        });
    });

    // Search Input
    const searchInput = document.getElementById('main-search-input');
    const clearBtn = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        
        if(val.length > 0) {
            clearBtn.style.display = 'block';
            document.getElementById('search-suggestions').style.display = 'none';
            document.getElementById('search-results').style.display = 'grid';
            
            const results = currentProducts.filter(p => 
                p.name.toLowerCase().includes(val) || 
                p.seller.toLowerCase().includes(val)
            );
            renderProducts(results, 'search-results');
        } else {
            clearBtn.style.display = 'none';
            document.getElementById('search-suggestions').style.display = 'block';
            document.getElementById('search-results').style.display = 'none';
        }
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });

    // Profile Form (Details)
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        userProfile.name = document.getElementById('acc-name').value;
        userProfile.phone = document.getElementById('acc-phone').value;
        localStorage.setItem('dapur_rumah_profile', JSON.stringify(userProfile));
        
        showSaveSuccess();
    });

    // Address Form
    document.getElementById('address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        userProfile.address = document.getElementById('acc-address').value;
        localStorage.setItem('dapur_rumah_profile', JSON.stringify(userProfile));
        
        showSaveSuccess();
    });

    // WhatsApp Button
    document.getElementById('btn-whatsapp-seller').addEventListener('click', sendToWhatsApp);
}

function showSaveSuccess() {
    const msg = document.getElementById('save-msg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3000);
}

// Account Section Switching
window.switchAccountSection = function(section) {
    document.querySelectorAll('.section-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.section-tab[data-section="${section}"]`).classList.add('active');
    
    document.querySelectorAll('.account-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
}

// PRODUCTS RENDER
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    
    if(products.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:#636E72;">
                <p style="font-size:24px; margin-bottom:8px;">🔍</p>
                <p>Tiada makanan dijumpai</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-seller">${p.seller}</div>
                <div class="product-bottom">
                    <div class="product-price">RM ${p.price.toFixed(2)}</div>
                    <button class="btn-add" onclick="addToCart(${p.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// SEARCH
window.setSearch = function(term) {
    const input = document.getElementById('main-search-input');
    input.value = term;
    input.dispatchEvent(new Event('input'));
}

// CART FUNCTIONS
window.addToCart = function(id) {
    const product = currentProducts.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCartBadge();
    animateCartIcon();
}

window.updateQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCartBadge();
        renderCart();
    }
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'flex' : 'none';
}

function animateCartIcon() {
    const icon = document.querySelector('.cart-icon');
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => icon.style.transform = 'scale(1)', 200);
}

function renderCart() {
    const emptyState = document.getElementById('cart-empty');
    const filledState = document.getElementById('cart-filled');
    const itemsContainer = document.getElementById('cart-items');
    
    if(cart.length === 0) {
        emptyState.style.display = 'flex';
        filledState.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    filledState.style.display = 'block';

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">RM ${(item.price * item.qty).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cart-subtotal').textContent = `RM ${subtotal.toFixed(2)}`;

    // Review Details
    document.getElementById('review-name').textContent = `Nama: ${userProfile.name || '-'}`;
    document.getElementById('review-phone').textContent = `Tel: ${userProfile.phone || '-'}`;
    document.getElementById('review-address').textContent = `Alamat: ${userProfile.address || '-'}`;

    generateAISummary(subtotal);
}

// PROFILE
function loadProfile() {
    const saved = localStorage.getItem('dapur_rumah_profile');
    if(saved) {
        userProfile = JSON.parse(saved);
        document.getElementById('acc-name').value = userProfile.name;
        document.getElementById('acc-phone').value = userProfile.phone;
        document.getElementById('acc-address').value = userProfile.address;
        document.getElementById('display-location').textContent = userProfile.address ? 'Alamat Disimpan' : 'Pilih Lokasi';
    }
}

// AI SUMMARY
function generateAISummary(subtotal) {
    if(cart.length === 0) return;

    let text = `*PESANAN BARU - DAPUR RUMAH*\n\n`;
    
    cart.forEach((item, index) => {
        text += `${index + 1}. ${item.name}\n   Qty: ${item.qty} x RM ${item.price.toFixed(2)} = RM ${(item.price * item.qty).toFixed(2)}\n\n`;
    });

    text += `------------------------\n`;
    text += `*JUMLAH: RM ${subtotal.toFixed(2)}*\n\n`;
    text += `*MAKLUMAT PENGGUNA:*\n`;
    text += `Nama: ${userProfile.name || 'Belum diisi'}\n`;
    text += `No. Telefon: ${userProfile.phone || 'Belum diisi'}\n`;
    text += `Alamat: ${userProfile.address || 'Belum diisi'}`;

    document.getElementById('ai-message-text').value = text;
}

function sendToWhatsApp() {
    if(cart.length === 0) return;
    
    if(!userProfile.name || !userProfile.phone || !userProfile.address) {
        alert('Sila lengkapkan maklumat profil anda terlebih dahulu!');
        switchTab('account');
        return;
    }

    const text = document.getElementById('ai-message-text').value;
    const encodedText = encodeURIComponent(text);
    const sellerPhone = "60123456789"; 
    window.open(`https://wa.me/${sellerPhone}?text=${encodedText}`, '_blank');
}
