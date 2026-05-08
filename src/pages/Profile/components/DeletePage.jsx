import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../../utils/profileApi"; 

function DeletePage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deleting your account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone."
    );

    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const response = await deleteAccount(deleteReason);
        
        if (response?.success) {
          alert("Your account has been successfully deleted.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Failed to delete account. Please try again.");
        }
      } catch (error) {
        alert("An error occurred. Please try again later.",error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="w-full pt-10">
      <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-red-100 w-full max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          <div className="flex-1">
            <div className="bg-red-50 text-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Delete Account</h2>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
              Deleting your account is permanent. This action will immediately remove all your personal data, order history, saved addresses, and active subscriptions.
            </p>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <p className="text-[13px] text-red-800 font-medium">Please note: You will not be able to reactivate this account or recover any data once deleted.</p>
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-[16px]">Confirm Deletion</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">Why are you leaving? (Required)</label>
                <textarea 
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Please let us know how we can improve..."
                  rows="4"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-[14px] text-slate-700 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none bg-white"
                ></textarea>
              </div>

              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deleteReason.trim()}
                className="w-full px-6 py-3.5 rounded-xl text-[15px] font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isDeleting ? "Processing..." : "Permanently Delete Account"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DeletePage;