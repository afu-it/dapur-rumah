/**
 * Global UI Helper Functions
 */

// 1. Toast Notification System
export function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('global-toast-container');

    // Inject container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'; // Info
    if (type === 'success') {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (type === 'error') {
        icon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // 300ms matches CSS transition
    }, duration);
}

// 2. Insert Bottom Navigation UI into the DOM generically
export function injectBottomNav(activePage = 'home') {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    const navItems = [
        {
            id: 'home',
            label: 'Utama',
            href: '/',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
        },
        {
            id: 'search',
            label: 'Cari',
            href: '/#search-input',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
        },
        {
            id: 'account',
            label: 'Akaun',
            href: '/login.html',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
        }
    ];

    nav.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="bottom-nav-item ${activePage === item.id ? 'active' : ''}">
            ${item.icon}
            ${item.label}
        </a>
    `).join('');

    document.body.appendChild(nav);
}

// Auto-run generic setup when DOM loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // We will explicitly call injectBottomNav from individual pages with their active state.
    });

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
        });
    }
}
