import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getOrderDetails } from "../../utils/orderApi";

const OrderDetails = () => {
  const { id: maskedKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const itemId = queryParams.get("item_id");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getOrderDetails(maskedKey, itemId);
        if (res && res.success) {
          setOrder(res.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (maskedKey) fetchDetails();
    window.scrollTo(0, 0);
  }, [maskedKey, itemId, navigate]);

  const getDisplayStatus = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed" || s === "pending") return "Order Under Processing";
    return status;
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending") || s.includes("placed") || s.includes("confirmed")) return "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]";
    if (s.includes("shipped")) return "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]";
    if (s.includes("delivered")) return "bg-[#ecfdf5] text-[#059669] border-[#d1fae5]";
    if (s.includes("cancelled") || s.includes("returned")) return "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]";
    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-slate-400">Loading Details...</p>
      </div>
    );
  }

  if (!order) return <div className="text-center mt-20 text-white font-bold">Order not found.</div>;

  const mainStatus = order.order_status?.toLowerCase();
  const showCancelBtn = ["pending", "confirmed", "placed", "shipped"].includes(mainStatus);
  const showReturnBtn = mainStatus === "delivered";

  return (
    <div className="pt-[40px] pb-[100px] px-5 min-h-screen w-full max-w-[1350px] mx-auto animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-10 px-2">
        <button onClick={() => navigate(-1)} className="text-slate-300 hover:text-white flex items-center gap-2 mb-4 font-bold transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <h1 className="text-[32px] font-black text-white tracking-tight">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Items & Tracking */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 md:p-10">
            <h2 className="text-[20px] font-black text-slate-900 mb-10 uppercase tracking-tight">Ordered Item</h2>
            
            {order.items?.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-36 h-36 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center p-4 shrink-0 shadow-inner">
                  <img src={item.product_image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-[20px] md:text-[22px] font-black text-slate-900 leading-tight mb-1">{item.name}</h3>
                  <p className="text-[15px] font-bold text-slate-400 uppercase tracking-wide mb-4">{item.vendor_name}</p>
                  
                  {/* 🔥 Order ID Moved Here (Below Item Details) */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 w-fit mb-6">
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-[15px] font-black text-[var(--primary)]">#{order.order_number?.replace('ORD-', '') || maskedKey}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-400 uppercase">Price</span>
                      <span className="text-[20px] font-black text-slate-900">₹{Number(item.offer_price).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-400 uppercase">Status</span>
                      <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border mt-1 ${getStatusStyle(item.item_status || order.order_status)}`}>
                        {getDisplayStatus(item.item_status || order.order_status)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-400 uppercase">Qty</span>
                      <span className="text-[18px] font-black text-slate-800">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tracking Status */}
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h2 className="text-[18px] font-black text-slate-900 mb-10">Order Journey</h2>
              <div className="flex items-start w-full overflow-x-auto pb-6 scrollbar-hide">
                {order.items?.[0]?.tracking_status?.map((track, idx, arr) => (
                  <div key={idx} className="relative flex flex-col items-center flex-1 min-w-[140px]">
                    {idx !== arr.length - 1 && (
                      <div className={`absolute top-[13px] left-[50%] w-full h-[3px] ${arr[idx + 1]?.is_completed ? 'bg-emerald-400' : 'bg-slate-100'}`}></div>
                    )}
                    <div className={`relative z-10 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow-md ${track.is_completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {track.is_completed && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <div className="text-center mt-5 px-2">
                      <h4 className={`text-[12px] font-black uppercase ${track.is_completed ? 'text-slate-800' : 'text-slate-400'}`}>{track.label}</h4>
                      {track.date && <p className="text-[11px] font-bold text-slate-400 mt-1">{track.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 🔥 Unified White Box Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight mb-8 border-b pb-4">Order Summary</h3>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Order Status</span>
                <span className="text-[14px] font-black text-slate-800">{getDisplayStatus(order.order_status)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Payment</span>
                <span className="text-[14px] font-black text-slate-800 uppercase">{order.payment_method} ({order.payment_status})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Created On</span>
                <span className="text-[14px] font-black text-slate-800">{order.created_at}</span>
              </div>
              <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-[16px] font-black text-slate-900">Total Amount</span>
                <span className="text-[26px] font-black text-[var(--primary)]">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Delivery Address Section inside the same box */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
              <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Address</h4>
              <p className="text-[14px] font-bold text-slate-600 leading-relaxed italic">
                {order.full_address}
              </p>
            </div>

            {/* Action Buttons inside the same box */}
            <div className="flex flex-col gap-3">
              {showCancelBtn && (
                <button className="w-full py-4 bg-rose-50 text-rose-500 border border-rose-100 font-black text-[13px] uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm">
                  Cancel Order
                </button>
              )}
              {showReturnBtn && (
                <button className="w-full py-4 bg-slate-900 text-white font-black text-[13px] uppercase tracking-widest rounded-2xl shadow-lg hover:opacity-90 transition-all active:scale-95">
                  Return Request
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;