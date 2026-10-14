import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    setWishlistItems((items) => {
      const alreadyExists = items.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return items;
      }

      return [...items, product];
    });
  };

  // Remove product from wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  // Check whether product is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Number of wishlist items
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}