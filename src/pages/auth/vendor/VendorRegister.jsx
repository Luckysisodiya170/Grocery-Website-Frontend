import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // ✅ Toast import kiya
import "./VendorRegister.css";

// Tere exact components import kar rahe hain
import BasicInfo from "./steps/BasicInfo";
import Location from "./steps/Location";
import BusinessIds from "./steps/BusinessIds";
import BankDetails from "./steps/BankDetails";

function VendorRegister() {
  const { user } = useAuth(); // (Auto login hata diya kyunki ab direct login screen pe bhejenge)
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  
  // ✅ ADDED MISSING STATES FOR ERROR AND LOADING
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Master State Data - Saara data yahan aayega
  const [vendorData, setVendorData] = useState({
    businessName: "", businessCategory: "Restaurant", ownerName: "", email: "", password: "", contactNumber: "", emergencyContact: "",
    address: "", city: "", state: "", country: "India", pincode: "", geoLocation: "",
    tradeLicense: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: ""
  });

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      navigate("/register");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // ✅ VENDOR SUBMIT WITH VALIDATION & REDIRECT
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
      
      // Success Message
      toast.success("Vendor Registered Successfully! Please login.", {
        position: "top-center"
      });

      // 2. REDIRECT TO LOGIN (Without automatically logging in)
      navigate("/login");
      
    }, 1000);
  };

  if (!user) return null;

  // Render child component dynamically
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <BasicInfo vendorData={vendorData} handleChange={handleChange} />;
      case 2: return <Location vendorData={vendorData} handleChange={handleChange} />;
      case 3: return <BusinessIds vendorData={vendorData} handleChange={handleChange} />;
      case 4: return <BankDetails vendorData={vendorData} handleChange={handleChange} />;
      default: return <BasicInfo vendorData={vendorData} handleChange={handleChange} />;
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-card wizard-card">
        
        <div className="wizard-header">
          <div>
            <h2>Register New Vendor</h2>
            <p>Onboard a professional partner to the platform</p>
          </div>
          <button className="close-btn" onClick={() => navigate("/register")}>✕</button>
        </div>

        {/* Simple Stepper UI */}
        <div className="stepper-container">
          {['Basic Info', 'Location', 'Business IDs', 'Bank Details'].map((label, index) => (
            <div key={index} className={`step ${currentStep >= index + 1 ? "active" : ""}`}>
              <div className="step-icon">{currentStep > index + 1 ? "✓" : index + 1}</div>
              <p>{label}</p>
            </div>
          ))}
        </div>

        <div className="wizard-body">
          {renderStepContent()}
        </div>

        <div className="wizard-footer">
          {/* ✅ VENDOR ERROR DISPLAY */}
          {error && <p className="error" style={{ textAlign: "center", marginBottom: "15px", color: "var(--danger)", fontWeight: "600" }}>{error}</p>}

          {/* ✅ CLEANED UP BUTTONS (Removed Duplicates) */}
          <div style={{ display: "flex", gap: "15px", width: "100%" }}>
            {currentStep > 1 && (
              <button 
                type="button" 
                className="submit-btn" 
                style={{ background: "#e2e8f0", color: "#333", flex: 0.4 }} 
                onClick={() => { setError(""); setCurrentStep(prev => prev - 1); }}
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button 
                type="button" 
                className="submit-btn" 
                style={{ flex: 1, background: "var(--primary)" }} 
                onClick={() => { setError(""); setCurrentStep(prev => prev + 1); }}
              >
                Next Step
              </button>
            ) : (
              <button 
                type="button" 
                className="submit-btn" 
                style={{ flex: 1, background: "var(--success)" }} 
                onClick={handleVendorSubmit} 
                disabled={loading}
              >
                {loading ? "Processing..." : "Register as Vendor"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default VendorRegister;