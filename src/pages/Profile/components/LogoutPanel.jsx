import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutApi } from "../../../utils/authApi";

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
    <div className="p-8 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] max-w-lg">
      <h2 className="text-[28px] font-black text-[var(--text-main)] mb-2">Sign Out</h2>
      <p className="text-[14px] text-[var(--text-muted)] font-medium mb-8">
        Are you sure you want to log out of your account? You will need to enter your credentials to access your profile again.
      </p>
      <button 
        className={`w-full sm:w-auto px-8 py-3.5 rounded-[var(--radius-pill)] font-black uppercase tracking-widest text-sm transition-all shadow-[var(--shadow-md)] bg-[var(--danger)] text-[var(--secondary)] hover:scale-105 ${isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handleLogout} 
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Yes, Logout"}
      </button>
    </div>
  );
}

export default LogoutPanel;