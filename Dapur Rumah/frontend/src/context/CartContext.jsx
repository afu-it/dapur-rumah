import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('dapur_rumah_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load user profile
    const savedProfile = localStorage.getItem('dapur_rumah_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('dapur_rumah_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Save user profile to localStorage
    localStorage.setItem('dapur_rumah_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(productId, delta) {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            return { ...item, qty: item.qty + delta };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function updateProfile(profile) {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }

  function generateWhatsAppMessage() {
    if (cart.length === 0) return '';

    let text = `*PESANAN BARU - DAPUR RUMAH*\n\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.name}\n`;
      text += `   Qty: ${item.qty} x RM ${item.price.toFixed(2)} = RM ${(item.price * item.qty).toFixed(2)}\n\n`;
    });

    text += `------------------------\n`;
    text += `*JUMLAH: RM ${cartTotal.toFixed(2)}*\n\n`;
    text += `*MAKLUMAT PENGGUNA:*\n`;
    text += `Nama: ${userProfile.name || 'Belum diisi'}\n`;
    text += `No. Telefon: ${userProfile.phone || 'Belum diisi'}\n`;
    text += `Alamat: ${userProfile.address || 'Belum diisi'}`;

    return text;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        userProfile,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        updateProfile,
        generateWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
