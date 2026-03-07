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
  const [fieldErrors, setFieldErrors] = useState({});
  const [cardSuccess, setCardSuccess] = useState(false);

  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", password: "", confirm: "",
  });

  const handleUserChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMobileChange = (value) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, mobile: false }));
    setFormData((prev) => ({ ...prev, mobile: value }));
  };

  // Trigger shake by setting fieldErrors, then clearing after 500ms
  const triggerError = (fields, message) => {
    const errMap = {};
    fields.forEach((f) => (errMap[f] = true));
    setFieldErrors(errMap);
    setError(message);
    setTimeout(() => setFieldErrors({}), 600);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [vendorData, setVendorData] = useState({
    businessName: "",
    businessCategory: [],
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
    if (!formData.name.trim()) return triggerError(["name"], "Please enter your full name");
    if (!formData.mobile || formData.mobile.length < 10) return triggerError(["mobile"], "Enter a valid mobile number");
    if (!formData.email.trim()) return triggerError(["email"], "Please enter your email");
    if (!formData.password) return triggerError(["password"], "Please enter a password");
    if (formData.password !== formData.confirm) return triggerError(["confirm"], "Passwords do not match");

    setLoading(true);
    setTimeout(() => {
      login({ id: Date.now(), name: formData.name, mobile: formData.mobile, role: "user", avatar: "https://i.pravatar.cc/150?img=12" });
      setLoading(false);
      setCardSuccess(true);
      setTimeout(() => navigate("/login"), 600);
    }, 500);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) return triggerError(["mobile"], "Enter a valid mobile number");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpValue.length < 4) return triggerError(["otp"], "Please enter the complete OTP");
    setLoading(true);
    setTimeout(() => {
      login({ id: Date.now(), name: "User", mobile: formData.mobile, role: "user", avatar: "https://i.pravatar.cc/150?img=12" });
      setCardSuccess(true);
      setTimeout(() => {
        navigate("/");
        setLoading(false);
        setOtpStep(false);
      }, 600);
    }, 800);
  };

  const handleVendorSubmit = () => {
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

    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Vendor Registered Successfully! Please login.", { position: "top-center" });
      navigate("/login");
      setCurrentStep(1);
      setRole("vendor");
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${isRegister && role === "vendor" ? "vendor-mode" : ""} ${cardSuccess ? "auth-success" : ""}`}>

        {/* LEFT SIDE (FORM) */}
        <div className="auth-form">
          <h2>
            {isRegister ? "Create Account" : otpStep ? "Verify OTP" : "Welcome Back"}
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

              {/* Full Name */}
              {isRegister && (
                <div className="form-group floating">
                  <div className={`input-with-icon ${fieldErrors.name ? "input-error" : ""}`}>
                    <div className="input-icon-wrapper"><PersonIcon fontSize="small" /></div>
                    <input
                      type="text"
                      name="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleUserChange}
                    />
                    <label>Full Name</label>
                  </div>
                </div>
              )}

              {/* Mobile */}
              {!otpStep && (
                <div className={`form-group ${fieldErrors.mobile ? "field-has-error" : ""}`}>
                  <label className="static-label">Mobile Number</label>
                  <div className="phone-wrapper">
                    <PhoneInput
                      country="in"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      inputClass={fieldErrors.mobile ? "phone-error" : ""}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              {isRegister && (
                <>
                  <div className="form-group floating">
                    <div className={`input-with-icon ${fieldErrors.email ? "input-error" : ""}`}>
                      <div className="input-icon-wrapper"><EmailIcon fontSize="small" /></div>
                      <input
                        type="email"
                        name="email"
                        placeholder=" "
                        value={formData.email}
                        onChange={handleUserChange}
                      />
                      <label>Email Address</label>
                    </div>
                  </div>

                  <div className="form-group floating">
                    <div className={`input-with-icon ${fieldErrors.password ? "input-error" : ""}`}>
                      <div className="input-icon-wrapper"><LockIcon fontSize="small" /></div>
                      <input
                        type="password"
                        name="password"
                        placeholder=" "
                        value={formData.password}
                        onChange={handleUserChange}
                      />
                      <label>Password</label>
                    </div>
                  </div>

                  <div className="form-group floating">
                    <div className={`input-with-icon ${fieldErrors.confirm ? "input-error" : ""}`}>
                      <div className="input-icon-wrapper"><LockIcon fontSize="small" /></div>
                      <input
                        type="password"
                        name="confirm"
                        placeholder=" "
                        value={formData.confirm}
                        onChange={handleUserChange}
                      />
                      <label>Confirm Password</label>
                    </div>
                  </div>
                </>
              )}

              {/* OTP */}
              {!isRegister && otpStep && (
                <div className="form-group floating">
                  <div className={`input-with-icon ${fieldErrors.otp ? "input-error" : ""}`}>
                    <div className="input-icon-wrapper"><VpnKeyIcon fontSize="small" /></div>
                    <input
                      type="text"
                      name="otp"
                      maxLength="4"
                      placeholder=" "
                      value={otpValue}
                      onChange={(e) => {
                        setError("");
                        setFieldErrors((prev) => ({ ...prev, otp: false }));
                        setOtpValue(e.target.value.replace(/\D/g, ""));
                      }}
                      style={{ letterSpacing: "6px", fontSize: "18px", fontWeight: "bold" }}
                    />
                    <label>4-Digit Code</label>
                  </div>
                  <button type="button" className="resend-link" onClick={() => { setOtpValue(""); alert("New code sent!"); }}>
                    Resend Code
                  </button>
                </div>
              )}

              {error && <p className="error shake-text">{error}</p>}

              <button className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : isRegister ? "Create Account" : (otpStep ? "Verify & Login" : "Send OTP")}
              </button>

              {!isRegister && otpStep && (
                <button type="button" className="back-link" onClick={() => setOtpStep(false)}>
                  Wrong number? Change it
                </button>
              )}
            </form>

          ) : (
            <div className="vendor-inline-wizard" style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                {["Basic Info", "Location", "Documents", "Bank Details"].map((stepName, idx) => (
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

              {error && <p className="error">{error}</p>}

              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                {currentStep > 1 && (
                  <button type="button" className="submit-btn" style={{ background: "#f0f0f0", color: "#333", flex: 0.5 }} onClick={() => setCurrentStep((prev) => prev - 1)}>
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button type="button" className="submit-btn" style={{ flex: 1 }} onClick={() => setCurrentStep((prev) => prev + 1)}>
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