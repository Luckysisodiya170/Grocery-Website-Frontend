import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // 🔥 added
import "./verifyOtp.css";
import bg from "../../../assets/deliveryimage.jpg";

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // 🔥 added

  const phone = location.state?.mobile || location.state?.phone || "";
  const type = location.state?.type || "login";

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
    setError("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.join("") !== "1234") { // Mock OTP
      setError("Invalid code. Try 1234.");
      return;
    }

    // 🔥 OTP SUCCESS → STORE USER
    login({
      name: "Lakshya",   // Replace later with real backend data
      mobile: phone,
      token: "demo_token"
    });

    if (type === "reset") {
      navigate("/reset-password");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-visual">
          <img src={bg} alt="verification" />
        </div>

        <div className="otp-content">
          <h2 className="text-gradient">Verify OTP</h2>
          <p>Sent to +{phone}</p>

          <form onSubmit={handleSubmit}>
            <div className="otp-box">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  maxLength={1}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {error && <p className="otp-error">{error}</p>}

            <button className="otp-btn" type="submit">
              Verify & Proceed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;