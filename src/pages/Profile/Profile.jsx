import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = () => {
    const updatedUser = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload(); // quick refresh for navbar update
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2>{user.name}</h2>
          <p>{user.mobile}</p>
        </div>

        <div className="profile-body">
          <div className="profile-field">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Mobile Number</label>
            <input value={user.mobile} disabled />
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;