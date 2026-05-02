import React from 'react';

function Wallet() {
  return (
    <div className="flex flex-col min-h-[500px] w-full p-6 md:p-10 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
      
      <div className="mb-8 pb-4 border-b border-[var(--border)]">
        <h2 className="text-[24px] font-black text-[var(--text-main)]">My Wallet</h2>
        <p className="text-[13px] text-[var(--text-muted)] font-medium mt-1">Track your balance and transaction history.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-[#005f73] to-[#14b8a6] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] mb-8 text-white shrink-0">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <p className="text-[13px] font-bold opacity-90 uppercase tracking-widest mb-1">Available Balance</p>
          <h3 className="text-[32px] font-black tracking-tight text-white">₹1,250.00</h3>
        </div>
        <button className="px-8 py-3 bg-white text-[#005f73] font-black uppercase tracking-widest text-[12px] rounded-[var(--radius-pill)] shadow-sm hover:scale-105 transition-transform active:scale-95">
          Add Money
        </button>
      </div>
      
      <div className="flex flex-col flex-1 min-h-0">
        <h4 className="text-[18px] font-bold text-[var(--text-main)] mb-4">Recent Transactions</h4>
        
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[250px] scrollbar-thin scrollbar-thumb-[var(--border)]">
          
          <div className="flex items-center justify-between p-4 bg-[var(--bg-soft)] rounded-[var(--radius-md)] border border-transparent hover:border-[var(--border)] transition-colors shrink-0">
            <div>
              <strong className="text-[15px] font-bold text-[var(--text-main)]">Added to Wallet</strong>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">12 Feb 2026, 10:30 AM</p>
            </div>
            <span className="text-[16px] font-black text-[var(--success)] tracking-wider">+ ₹500</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-[var(--bg-soft)] rounded-[var(--radius-md)] border border-transparent hover:border-[var(--border)] transition-colors shrink-0">
            <div>
              <strong className="text-[15px] font-bold text-[var(--text-main)]">Order #ORD1024</strong>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">10 Feb 2026, 04:15 PM</p>
            </div>
            <span className="text-[16px] font-black text-[var(--danger)] tracking-wider">- ₹850</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-[var(--bg-soft)] rounded-[var(--radius-md)] border border-transparent hover:border-[var(--border)] transition-colors shrink-0">
            <div>
              <strong className="text-[15px] font-bold text-[var(--text-main)]">Refund Received</strong>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">08 Feb 2026, 11:20 AM</p>
            </div>
            <span className="text-[16px] font-black text-[var(--success)] tracking-wider">+ ₹1,200</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Wallet;