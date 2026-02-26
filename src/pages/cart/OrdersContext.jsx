import React, { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext();
export const useOrders = () => useContext(OrdersContext);


const dummyOrders = [
  // ACTIVE ORDERS (Left Column)
  {
    id: "ORD1024",
    createdAt: "2026-02-25T10:30:00Z",
    status: "Out for Delivery",
    total: 850,
    items: [
      { name: "Fresh Organic Tomatoes", image: "strawberry.png" }, // Using your available images
      { name: "Whole Wheat Bread", image: "bread.png" },
      { name: "Amul Butter", image: "butter.png" }
    ]
  },
  {
    id: "ORD1025",
    createdAt: "2026-02-26T09:15:00Z",
    status: "Placed",
    total: 420,
    items: [
      { name: "Basmati Rice 1kg", image: "cereal.png" },
      { name: "Moong Dal", image: "spinach.png" }
    ]
  },

  // ORDER HISTORY (Right Column)
  {
    id: "ORD1020",
    createdAt: "2026-02-20T14:20:00Z",
    status: "Delivered",
    total: 1250,
    items: [
      { name: "Aashirvaad Atta 5kg", image: "bread.png" },
      { name: "Fortune Sunflower Oil", image: "water.png" }
    ]
  },
  {
    id: "ORD1018",
    createdAt: "2026-02-18T11:00:00Z",
    status: "Cancelled",
    total: 150,
    items: [
      { name: "Coca Cola 2L", image: "water.png" }
    ]
  }
];

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    const parsed = saved ? JSON.parse(saved) : [];
    
    // If the saved array is empty, force the dummy data
    return parsed.length > 0 ? parsed : dummyOrders;
  });

  // ... rest of your code



  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};