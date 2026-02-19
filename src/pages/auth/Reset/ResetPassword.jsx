import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./resetPassword.css";
import bg from "../../../assets/deliveryimage.jpg";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be 6+ characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    alert("Password reset successful");
    navigate("/login");
  };

  return (
    <div className="reset-page">
      <div className="reset-container">

        <div className="reset-visual">
          <img src={bg} alt="delivery" />
        </div>

        <div className="reset-content">
          <h2>Reset Password</h2>

          <form className="reset-form" onSubmit={handleSubmit}>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
            />

            {error && <p className="reset-error">{error}</p>}

            <button className="reset-btn">
              Reset Password
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
