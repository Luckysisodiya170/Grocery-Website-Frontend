import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutPanel({ onCancel }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-center items-start pt-10">
      <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center w-full max-w-2xl">
        <div className="bg-amber-100 text-amber-600 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ready to leave?</h2>
        <p className="text-slate-500 text-[16px] leading-relaxed mb-8 max-w-md">
          You are about to log out of your account. You will need to enter your credentials again the next time you want to access Shipzzy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={onCancel}
            className="px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button 
            onClick={handleLogoutClick}
            className="px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors w-full sm:w-auto shadow-sm"
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPanel;