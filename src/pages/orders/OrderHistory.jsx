import React, { useState, useEffect, useRef, useCallback } from "react";
import { getOrdersHistory } from "../../utils/orderApi";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  const observer = useRef();
  const isFetchingRef = useRef(false);

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
    const fetchInitialOrders = async () => {
      try {
        setLoading(true);
        setPage(1);
        const res = await getOrdersHistory(1, 10);
        if (res && res.success) {
          setOrders(res.data.orders || []);
          setHasNextPage(res.data.pagination.hasNextPage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialOrders();
  }, []);

  useEffect(() => {
    if (page === 1) return;

    const fetchMoreOrders = async () => {
      isFetchingRef.current = true;
      setFetchingMore(true);
      try {
        const res = await getOrdersHistory(page, 10);
        if (res && res.success) {
          const newBatch = res.data.orders || [];
          setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const uniqueNew = newBatch.filter(o => !existingIds.has(o.id));
            return [...prev, ...uniqueNew];
          });
          setHasNextPage(res.data.pagination.hasNextPage);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          isFetchingRef.current = false;
          setFetchingMore(false);
        }, 500);
      }
    };
    fetchMoreOrders();
  }, [page]);

  const activeOrders = orders.filter((o) =>
    !["Delivered", "Cancelled", "Returned"].includes(o.order_status)
  );

  const historyOrders = orders.filter((o) =>
    ["Delivered", "Cancelled", "Returned"].includes(o.order_status)
  );

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pending") || s.includes("placed")) return "bg-[#fffbeb] text-[#d97706]";
    if (s.includes("shipped")) return "bg-[#eff6ff] text-[#2563eb]";
    if (s.includes("out for delivery")) return "bg-[#f5f3ff] text-[#7c3aed]";
    if (s.includes("delivered")) return "bg-[#ecfdf5] text-[#059669]";
    if (s.includes("cancelled") || s.includes("returned")) return "bg-[#fef2f2] text-[#dc2626]";
    return "bg-slate-100 text-slate-600";
  };

  const renderCleanRow = (order) => {
    const items = order.items || [];
    const firstItem = items[0];
    const extraItemsCount = items.length - 1;
    const itemsText = extraItemsCount > 0
      ? `${firstItem?.product_name} & ${extraItemsCount} more item${extraItemsCount > 1 ? 's' : ''}`
      : firstItem?.product_name;

    return (
      <div
        key={order.id}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_2.5fr_1fr_1fr] gap-y-4 items-center px-6 py-5 border-b border-slate-50 hover:bg-[#fdfdfd] transition-colors last:border-b-0"
      >
        <div className="flex flex-col gap-1 sm:justify-start">
          <span className="text-[15px] font-extrabold text-slate-900">
            #{order.order_number.replace('ORD-', '')}
          </span>
          <span className="text-[13px] text-slate-500 font-medium">
            {order.created_at}
          </span>
        </div>

        <div className="flex items-center gap-[15px] col-span-1 sm:col-span-2 lg:col-span-1 order-first lg:order-none overflow-hidden">
          <div className="w-12 h-12 bg-slate-50 rounded-[10px] border border-slate-100 flex items-center justify-center p-1 shrink-0">
            <img
              src={firstItem?.image || "https://via.placeholder.com/48?text=Img"}
              alt={firstItem?.product_name}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="text-[14px] text-slate-600 font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
            title={items.map(i => i.product_name).join(", ")}
          >
            {itemsText}
          </span>
        </div>

        <div className="flex sm:justify-end lg:justify-center">
          <span className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase ${getStatusStyle(order.order_status)}`}>
            {order.order_status}
          </span>
        </div>

        <div className="flex sm:justify-end lg:justify-end">
          <span className="text-[16px] font-extrabold text-slate-900">
            ₹{Number(order.total_amount).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-[60px] pb-[100px] px-5 min-h-screen">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-black text-white">My Orders</h1>
      </div>

      <div className="flex flex-col gap-[40px] max-w-[950px] mx-auto min-h-[60vh]">
        <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="flex items-center gap-[12px] p-[20px_24px] border-b border-slate-100 bg-white">
            <h2 className="text-[18px] font-extrabold text-slate-900 m-0">Active Orders</h2>
            <span className="bg-[#00f2fe] text-slate-900 px-2.5 py-0.5 rounded-[20px] text-[12px] font-extrabold">
              {activeOrders.length}
            </span>
          </div>

          <div className="flex flex-col bg-white">
            {activeOrders.length === 0 ? (
              <div className="p-[30px] text-center text-slate-400 text-[14px] font-medium">
                No active orders right now.
              </div>
            ) : (
              activeOrders.map(renderCleanRow)
            )}
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="flex items-center gap-[12px] p-[20px_24px] border-b border-slate-100 bg-white">
            <h2 className="text-[18px] font-extrabold text-slate-900 m-0">Order History</h2>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-[20px] text-[12px] font-extrabold">
              {historyOrders.length}
            </span>
          </div>

          <div className="flex flex-col bg-white">
            {historyOrders.length === 0 ? (
              <div className="p-[30px] text-center text-slate-400 text-[14px] font-medium">
                Your past orders will appear here.
              </div>
            ) : (
              historyOrders.map(renderCleanRow)
            )}
          </div>
        </div>

        <div ref={lastOrderElementRef} className="w-full flex flex-col justify-center items-center mt-6 min-h-[60px]">
          {fetchingMore && (
            <div className="w-8 h-8 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin mb-4"></div>
          )}
          {!hasNextPage && orders.length > 0 && (
            <div className="flex items-center gap-4 w-full justify-center">
              <span className="w-16 h-[1px] bg-white"></span>
              <p className="text-white text-[12px] font-black uppercase tracking-[0.2em] m-0">
                End of history
              </p>
              <span className="w-16 h-[1px] bg-white"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;