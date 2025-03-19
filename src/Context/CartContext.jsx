import React, { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cart from Firebase on login
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const cartRef = doc(db, "carts", user.uid);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            setCart(cartSnap.data().items || {});
          } else {
            setCart({});
          }
        } catch (error) {
          console.error("🔥 Error loading cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart({});
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // ✅ Save cart to Firebase when cart changes
  useEffect(() => {
    const saveCart = async () => {
      if (user && !loading) {
        try {
          const cartRef = doc(db, "carts", user.uid);
          await setDoc(cartRef, { items: cart }, { merge: true });
        } catch (error) {
          console.error("🔥 Error saving cart:", error);
        }
      }
    };

    if (user) {
      saveCart();
    }
  }, [cart, user, loading]);

  // ✅ Clear cart on logout
  const clearCart = () => {
    setCart({});
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      setDoc(cartRef, { items: {} }, { merge: true });
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
