import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./VendorRegister.css";

// Tere exact components import kar rahe hain
import BasicInfo from "./steps/BasicInfo";
import Location from "./steps/Location";
import BusinessIds from "./steps/BusinessIds";
import BankDetails from "./steps/BankDetails";

function VendorRegister() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

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

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const completeRegistration = () => {
    login({ ...user, vendorDetails: vendorData, vendorProfileCompleted: true });
    navigate("/"); // Redirect to home/dashboard
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
          {currentStep > 1 ? (
             <button className="secondary-btn" onClick={prevStep}>← Previous</button>
          ) : <div></div>}

          {currentStep < 4 ? (
            <button className="primary-btn" onClick={nextStep}>Next Step →</button>
          ) : (
            <button className="success-btn" onClick={completeRegistration}>Finish Registration ✓</button>
          )}
        </div>

      </div>
    </div>
  );
}

export default VendorRegister;