import { useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

function PersonalInfo() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    avatar: user?.avatar || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    updateUser(formData);
  };

  return (
    <>
      <h2>Personal Information</h2>

      {/* Avatar Upload */}
      <div className="profile-upload-section">
        <div className="profile-avatar-large" onClick={handleImageClick}>
          <img src={formData.avatar} alt="Profile" />
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          hidden
        />

        <p className="upload-hint">Click image to upload profile photo</p>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <button className="primary-btn" onClick={handleSubmit}>
        Update Changes
      </button>
    </>
  );
}

export default PersonalInfo;