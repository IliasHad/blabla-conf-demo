import { createContext, useContext, useState, useEffect } from "react";
import { getCart, removeItem, createCart } from "../lib/shopify";
export const CartContext = createContext([]);

export function CartWrapper({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState({});
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("checkoutId")) {
      const cart = getCartData();
      cart.then((data) => {
        if (data && data.lines && data.lines.edges) {
          setCartCount(data.lines.edges.length);
          setCart(data);
        }
      });
    }
  }, []);

  const getCartData = () => {
    return getCart(localStorage.getItem("checkoutId"));
  };

  const removeItemFromCart = async (item) => {
    const data = await removeItem(localStorage.getItem("checkoutId"), [item]);

    if (data && data.lines) {
      setCartCount(data.lines.edges.length);
      setCart(data);
    }
  };
  const createNewCart = async (merchandiseId, quantity) => {
    const data = await createCart(merchandiseId, quantity);
    localStorage.setItem("checkoutId", data.id);
    if (data && data.lines) {
      setCartCount(data.lines.edges.length);
      setCart(data);
      setOpenCart(true);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        cart,
        removeItemFromCart,
        openCart,
        setOpenCart,
        createNewCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const updateFns = useContext(CartContext);

  if (updateFns === undefined) {
    throw new Error("");
  }

  return updateFns;
}
