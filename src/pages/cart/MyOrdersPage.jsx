import React, { useEffect } from "react";
import { useOrders } from "../../context/OrdersContext";
import "./myOrders.css";

const MyOrdersPage = () => {
  const { orders, updateOrders } = useOrders();

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = orders.map((order) => {
        const diff =
          (new Date() - new Date(order.createdAt)) / 1000;

        if (diff > 120 && order.status === "Placed") {
          return { ...order, status: "Shipped" };
        }

        if (diff > 240 && order.status === "Shipped") {
          return { ...order, status: "Delivered" };
        }

        return order;
      });

      updateOrders(updated);
    }, 5000);

    return () => clearInterval(interval);
  }, [orders, updateOrders]);

  return (
    <div className="orders-container">
     <h1 style={{ fontSize: "45px", color: "white" }}>My Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Order #{order.id}</h3>
          <p>Status: <strong>{order.status}</strong></p>
          <p>Total: ₹{order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;

