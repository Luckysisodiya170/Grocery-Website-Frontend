import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./verifyOtp.css";
import bg from "../../../assets/deliveryimage.jpg";

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const type = location.state?.type; // reset or login

  // handle typing
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

  // backspace previous
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.join("") !== "1234") {
      setError("Invalid OTP (use 1234)");
      return;
    }

    // redirect based on use
    if (type === "reset") {
      navigate("/reset-password");
    } else if (type === "login") {
      navigate("/");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">

        <div className="otp-visual">
          <img src={bg} alt="delivery" />
        </div>

        <div className="otp-content">
          <h2>Verify OTP</h2>

          <p>Enter the 4-digit code</p>

          <form onSubmit={handleSubmit}>

            <div className="otp-box">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  value={digit}
                  maxLength={1}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                />
              ))}
            </div>

            {error && <p className="otp-error">{error}</p>}

            <button className="otp-btn">
              Verify Code
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default VerifyOtp;
