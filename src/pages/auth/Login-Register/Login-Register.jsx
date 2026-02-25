import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Login-Register.css";
import deliveryImg from "../../../assets/deliveryimage.jpg";
import { useAuth } from "../../../context/AuthContext";

function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/register";
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, mobile, email, password, confirm } = formData;

    if (!mobile || mobile.length < 10) {
      setError("Enter valid mobile number");
      return;
    }

    if (isRegister) {
      if (!name || !email || !password || !confirm) {
        setError("All fields are required");
        return;
      }

      if (password !== confirm) {
        setError("Passwords do not match");
        return;
      }

      // REGISTER SUCCESS (Keep as it is)
      login({
        name: name,
        mobile: mobile,
        token: "demo_token"
      });

      navigate("/");
    } else {
      // 🔥 LOGIN → Redirect to OTP Verify (NO LOGIN YET)
      navigate("/verify-otp", {
        state: { mobile }
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-form">
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p className="subtitle">
            {isRegister
              ? "Join our community today"
              : "Login with your mobile number"}
          </p>

          {/* ENTER KEY WORKS BECAUSE OF onSubmit */}
          <form onSubmit={handleSubmit}>

            {isRegister && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-group">
              <label>Mobile Number</label>
              <PhoneInput
                country={"in"}
                value={formData.mobile}
                onChange={(val) =>
                  setFormData({ ...formData, mobile: val })
                }
                inputProps={{
                  required: true,
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }
                }}
              />
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirm"
                    placeholder="Confirm password"
                    value={formData.confirm}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit-btn">
              {isRegister ? "Register" : "Send OTP"}
            </button>

          </form>

          <p className="switch-text">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? " Login" : " Register"}
            </Link>
          </p>
        </div>

        <div className="auth-image">
          <img src={deliveryImg} alt="Delivery" />
          <div className="overlay">
            <h3>Lightning Fast Delivery</h3>
            <p>
              Experience the best service in Dewas with real-time tracking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginRegister;