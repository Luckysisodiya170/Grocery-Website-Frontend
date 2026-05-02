import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { getOrdersHistory } from "../../utils/orderApi";
import { encodeId } from "../../utils/crypto";

const OrderHistory = () => {
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const observer = useRef();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    setOrders([]);
    setPage(1);
    setHasNextPage(false);
  }, [activeTab]);

  const lastOrderElementRef = useCallback(node => {
    if (loading || fetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingRef.current) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, fetchingMore, hasNextPage]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (page === 1) setLoading(true);
        else setFetchingMore(true);

        isFetchingRef.current = true;
        const res = await getOrdersHistory(page, 10);
        
        if (res && res.success) {
          const newOrders = res.data.orders || [];
          setOrders(prev => (page === 1 ? newOrders : [...prev, ...newOrders]));
          setHasNextPage(res.data.pagination.hasNextPage);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
        setFetchingMore(false);
        isFetchingRef.current = false;
      }
    };
    fetchOrders();
  }, [page, activeTab]);

  const filteredOrders = orders.filter((order) => {
    const isHistory = ["Delivered", "Cancelled", "Returned"].includes(order.order_status);
    return activeTab === "active" ? !isHistory : isHistory;
  });

  const getDisplayStatus = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "confirmed" || s === "pending") return "Order Under Processing";
    return status;
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending") || s.includes("placed") || s.includes("confirmed")) return "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]";
    if (s.includes("shipped")) return "bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]";
    if (s.includes("delivered")) return "bg-[#f0fdf4] text-[#15803d] border-[#dcfce7]";
    if (s.includes("cancelled") || s.includes("returned")) return "bg-[#fef2f2] text-[#b91c1c] border-[#fee2e2]";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const renderOrderBox = (order, index, isLast) => {
    const maskedKey = encodeId(order.id);
    const orderStatus = order.order_status?.toLowerCase();
    
    const canCancel = ["pending", "confirmed", "placed", "shipped"].includes(orderStatus);
    const canReturn = orderStatus === "delivered";

    return (
      <div
        key={order.id}
        ref={isLast ? lastOrderElementRef : null}
        className="bg-white rounded-[24px] mb-8 border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4"
      >
        {/* Order Header */}
        <div className="bg-slate-50/80 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
            <h3 className="text-[16px] font-black text-slate-900">#{order.order_number?.replace('ORD-', '')}</h3>
          </div>
          <div className="flex flex-col md:items-center">
            <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Placed On</span>
            <p className="text-[14px] font-bold text-slate-700">{order.created_at}</p>
          </div>
          <div className="flex flex-col md:items-end">
             <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusStyle(order.order_status)}`}>
                {getDisplayStatus(order.order_status)}
             </span>
          </div>
        </div>

        {/* Items List within the Order */}
        <div className="p-6 flex flex-col gap-6">
          {order.items?.map((item, idx) => (
            <div 
              key={item.item_id} 
              onClick={() => navigate(`/orders/${maskedKey}?item_id=${item.item_id}`)}
              className="flex items-center gap-6 group cursor-pointer"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                <img src={item.image} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex flex-col">
                  <h4 className="text-[15px] font-black text-slate-800 group-hover:text-[var(--primary)] transition-colors">{item.product_name}</h4>
                  <p className="text-[12px] font-bold text-slate-400 uppercase">{item.vendor_name}</p>
                  <p className="text-[13px] font-black text-slate-700 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col md:items-end">
                   <p className="text-[12px] font-black text-slate-400 uppercase">Price</p>
                   <p className="text-[17px] font-black text-slate-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Footer: Summary & Actions */}
        <div className="bg-slate-50/30 px-6 py-5 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Total Amount:</span>
            <span className="text-[22px] font-black text-[var(--primary)]">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             {canCancel && (
               <button className="flex-1 md:flex-none px-8 py-3 border-2 border-rose-100 text-rose-500 font-black text-[12px] uppercase tracking-widest rounded-full hover:bg-rose-50 transition-all active:scale-95">
                 Cancel Order
               </button>
             )}
             {canReturn && (
               <button className="flex-1 md:flex-none px-8 py-3 bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest rounded-full hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-slate-200">
                 Request Return
               </button>
             )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && page === 1) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black uppercase tracking-widest text-slate-400">Loading Orders...</p>
    </div>
  );

  return (
    <div className="pt-[40px] pb-[100px] px-5 min-h-screen">
      <div className="text-center mb-[40px]">
        <h1 className="text-[36px] font-black text-white">My Orders</h1>
        <p className="text-slate-400 font-bold mt-2">Manage your purchases and track shipments</p>
      </div>

      <div className="w-full max-w-[1000px] mx-auto">
        {/* Modern Premium Tabs */}
        <div className="flex p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-12 w-full max-w-[450px] mx-auto">
          <button 
            onClick={() => setActiveTab("active")} 
            className={`flex-1 py-3 px-6 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "active" ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"}`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab("history")} 
            className={`flex-1 py-3 px-6 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "history" ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"}`}
          >
            History
          </button>
        </div>

        <div className="flex flex-col">
          {filteredOrders.length === 0 ? (
            <div className="p-20 text-center bg-white/5 rounded-[40px] border border-dashed border-white/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white/40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">No Orders Yet</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => renderOrderBox(order, index, index === filteredOrders.length - 1))
          )}
        </div>

        {fetchingMore && (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;