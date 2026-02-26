import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PersonalInfo from "./components/PersonalInfo";
import MyOrders from "./components/MyOrders";
import ManageAddress from "./components/ManageAddress";
import PaymentMethod from "./components/PaymentMethod";
import PasswordManager from "./components/PasswordManager";
import LogoutPanel from "./components/LogoutPanel";
import "./profile1.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "orders":
        return <MyOrders />;
      case "address":
        return <ManageAddress />;
      case "payment":
        return <PaymentMethod />;
      case "password":
        return <PasswordManager />;
      case "logout":
        return <LogoutPanel />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Home / My Account</p>
      </div>

      <div className="account-layout container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="account-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;