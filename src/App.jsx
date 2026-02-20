import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/Mainlayout";
import AuthLayout from "./layout/Authlayout";

import Home from "./pages/Home/Home";
import LoginRegister from "./pages/auth/Login-Register/Login-Register";
// import Forgot from "./pages/auth/Forgot/Forgot";
import Verify from "./pages/auth/OTP/OTP-Verify";
// import ResetPassword from "./pages/auth/Reset/ResetPassword";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- AUTH ROUTES (NO NAVBAR) ---------- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginRegister/>} />
          <Route path="/register" element={<LoginRegister/>} />
          {/* <Route path="/forgot" element={<Forgot />} /> */}
          <Route path="/verify-otp" element={<Verify />} />
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        </Route>

        {/* ---------- MAIN ROUTES (NAVBAR VISIBLE) ---------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
