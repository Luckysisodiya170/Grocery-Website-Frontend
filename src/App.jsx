import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/Mainlayout";
import AuthLayout from "./layout/Authlayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Help from "./pages/Help/Help";
import Home from "./pages/Home/Home";
import LoginRegister from "./pages/auth/Login-Register/Login-Register";
import Verify from "./pages/auth/OTP/OTP-Verify";
import VendorRegister from "./pages/auth/vendor/VendorRegister";

import ProductDetails from "./components/Product/ProductDetails/ProductDetails";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import Notfound from "./pages/Not-found/Not-found";

import WishlistPage from "./pages/wishlist/WishlistPage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/cart/CheckoutPage";
import OrderHistory from "./pages/cart/OrderHistory";
import Profile from "./pages/Profile/Profile";

import { CartProvider } from "./pages/cart/CartContext";
import { WishlistProvider } from "./pages/wishlist/WishlistContext";
import { OrdersProvider } from "./pages/cart/OrdersContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import OrderSuccess from "./pages/cart/OrderSuccess";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={2000} />

        <OrdersProvider>
          <WishlistProvider>
            <CartProvider>
              <Routes>

                {/* AUTH ROUTES */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginRegister />} />
                  <Route path="/register" element={<LoginRegister />} />
                  <Route path="/verify-otp" element={<Verify />} />
                </Route>

                {/* MAIN ROUTES */}
                <Route element={<MainLayout />}>

                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/shop" element={<CategoryPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/help" element={<Help />} />

                  {/* 🔥 Vendor moved here */}
                  <Route path="/vendor-register" element={<VendorRegister />} />

                </Route>

                <Route path="*" element={<Notfound />} />
                <Route path="/order-success" element={
                  <OrderSuccess/>
                }/>
              </Routes>
            </CartProvider>
          </WishlistProvider>
        </OrdersProvider>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;