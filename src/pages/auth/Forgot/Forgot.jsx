import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot.css";
import bg from "../../../assets/deliveryimage.jpg";

function Forgot() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter valid 10 digit phone number");
      return;
    }

    setError("");

    // send user to OTP page with type reset
    navigate("/verify-otp", {
      state: { type: "reset" }
    });
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">

        {/* IMAGE */}
        <div className="forgot-visual">
          <img src={bg} alt="delivery" />
        </div>

        {/* CONTENT */}
        <div className="forgot-content">
          <h2>Forgot Password</h2>

          <p className="forgot-sub">
            Enter your registered phone number
          </p>

          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {error && <p className="forgot-error">{error}</p>}

            <button className="forgot-btn">
              Send OTP
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Forgot;
