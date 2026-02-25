// ============================================
// PREVIEW MODE — All API functions return mock data
// Replace these with real API calls when backend is ready
// ============================================

const MOCK_PRODUCTS = [
  { id: 1, name: 'Nasi Lemak Ayam Berempah', seller: 'Kak Mah Kitchen', price: 8.50, category: 'masakan_panas', image: 'https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Kek Coklat Moist', seller: 'Bake By Sarah', price: 15.00, category: 'pencuda_mulut', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Mee Goreng Mamak', seller: 'Warisan Nenek', price: 6.00, category: 'masakan_panas', image: 'https://images.unsplash.com/photo-1626082896492-766af4eb65ed?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Karipap Pusing (10pcs)', seller: 'Makcik Kiah', price: 5.00, category: 'kuih', image: 'https://images.unsplash.com/photo-1605333396914-230f293a9089?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'Ayam Masak Merah', seller: 'Dapur Nisa', price: 12.00, category: 'berlauk', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300' },
  { id: 6, name: 'Keropok Lekor', seller: 'Pok Jeli', price: 4.00, category: 'makanan_ringan', image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=300' },
];

export async function apiFetch(endpoint, options = {}) {
  console.warn('[Preview Mode] API call skipped:', endpoint);
  return { success: true, data: null };
}

export const api = {
  get: (url) => apiFetch(url, { method: 'GET' }),
  post: (url, body) => apiFetch(url, { method: 'POST', body }),
  put: (url, body) => apiFetch(url, { method: 'PUT', body }),
  delete: (url) => apiFetch(url, { method: 'DELETE' }),
};

// Products API
export async function getProducts() {
  return { success: true, data: MOCK_PRODUCTS };
}

export async function getProduct(id) {
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id));
  return { success: true, data: product || MOCK_PRODUCTS[0] };
}

export async function getSellers() {
  return { success: true, data: [] };
}

export async function getSeller(id) {
  return { success: true, data: null };
}

// Dashboard API
export async function getDashboardProfile() {
  return { success: true, data: { shop_name: 'Kedai Demo', description: 'Preview mode', phone_whatsapp: '60123456789', state: 'Selangor' } };
}

export async function updateDashboardProfile(data) {
  return { success: true };
}

export async function getDashboardProducts() {
  return { success: true, data: [] };
}

export async function createProduct(data) {
  return { success: true, data: { id: 'mock-' + Date.now(), ...data } };
}

export async function updateProduct(id, data) {
  return { success: true };
}

export async function deleteProduct(id) {
  return { success: true };
}

export async function getAnalytics() {
  return { success: true, data: { views: 0, clicks: 0 } };
}
