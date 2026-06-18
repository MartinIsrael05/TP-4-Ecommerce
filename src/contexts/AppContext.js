'use client'
import { useState, useContext, createContext } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const addToCart = (product, customizations, quantity) => {
    const cartItemId = `${product._id}-${JSON.stringify(customizations)}`;
    const exists = cart.find(item => item.cartItemId === cartItemId);

    if (exists) {
      setCart(cart.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + quantity, subtotal: item.price * (item.quantity + quantity) }
          : item
      ));
    } else {
      const cartItem = {
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity,
        customizations: customizations,
        subtotal: product.price * quantity,
        cartItemId: cartItemId,
      };
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const addFavorite = (data) => {
    setFavorites([...favorites, data]);
  };

  const removeFavorite = (productId) => {
    setFavorites(favorites.filter(fav => fav._id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  const favoritesQty = () => favorites.length;

  const login = (userData) => setActiveUser(userData);

  const logout = () => {
    setActiveUser(null);
    setFavorites([]);
  };

  return (
    <AppContext.Provider value={{
      favorites, setFavorites, favoritesQty, addFavorite, removeFavorite, isFavorite,
      cart, setCart, addToCart, removeFromCart,
      activeUser, login, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext solo puede ser usado dentro del provider');
  }

  return context;
};

export default AppContext;
