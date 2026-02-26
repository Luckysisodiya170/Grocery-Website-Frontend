import React, { useMemo } from "react";
import { useOrders } from "./OrdersContext";
import "./orderHistory.css";

const ACTIVE_STATUSES = ["Placed", "Shipped", "Out for Delivery"];
const HISTORY_STATUSES = ["Delivered", "Cancelled"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const formatStatusClass = (status) =>
  `status-pill status-${status.toLowerCase().replace(/\s+/g, "-")}`;

const OrderHistory = () => {
  const { orders = [], loading } = useOrders();

  const { activeOrders, historyOrders } = useMemo(() => {
    const active = [];
    const history = [];

    orders.forEach((order) => {
      if (ACTIVE_STATUSES.includes(order.status)) {
        active.push(order);
      } else if (HISTORY_STATUSES.includes(order.status)) {
        history.push(order);
      }
    });

    return { activeOrders: active, historyOrders: history };
  }, [orders]);

  if (loading) {
    return (
      <div className="orders-page container">
        <p>Loading orders...</p>
      </div>
    );
  }

  const renderOrderCard = (order) => {
    const { id, createdAt, status, items = [], total } = order;

    return (
      <div className="order-card" key={id}>
        <div className="order-top">
          <div>
            <span className="order-id">#{id}</span>
            <span className="order-date">
              {new Date(createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
          <span className={formatStatusClass(status)}>
            {status}
          </span>
        </div>

        <div className="order-item-images">
          {items.map((item) => (
            <div key={item.id || item.name} className="product-img-wrapper">
              <img
                src={`/product/${item.image}`}
                alt={item.name}
                title={item.name}
                className="product-thumbnail"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="order-items-names">
          {items.map((item) => item.name).join(" • ")}
        </div>

        <div className="order-bottom">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="orders-page container">
      <h1 className="page-main-title">
        My <span className="text-gradient">Orders</span>
      </h1>

      <div className="orders-grid">
        <div className="orders-column">
          <h2 className="column-title">Active Orders</h2>
          {activeOrders.length === 0 ? (
            <p className="empty-text">No active orders.</p>
          ) : (
            activeOrders.map(renderOrderCard)
          )}
        </div>

        <div className="orders-column">
          <h2 className="column-title">Order History</h2>
          {historyOrders.length === 0 ? (
            <p className="empty-text">No past orders.</p>
          ) : (
            historyOrders.map(renderOrderCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;