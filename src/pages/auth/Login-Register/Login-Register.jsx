import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Login-Register.css";
import deliveryImg from "../../../assets/deliveryimage.jpg";
import { useAuth } from "../../../context/AuthContext";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";

function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegister = useMemo(
    () => location.pathname === "/register",
    [location.pathname]
  );

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMobileChange = (value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      mobile: value,
    }));
  };

  const validate = () => {
    const { name, mobile, email, password, confirm } = formData;

    if (!mobile || mobile.length < 10) {
      return "Enter a valid mobile number";
    }

    if (isRegister) {
      if (!name.trim() || !email.trim() || !password || !confirm) {
        return "All fields are required";
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return "Enter valid email";
      }

      if (password.length < 6) {
        return "Password must be at least 6 characters";
      }

      if (password !== confirm) {
        return "Passwords do not match";
      }
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const { name, mobile, email } = formData;

    if (isRegister) {
      setTimeout(() => {
        login({
          id: Date.now(),
          name,
          email,
          mobile,
          role,
          avatar: "https://i.pravatar.cc/150?img=12",
        });

        role === "vendor"
          ? navigate("/vendor-register")
          : navigate("/");

        setLoading(false);
      }, 500);
    } else {
      navigate("/verify-otp", { state: { mobile } });
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-form">
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p className="subtitle">
            {isRegister
              ? "Join our community today"
              : "Login with your mobile number"}
          </p>

          {isRegister && (
            <div className="role-toggle">
              <button
                type="button"
                className={role === "user" ? "active" : ""}
                onClick={() => setRole("user")}
              >
                User
              </button>
              <button
                type="button"
                className={role === "vendor" ? "active" : ""}
                onClick={() => setRole("vendor")}
              >
                Vendor
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {isRegister && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <span className="icon-wrapper">
                    <PersonIcon />
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Mobile Number</label>
              <div className="input-with-icon phone-wrapper">
                <span className="icon-wrapper">
                  <PhoneIcon />
                </span>
                <PhoneInput
                  country="in"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <span className="icon-wrapper">
                      <EmailIcon />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <span className="icon-wrapper">
                      <LockIcon />
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-with-icon">
                    <span className="icon-wrapper">
                      <LockIcon />
                    </span>
                    <input
                      type="password"
                      name="confirm"
                      placeholder="Confirm password"
                      value={formData.confirm}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {error && <p className="error">{error}</p>}

            <button className="submit-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : isRegister
                ? "Register"
                : "Send OTP"}
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

        {/* RIGHT SIDE */}
        <div className="auth-image">
          <img src={deliveryImg} alt="Delivery" />
          <div className="overlay">
            <h3>Lightning Fast Delivery</h3>
            <p>Experience the best service in your city.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginRegister;