import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login-Register.css";

import deliveryImg from "../../../assets/deliveryimage.jpg";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";

  // form state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // validation helpers
  const validatePhone = (num) => /^[0-9]{10}$/.test(num);

  const handleSubmit = (e) => {
    e.preventDefault();

    // mobile validation
    if (!validatePhone(mobile)) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    if (isRegister) {
      // register validation
      if (!name) {
        setError("Full name required");
        return;
      }

      if (password.length < 6) {
        setError("Password must be 6+ characters");
        return;
      }

      alert("Registered successfully ✅");
      navigate("/login");
      return;
    }

    // login → OTP flow
    setError("");

    navigate("/verify-otp", {
      state: { type: "login" }
    });
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LEFT FORM */}
        <div className="auth-form">
          <h2>{isRegister ? "Create Account" : "Welcome Back!"}</h2>

          <p className="subtitle">
            {isRegister
              ? "Create your account to start ordering"
              : "Sign in with your mobile number"}
          </p>

          <div className="form-wrapper">

            <form onSubmit={handleSubmit}>

              {isRegister && (
                <>
                  <input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </>
              )}

              <input
                placeholder="Mobile Number"
                value={mobile}
                maxLength={10}
                onChange={(e)=>setMobile(e.target.value.replace(/\D/g,""))}
              />

              {!isRegister && (
                <div className="forgot-wrapper">
                  <span
                    className="forgot-link"
                    onClick={()=>navigate("/forgot")}
                  >
                    Forgot Password?
                  </span>
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}

              <button className="login-btn">
                {isRegister ? "Register" : "Login"}
              </button>

            </form>

            <div className="divider">Or login with</div>

            <button type="button" className="social-btn">
              <GoogleIcon sx={{ color: "#EA4335" }} />
              Login with Google
            </button>

            <button className="social-btn">
              <FacebookIcon sx={{ color: "#1877F2" }} />
              Login with Facebook
            </button>
          </div>

          <p className="switch-text">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? " Login" : " Register"}
            </Link>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="auth-image">
          <img src={deliveryImg} alt="delivery" />

          <div className="auth__visual-content">
            <h2>Fast Delivery at Your Doorstep</h2>
            <p>
              Order groceries, essentials and more from nearby stores
              with lightning fast delivery.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginRegister;
