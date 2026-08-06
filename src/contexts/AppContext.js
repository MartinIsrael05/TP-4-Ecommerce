"use client";

import { useState, useContext, createContext, useEffect } from "react";

const AppContext = createContext();

async function apiFetchFavorites(userId) {
  const res = await fetch(`/api/users/${userId}/favorites`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.favorites;
}

async function apiAddFavorite(userId, productId) {
  const res = await fetch(`/api/users/${userId}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.favorites;
}

async function apiRemoveFavorite(userId, productId) {
  const res = await fetch(`/api/users/${userId}/favorites/${productId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.favorites;
}

async function apiSyncFavorites(userId, favoriteIds) {
  const res = await fetch(`/api/users/${userId}/favorites/sync`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favoriteIds }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.favorites;
}

export const AppContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [contextReady, setContextReady] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setActiveUser(user);
      setContextReady(true);
      // Cargar favoritos de DB en segundo plano, sin bloquear la UI
      apiFetchFavorites(user._id)
        .then((favs) => setFavorites(favs))
        .catch((err) => console.error("Error cargando favoritos:", err));
      return;
    }

    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    setContextReady(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
    }
  }, [activeUser]);

  const addToCart = (product, customizations, quantity) => {
    const cartItemId = `${product._id}-${JSON.stringify(customizations)}`;
    const exists = cart.find((item) => item.cartItemId === cartItemId);

    if (exists) {
      const newQty = Math.min(exists.quantity + quantity, exists.stock ?? Infinity);
      setCart(
        cart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQty, subtotal: item.price * newQty }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
          quantity,
          customizations,
          subtotal: product.price * quantity,
          cartItemId,
        },
      ]);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(
      cart.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const clampedQty = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
        return { ...item, quantity: clampedQty, subtotal: item.price * clampedQty };
      })
    );
  };

  const clearCart = () => setCart([]);

  const addFavorite = async (product) => {
    if (activeUser) {
      try {
        const updated = await apiAddFavorite(activeUser._id, product._id);
        setFavorites(updated);
      } catch (err) {
        console.error("Error agregando favorito:", err);
      }
      return;
    }
    setFavorites((prev) => {
      const alreadyIn = prev.some((f) => f._id === product._id);
      if (alreadyIn) return prev;
      const updated = [...prev, product];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = async (productId) => {
    if (activeUser) {
      try {
        const updated = await apiRemoveFavorite(activeUser._id, productId);
        setFavorites(updated);
      } catch (err) {
        console.error("Error quitando favorito:", err);
      }
      return;
    }
    setFavorites((prev) => {
      const updated = prev.filter((f) => f._id !== productId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (productId) => favorites.some((f) => f._id === productId);
  const favoritesQty = () => favorites.length;

  const login = async (userData) => {
    setActiveUser(userData);
    localStorage.setItem("activeUser", JSON.stringify(userData));

    const savedFavs = localStorage.getItem("favorites");
    const localFavs = savedFavs ? JSON.parse(savedFavs) : [];
    const localIds = localFavs.map((p) => p._id);

    try {
      let updated;
      if (localIds.length > 0) {
        updated = await apiSyncFavorites(userData._id, localIds);
        localStorage.removeItem("favorites");
      } else {
        updated = await apiFetchFavorites(userData._id);
      }
      setFavorites(updated);
    } catch (err) {
      console.error("Error sincronizando favoritos al login:", err);
    }
  };

  const logout = () => {
    setActiveUser(null);
    setFavorites([]);
    localStorage.removeItem("activeUser");
    localStorage.removeItem("favorites");
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        setFavorites,
        favoritesQty,
        addFavorite,
        removeFavorite,
        isFavorite,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        activeUser,
        contextReady,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext solo puede ser usado dentro del provider");
  return context;
};

export default AppContext;
