import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./VendorRegister.css";

function VendorRegister() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      navigate("/register");
    }
  }, [user, navigate]);

  const completeRegistration = () => {
    login({
      ...user,
      vendorBusiness: businessName,
      vendorProfileCompleted: true
    });

    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h2>Vendor Onboarding</h2>

        <div className="form-group">
          <label>Business Name</label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={completeRegistration}>
          Complete Registration
        </button>
      </div>
    </div>
  );
}

export default VendorRegister;