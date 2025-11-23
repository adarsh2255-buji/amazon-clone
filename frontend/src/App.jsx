import { BrowserRouter, Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { StoreProvider } from "./context/StoreContext"
import Layout from "./components/Layout"
import HomeScreen from "./pages/HomeScreen"
import ProductScreen from "./pages/ProductScreen"
import CartScreen from "./pages/CartScreen"
import LoginScreen from "./pages/LoginScreen"
import SignupScreen from "./pages/SignupScreen"

import PlaceOrderScreen from "./pages/PlaceOrderScreen"
import OrderScreen from "./pages/OrderScreen"
import CheckoutScreen from "./pages/CheckoutScreen"
import OrderSuccessScreen from "./pages/OrderSuccessScreen"
import MyOrderScreen from "./pages/MyOrderScreen"
// // 
function App() {
 
return (
  <>
    <GoogleOAuthProvider clientId="424556341033-hb5crmg645vimrc6cd8ncjt4jqgudj38.apps.googleusercontent.com">
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout Route with Outlet */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeScreen />} />
              <Route path="product/:id" element={<ProductScreen />} />
              <Route path="cart" element={<CartScreen />} />
              <Route path="checkout" element={<CheckoutScreen />} />
              <Route path="shipping" element={<CheckoutScreen />} /> 
              <Route path="payment" element={<CheckoutScreen />} />

              <Route path="placeorder" element={<PlaceOrderScreen />} />
              <Route path="order-success/:id" element={<OrderSuccessScreen />} />
              <Route path="myorders" element={<MyOrderScreen />} />
              <Route path="order/:id" element={<OrderScreen />} />
            </Route>
            <Route path="login" element={<LoginScreen />} />
              <Route path="register" element={<SignupScreen />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </GoogleOAuthProvider>
  </>
)
  
}

export default App
