import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Login-Register.css";

// 1. Path Fix: Do folder peeche jana hai
import "../../vendor/VendorRegister.css"; 
import deliveryImg from "../../../assets/deliveryimage.jpg";
import { useAuth } from "../../../context/AuthContext";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";

// Steps Import with correct path
import BasicInfo from "../../vendor/steps/BasicInfo";
import Location from "../../vendor/steps/Location";
import BusinessIds from "../../vendor/steps/BusinessIds";
import BankDetails from "../../vendor/steps/BankDetails";

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
    businessName: "", businessCategory: "Restaurant", ownerName: "", email: "", password: "", contactNumber: "", emergencyContact: "",
    address: "", city: "", state: "", country: "India", pincode: "", geoLocation: "",
    tradeLicense: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: ""
  });

  const handleVendorChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) return setError("Enter a valid mobile number");
    
    setLoading(true);
    setTimeout(() => {
      login({ id: Date.now(), ...formData, role: "user", avatar: "https://i.pravatar.cc/150?img=12" });
      navigate("/");
      setLoading(false);
    }, 500);
  };

  const handleVendorSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      login({ 
        id: Date.now(), 
        name: vendorData.ownerName,
        email: vendorData.email,
        role: "vendor", 
        vendorDetails: vendorData,
        vendorProfileCompleted: true 
      });
      navigate("/"); 
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      {/* 2. Jab Vendor ho toh card bada ho jayega taaki dono fit aa sakein */}
      <div className="auth-card" style={role === "vendor" && isRegister ? { maxWidth: "1100px", height: "auto" } : {}}>

        {/* LEFT SIDE (FORM) */}
        <div className="auth-form" style={role === "vendor" && isRegister ? { flex: "1 1 55%", maxWidth: "55%", paddingRight: "30px" } : {}}>
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p className="subtitle">
            {isRegister ? "Join our community today" : "Login with your mobile number"}
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
            
            <form onSubmit={handleUserSubmit}>
              {isRegister && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <span className="icon-wrapper"><PersonIcon /></span>
                    <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleUserChange} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-with-icon phone-wrapper">
                  <span className="icon-wrapper"><PhoneIcon /></span>
                  <PhoneInput country="in" value={formData.mobile} onChange={handleMobileChange} />
                </div>
              </div>

              {isRegister && (
                <>
                  <div className="form-group">
                    <label>Email</label>
                    <div className="input-with-icon">
                      <span className="icon-wrapper"><EmailIcon /></span>
                      <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleUserChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-with-icon">
                      <span className="icon-wrapper"><LockIcon /></span>
                      <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleUserChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-with-icon">
                      <span className="icon-wrapper"><LockIcon /></span>
                      <input type="password" name="confirm" placeholder="Confirm password" value={formData.confirm} onChange={handleUserChange} />
                    </div>
                  </div>
                </>
              )}

              {error && <p className="error">{error}</p>}

              <button className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : isRegister ? "Register" : "Send OTP"}
              </button>
            </form>

          ) : (

            <div className="vendor-inline-wizard" style={{ marginTop: "20px" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                {['Basic Info', 'Location', 'Documents', 'Bank Details'].map((stepName, idx) => (
                  <span key={idx} style={{ fontSize: "12px", fontWeight: "bold", color: currentStep >= idx + 1 ? "#11998e" : "#aaa" }}>
                    {currentStep > idx + 1 ? "✓ " : `${idx + 1}. `} {stepName}
                  </span>
                ))}
              </div>

              <div style={{ minHeight: "320px" }}>
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

        {/* 3. RIGHT SIDE (IMAGE) - Ab humesha dikhegi */}
        <div className="auth-image" style={role === "vendor" && isRegister ? { flex: "1 1 45%", maxWidth: "45%" } : {}}>
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