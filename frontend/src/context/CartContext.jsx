import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem('wishlistItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Cart Functions
    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.selectedSize === product.selectedSize)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id, size) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
    };

    const updateQuantity = (id, size, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id && item.selectedSize === size) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    // Wishlist Functions
    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            if (prev.find(item => item.id === product.id)) {
                return prev.filter(item => item.id !== product.id); // Toggle off if exists
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlistItems.some(item => item.id === id);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
            wishlistItems, addToWishlist, removeFromWishlist, isInWishlist
        }}>
            {children}
        </CartContext.Provider>
    );
};
