import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Login-Register.css";
import { toast } from "react-toastify";
import "../vendor/VendorRegister.css";
import deliveryImg from "../../../assets/deliveryimage.jpg";
import { useAuth } from "../../../context/AuthContext";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

// Steps Import
import BasicInfo from "../vendor/steps/BasicInfo";
import Location from "../vendor/steps/Location";
import BusinessIds from "../vendor/steps/BusinessIds";
import BankDetails from "../vendor/steps/BankDetails";

function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegister = useMemo(() => location.pathname === "/register", [location.pathname]);

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", password: "", confirm: "",
  });

  const handleUserChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMobileChange = (value) => {
    setError("");
    setFormData((prev) => ({ ...prev, mobile: value }));
  };

  const [currentStep, setCurrentStep] = useState(1);
 const [vendorData, setVendorData] = useState({
    businessName: "", 
    businessCategory: [], // 👈 Isko array bana diya taaki multiple save ho sakein
    ownerName: "", email: "", password: "", contactNumber: "", emergencyContact: "",
    address: "", city: "", state: "", country: "India", pincode: "", geoLocation: "",
    tradeLicense: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: ""
  });

  const handleVendorChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) return setError("Enter a valid mobile number");
    if (formData.password !== formData.confirm) return setError("Passwords do not match");

    setLoading(true);
    setTimeout(() => {
      login({ id: Date.now(), name: formData.name, mobile: formData.mobile, role: "user", avatar: "https://i.pravatar.cc/150?img=12" });
      navigate("/login");
      setLoading(false);
    }, 500);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) return setError("Enter a valid mobile number");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpValue.length < 4) return setError("Please enter the complete OTP");
    setLoading(true);
    setTimeout(() => {
      login({ id: Date.now(), name: "User", mobile: formData.mobile, role: "user", avatar: "https://i.pravatar.cc/150?img=12" });
      navigate("/");
      setLoading(false);
      setOtpStep(false);
    }, 800);
  };
// ==========================================
  // VENDOR SUBMIT WTIH VALIDATION & REDIRECT
  // ==========================================
  const handleVendorSubmit = () => {
    // 1. VALIDATION CHECKS
    if (!vendorData.businessName || !vendorData.ownerName || !vendorData.email || !vendorData.password) {
      return setError("Basic Info is incomplete. Please fill all fields.");
    }
    if (!vendorData.contactNumber || vendorData.contactNumber.length < 10) {
      return setError("Please enter a valid Contact Number.");
    }
    if (!vendorData.address || !vendorData.city || !vendorData.pincode) {
      return setError("Location details are incomplete.");
    }
    if (!vendorData.bankName || !vendorData.accountNumber || !vendorData.ifscCode) {
      return setError("Bank details are incomplete.");
    }

    // Agar sab theek hai toh aage badho
    setError("");
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      
      // Success Message (Make sure toast is imported from react-toastify)
      toast.success("Vendor Registered Successfully! Please login.", {
        position: "top-center"
      });

      // 2. REDIRECT TO LOGIN (Without automatically logging in)
      navigate("/login");
      
      // Optional: Form ko reset kar do
      setCurrentStep(1);
      setRole("vendor"); 
    }, 1000);
  };
  return (
    <div className="auth-page">
      {/* Dynamic class added here for vendor mode */}
      <div className={`auth-card ${isRegister && role === 'vendor' ? 'vendor-mode' : ''}`}>

        {/* LEFT SIDE (FORM) */}
        <div className="auth-form">
          <h2>
            {isRegister
              ? "Create Account"
              : otpStep
                ? "Verify OTP"
                : "Welcome Back"}
          </h2>
          <p className="subtitle">
            {isRegister
              ? "Join our community today"
              : otpStep
                ? `Code sent to +${formData.mobile}`
                : "Login with your mobile number"}
          </p>

          {isRegister && (
            <div className="role-toggle">
              <button type="button" className={role === "user" ? "active" : ""} onClick={() => setRole("user")}>
                User
              </button>
              <button type="button" className={role === "vendor" ? "active" : ""} onClick={() => setRole("vendor")}>
                Vendor
              </button>
            </div>
          )}

          {role === "user" || !isRegister ? (

            <form onSubmit={isRegister ? handleRegisterSubmit : (otpStep ? handleVerifyOtp : handleSendOtp)}>

              {isRegister && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <div className="input-icon-wrapper"><PersonIcon fontSize="small" /></div>
                    <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleUserChange} required />
                  </div>
                </div>
              )}

              {/* Yahan se input-icon-wrapper hata diya gaya hai */}
              {!otpStep && (
                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className="phone-wrapper">
                    <PhoneInput
                      country="in"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                    />
                  </div>
                </div>
              )}

              {isRegister && (
                <>
                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                      <div className="input-icon-wrapper"><EmailIcon fontSize="small" /></div>
                      <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleUserChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-with-icon">
                      <div className="input-icon-wrapper"><LockIcon fontSize="small" /></div>
                      <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleUserChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-with-icon">
                      <div className="input-icon-wrapper"><LockIcon fontSize="small" /></div>
                      <input type="password" name="confirm" placeholder="Confirm password" value={formData.confirm} onChange={handleUserChange} required />
                    </div>
                  </div>
                </>
              )}

              {(!isRegister && otpStep) && (
                <div className="form-group">
                  <label>Enter 4-Digit Code</label>
                  <div className="input-with-icon">
                    <div className="input-icon-wrapper"><VpnKeyIcon fontSize="small" /></div>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="e.g. 1234"
                      value={otpValue}
                      onChange={(e) => {
                        setError("");
                        setOtpValue(e.target.value.replace(/\D/g, ''));
                      }}
                      style={{ letterSpacing: "4px", fontSize: "16px", fontWeight: "bold" }}
                      required
                    />
                  </div>
                  <button type="button" className="resend-link" onClick={() => { setOtpValue(""); alert("New code sent!"); }}>
                    Resend Code
                  </button>
                </div>
              )}

              {error && <p className="error">{error}</p>}

              <button className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : isRegister ? "Register" : (otpStep ? "Verify & Login" : "Send OTP")}
              </button>

              {(!isRegister && otpStep) && (
                <button type="button" className="back-link" onClick={() => setOtpStep(false)}>
                  Wrong number? Change it
                </button>
              )}
            </form>

          ) : (

            <div className="vendor-inline-wizard" style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                {['Basic Info', 'Location', 'Documents', 'Bank Details'].map((stepName, idx) => (
                  <span key={idx} style={{ fontSize: "12px", fontWeight: "bold", color: currentStep >= idx + 1 ? "#11998e" : "#aaa" }}>
                    {currentStep > idx + 1 ? "✓ " : `${idx + 1}. `} {stepName}
                  </span>
                ))}
              </div>

              <div style={{ minHeight: "280px" }}>
                {currentStep === 1 && <BasicInfo vendorData={vendorData} handleChange={handleVendorChange} />}
                {currentStep === 2 && <Location vendorData={vendorData} handleChange={handleVendorChange} />}
                {currentStep === 3 && <BusinessIds vendorData={vendorData} handleChange={handleVendorChange} />}
                {currentStep === 4 && <BankDetails vendorData={vendorData} handleChange={handleVendorChange} />}
              </div>

              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                {currentStep > 1 && (
                  <button type="button" className="submit-btn" style={{ background: "#f0f0f0", color: "#333", flex: 0.5 }} onClick={() => setCurrentStep(prev => prev - 1)}>
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button type="button" className="submit-btn" style={{ flex: 1 }} onClick={() => setCurrentStep(prev => prev + 1)}>
                    Next Step
                  </button>
                ) : (
                  <button type="button" className="submit-btn" style={{ flex: 1 }} onClick={handleVendorSubmit} disabled={loading}>
                    {loading ? "Processing..." : "Register as Vendor"}
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="switch-text" style={{ marginTop: "20px" }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <Link to={isRegister ? "/login" : "/register"}>{isRegister ? " Login" : " Register"}</Link>
          </p>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
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