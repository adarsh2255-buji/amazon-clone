import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const CartScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useStore();
    const { cartItems } = state.cart;

    const updateCartHandler = (item, qty) => {
        if (qty > item.countInStock) return alert('Out of stock');
        dispatch({ type: "CART_ADD_ITEM", payload: { ...item, qty } });
    };

    const checkoutHandler = () => {
        state.userInfo ? navigate("/shipping") : navigate("/login?redirect=/shipping");
    };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="bg-blue-50 p-4 rounded border border-blue-200">Cart is empty. <Link to="/" className="underline font-bold">Go Shopping</Link></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center bg-white p-4 rounded shadow-sm border">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                <div className="flex-1 px-4">
                  <Link to={`/product/${item.product}`} className="text-lg font-medium hover:text-yellow-600">{item.name}</Link>
                </div>
                <div className="text-lg font-bold w-24">${item.price}</div>
                <select value={item.qty} onChange={(e) => updateCartHandler(item, Number(e.target.value))} className="border rounded p-1 w-20">
                  {[...Array(item.countInStock).keys()].map((x) => <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                </select>
                <button onClick={() => dispatch({ type: "CART_REMOVE_ITEM", payload: item.product })} className="ml-4 text-red-600 hover:text-red-800">Remove</button>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-white border p-4 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h2>
              <div className="text-2xl font-bold mb-6">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</div>
              <button onClick={checkoutHandler} disabled={cartItems.length === 0} className="w-full bg-yellow-400 font-bold py-2 px-4 rounded">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen