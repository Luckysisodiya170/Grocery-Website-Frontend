import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteAccount } from "../../../utils/profileApi"; 

function DeletePage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) return toast.error("Reason is required!");
    const confirmDelete = window.confirm("Final Warning: This will erase everything!");
    if (confirmDelete) {
      try {
        setIsDeleting(true);
        const response = await deleteAccount(deleteReason);
        if (response?.success) {
          toast.success("Account Deleted");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) { toast.error("Error occurred"); }
      finally { setIsDeleting(false); }
    }
  };

  return (
    <div className="h-[414px] w-full p-8 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-red-100 shadow-[var(--shadow-sm)] flex flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>

      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 shrink-0">
        <div className="bg-red-50 text-red-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
          </svg>
        </div>
        <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Account Deletion</h2>
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Permanent Action Required</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <div>
                <h4 className="text-[13px] font-black text-slate-700 uppercase tracking-tighter mb-3">What happens when you delete?</h4>
                <ul className="space-y-3">
                    {["Loss of all order history", "Saved addresses will be wiped", "Wallet balance will be forfeited", "Loyalty points will expire"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-50">
              <p className="text-[11px] text-red-600 font-bold leading-relaxed">
                You will not be able to recover your account or any associated data once this process is complete.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reason for Leaving</label>
              <textarea 
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="We're sorry to see you go. Help us improve..."
                className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-red-200 focus:bg-white transition-all resize-none h-28"
              ></textarea>
            </div>

            <button 
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deleteReason.trim()}
              className="w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? "Processing Deletion..." : "Confirm & Erase Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePage;