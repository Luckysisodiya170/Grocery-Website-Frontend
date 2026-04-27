// src/pages/Auth/LoginRegister.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import deliveryImg from "../../../assets/deliveryimage.jpg";

// Components
import InputComponent from "../../../components/common/InputComponent";
import ButtonComponent from "../../../components/common/ButtonComponent";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

// Vendor Steps
import BasicInfo from "../vendor/steps/BasicInfo";
import Location from "../vendor/steps/Location";
import BusinessIds from "../vendor/steps/BusinessIds";
import BankDetails from "../vendor/steps/BankDetails";

function LoginRegister() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isRegister = useMemo(() => location.pathname === "/register", [location.pathname]);

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "", mobile: "", email: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [vendorData, setVendorData] = useState({
    businessName: "", businessCategory: [], ownerName: "", email: "", password: "", 
    contactNumber: "", emergencyContact: "", address: "", city: "", state: "", 
    country: "India", pincode: "", geoLocation: "", tradeLicense: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: ""
  });

  const handleInputChange = (e) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMobileChange = (value) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, mobile: false }));
    setFormData((prev) => ({ ...prev, mobile: value }));
  };

  const triggerError = (field, message) => {
    setFieldErrors({ [field]: message });
    setError(message);
  };

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault(); 
    if (!formData.mobile || formData.mobile.length < 10) return triggerError("mobile", "Enter a valid mobile number");
    if (isRegister && !formData.name.trim()) return triggerError("name", "Enter your full name");

    setLoading(true);
    try {
      const payload = {
        country_code: "+91",
        mobile: formData.mobile.slice(-10),
        device_id: "web_device_123",
        player_id: "web_player_123",
        device_type: "web",
      };

      if (isRegister) {
        payload.name = formData.name;
        if (formData.email) payload.email = formData.email;
      }

      const response = await axios.post("http://13.203.29.79:9000/api/v1/customers/request-otp", payload);
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-otp", { 
          state: { 
            phone: formData.mobile, 
            token: response.data.data.token, 
            purpose: isRegister ? "signup" : "login" 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleVendorSubmit = () => {
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
      setRole("user");
    }, 1000);
  };

  // Helper function for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRequestOtp(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gradient-to-br from-slate-50 to-indigo-50">
      
      <div className={`w-full flex flex-col rounded-2xl bg-cardBg shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-borderMain overflow-hidden animate-fade-in transition-all duration-300 ${isRegister && role === "vendor" ? "max-w-[1000px]" : "max-w-[850px]"}`}>

        <div className="w-full pt-8 pb-2 px-6 text-center z-20">
          <h2 className="text-[22px] md:text-[26px] font-black mb-0.5 text-transparent bg-clip-text bg-brand-gradient tracking-tight">
            Lightning Fast Delivery
          </h2>
          <p className="text-[12px] md:text-[13px] font-bold text-textMuted">
            Experience the best service in your city.
          </p>
        </div>

        <div className="flex flex-col md:flex-row w-full relative">
          
          <div className={`px-8 pb-10 pt-4 md:px-10 flex flex-col justify-start items-center transition-all duration-300 ${isRegister && role === "vendor" ? "w-full md:w-[60%]" : "w-full md:w-[50%]"}`}>

            <div className={`w-full ${isRegister && role === "vendor" ? "max-w-[500px]" : "max-w-[350px]"}`}>
              
              <h2 className="text-2xl font-bold text-textMain mb-1 text-center md:text-left">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-textMuted mb-6 text-center md:text-left">
                {isRegister ? "Join our community today" : "Login with your mobile number"}
              </p>

              {isRegister && (
                <div className="flex bg-bgSoft rounded-xl p-1 mb-6 border-1.5 border-borderMain">
                  <button type="button" onClick={() => setRole("user")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "user" ? "bg-brand-gradient text-white shadow-sm" : "text-textMuted hover:text-textMain"}`}>User</button>
                  <button type="button" onClick={() => setRole("vendor")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "vendor" ? "bg-brand-gradient text-white shadow-sm" : "text-textMuted hover:text-textMain"}`}>Vendor</button>
                </div>
              )}

              {role === "user" || !isRegister ? (
            
                <form onSubmit={handleRequestOtp} onKeyDown={handleKeyDown}>
                  {isRegister && <InputComponent icon={PersonIcon} label="Full Name" name="name" value={formData.name} onChange={handleInputChange} error={fieldErrors.name} />}

                  <div className="flex flex-col gap-1 mb-3 relative z-50">
                    <label className="text-xs font-semibold text-textLight">Mobile Number</label>
                    <PhoneInput
                      country="in" value={formData.mobile} onChange={handleMobileChange}
                 
                      onKeyDown={handleKeyDown}
                      inputClass={`!w-full !h-12 !pl-[55px] !rounded-md !border-1.5 !bg-bgSoft !text-sm transition-all focus:!border-primary focus:!bg-white focus:!ring-2 focus:!ring-teal-50 ${fieldErrors.mobile ? "!border-danger !bg-red-50" : "!border-borderMain"}`}
                      buttonClass="!border-none !bg-transparent !border-r !border-borderMain !rounded-l-md"
                    />
                    {fieldErrors.mobile && <span className="text-[11px] text-danger font-semibold px-1">{fieldErrors.mobile}</span>}
                  </div>

                  {isRegister && <InputComponent icon={EmailIcon} label="Email Address (Optional)" name="email" type="email" value={formData.email} onChange={handleInputChange} error={fieldErrors.email} />}

                  {error && <p className="text-[12px] text-danger font-semibold text-center mb-2 animate-pulse">{error}</p>}

                  <ButtonComponent type="submit" text={isRegister ? "Send OTP" : "Send OTP"} loading={loading} />
                </form>
              ) 
              
              : (
                <div className="mt-2">
                  <div className="flex justify-between mb-6 border-b-2 border-slate-100 pb-3">
                    {["Basic Info", "Location", "Documents", "Bank Details"].map((stepName, idx) => (
                      <span key={idx} className={`text-xs font-bold transition-colors ${currentStep >= idx + 1 ? "text-teal-600" : "text-slate-400"}`}>
                        {currentStep > idx + 1 ? "✓ " : `${idx + 1}. `} {stepName}
                      </span>
                    ))}
                  </div>

                  <div className="min-h-[280px]">
                    {currentStep === 1 && <BasicInfo vendorData={vendorData} handleChange={handleVendorChange} />}
                    {currentStep === 2 && <Location vendorData={vendorData} handleChange={handleVendorChange} />}
                    {currentStep === 3 && <BusinessIds vendorData={vendorData} handleChange={handleVendorChange} />}
                    {currentStep === 4 && <BankDetails vendorData={vendorData} handleChange={handleVendorChange} />}
                  </div>

                  {error && <p className="text-[12px] text-danger font-semibold mb-2 animate-pulse">{error}</p>}

                  <div className="flex gap-4 mt-5">
                    {currentStep > 1 && (
                      <button type="button" className="flex-[0.5] h-11 rounded-md bg-slate-200 text-slate-700 text-sm font-bold transition-all hover:bg-slate-300" onClick={() => { setError(""); setCurrentStep((prev) => prev - 1); }}>Previous</button>
                    )}

                    {currentStep < 4 ? (
                      <button type="button" className="flex-1 h-11 rounded-md bg-brand-gradient text-white text-sm font-bold transition-all hover:-translate-y-[1px] hover:shadow-float hover:brightness-105" onClick={() => {
                          if (currentStep === 1 && (!vendorData.businessName || !vendorData.ownerName)) return setError("Please fill required fields.");
                          setError("");
                          setCurrentStep((prev) => prev + 1);
                        }}>Next Step</button>
                    ) : (
                      <button type="button" className="flex-1 h-11 rounded-md bg-brand-gradient text-white text-sm font-bold transition-all hover:-translate-y-[1px] hover:shadow-float hover:brightness-105" onClick={handleVendorSubmit} disabled={loading}>{loading ? "Processing..." : "Register as Vendor"}</button>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs text-center text-textMuted">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <Link to={isRegister ? "/login" : "/register"} className="text-primary font-semibold ml-1 hover:underline" onClick={() => setRole("user")}>
                  {isRegister ? "Login" : "Register"}
                </Link>
              </p>

            </div>
          </div>

          <div className={`hidden md:flex relative overflow-hidden items-center justify-center transition-all duration-300 ${isRegister && role === "vendor" ? "w-[40%]" : "w-[50%]"}`}>
            <img src={deliveryImg} alt="Delivery" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/15 z-10"></div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default LoginRegister;