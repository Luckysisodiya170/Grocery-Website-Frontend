import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutApi } from "../../../utils/authApi"; // Path apne hisab se check kar lena

function LogoutPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const refreshToken = localStorage.getItem("refreshToken"); 
      
      if (refreshToken) {
        await logoutApi(refreshToken, true);
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      logout(); 
      toast.info("You have been logged out.");
      navigate("/login");
    }
  };

  return (
    <div className="logout-panel">
      <h2 className="section-title">Sign Out</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
        Are you sure you want to log out of your account? You will need to enter your credentials to access your profile again.
      </p>
      <button 
        className="primary-btn logout-btn" 
        onClick={handleLogout} 
        disabled={isLoggingOut}
        style={{ 
          background: "var(--danger)", 
          opacity: isLoggingOut ? 0.7 : 1,
          cursor: isLoggingOut ? "not-allowed" : "pointer"
        }}
      >
        {isLoggingOut ? "Logging out..." : "Yes, Logout"}
      </button>
    </div>
  );
}

export default LogoutPanel;