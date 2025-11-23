import { createContext, useContext, useReducer } from "react";

const Store = createContext();

// Normalize stored userInfo shape: older responses stored { success, token, user }
const rawUserInfo = localStorage.getItem("userInfo");
let parsedUserInfo = null;
if (rawUserInfo) {
  try {
    const tmp = JSON.parse(rawUserInfo);
    // If backend response shape ({ success, token, user }) was stored, normalize it
    if (tmp && tmp.user && tmp.token) parsedUserInfo = { token: tmp.token, ...tmp.user };
    else parsedUserInfo = tmp;
  } catch (e) {
    parsedUserInfo = null;
  }
}

const initialState = {
  userInfo: parsedUserInfo,
  cart: {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingAddress: localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")) : {},
    paymentMethod: localStorage.getItem("paymentMethod") ? localStorage.getItem("paymentMethod") : "",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      return { ...state, userInfo: null, cart: { ...state.cart, cartItems: [], shippingAddress: {}, paymentMethod: "" } };
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item.product === newItem.product);
      const updatedCartItems = existItem
        ? state.cart.cartItems.map((item) => item.product === existItem.product ? newItem : item)
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } };
    case "CART_REMOVE_ITEM":
      const filteredItems = state.cart.cartItems.filter((item) => item.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(filteredItems));
      return { ...state, cart: { ...state.cart, cartItems: filteredItems } };
    case "CART_CLEAR_ITEMS":
      localStorage.removeItem("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "SAVE_SHIPPING_ADDRESS":
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
    case "SAVE_PAYMENT_METHOD":
      localStorage.setItem("paymentMethod", action.payload);
      return { ...state, cart: { ...state.cart, paymentMethod: action.payload } };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
}
export const useStore = () => useContext(Store);

