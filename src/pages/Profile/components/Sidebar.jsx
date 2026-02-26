const menuItems = [
  { id: "personal", label: "Personal Information" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="account-sidebar">
      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => setActiveTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;