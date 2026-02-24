import React from "react";
import { useOrders } from "./OrdersContext";
import "./orderHistory.css";

const OrderHistory = () => {
  const { orders } = useOrders();

  const activeOrders = orders.filter(
    (order) =>
      order.status === "Placed" ||
      order.status === "Shipped" ||
      order.status === "Out for Delivery"
  );

  const historyOrders = orders.filter(
    (order) =>
      order.status === "Delivered" ||
      order.status === "Cancelled"
  );

  const renderOrderCard = (order) => (
    <div className="order-card" key={order.id}>
      <div className="order-top">
        <div>
          <span className="order-id">#{order.id}</span>
          <span className="order-date">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        <span className={`status-pill ${order.status.toLowerCase().replace(/\s/g, "-")}`}>
          {order.status}
        </span>
      </div>

      <div className="order-items">
        {order.items.map((item) => item.name).join(" • ")}
      </div>

      <div className="order-bottom">
        <span>Total</span>
        <strong>₹{order.total}</strong>
      </div>
    </div>
  );

  return (
    <div className="orders-page container">
      <h1 className="page-main-title">
        My <span className="text-gradient">Orders</span>
      </h1>

      <div className="orders-grid">

        {/* LEFT COLUMN */}
        <div className="orders-column">
          <h2 className="column-title">My Orders</h2>
          {activeOrders.length === 0 ? (
            <p className="empty-text">No active orders.</p>
          ) : (
            activeOrders.map(renderOrderCard)
          )}
        </div>

        {/* RIGHT COLUMN */}
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