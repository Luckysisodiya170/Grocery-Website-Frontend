import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; 
import { getProfileDetails, updateProfileDetails } from "../../../utils/profileApi";

function PersonalInfo() {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileDetails();
      if (res && res.success) {
        const customer = res.data.customer;
        const initialData = {
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.mobile || "",
          gender: customer.gender || "",
          avatar: customer.profile_image || "",
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    } catch (error) {
      toast.error("Failed to load profile details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    if (!isEditing) {
      return toast.info("Please click 'Edit Profile' to change your photo.", { position: "top-center" });
    }
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return toast.error("Name and Email are required!");
    }

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('email', formData.email);
      if (formData.gender) dataToSubmit.append('gender', formData.gender);
      
      if (selectedFile) {
        dataToSubmit.append('profile_image', selectedFile);
      }

      const res = await updateProfileDetails(dataToSubmit);
      
      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile(); 
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (originalData) setFormData(originalData);
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="section-header-action">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Personal Information</h2>
        {!isEditing && (
          <button
            type="button"
            className="edit-icon-btn"
            onClick={() => setIsEditing(true)}
          >
            <EditOutlinedIcon fontSize="small" /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-upload-section" style={{ marginTop: "20px" }}>
        <div
          className={`profile-avatar-large ${!isEditing ? 'disabled-avatar' : ''}`}
          onClick={handleImageClick}
        >
          {formData.avatar ? <img src={formData.avatar} alt="Profile" /> : <span>Upload</span>}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          hidden
          disabled={!isEditing}
        />

        {isEditing && <p className="upload-hint">Click image to upload profile photo</p>}
      </div>

      <div className="grid-2">
        <div className="form-group">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder=" "
            disabled={!isEditing}
            className={!isEditing ? "input-disabled" : ""}
          />
          <label>Full Name *</label>
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder=" "
            disabled={!isEditing}
            className={!isEditing ? "input-disabled" : ""}
          />
          <label>Email *</label>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            placeholder=" "
            disabled={!isEditing}
            className={!isEditing ? "input-disabled" : ""}
          />
          <label>Phone</label>
        </div>

        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "input-disabled" : ""}
          >
            <option value="" disabled hidden></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label>Gender</label>
        </div>
      </div>

      {isEditing && (
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" style={{ marginTop: 0 }}>
            Save Changes
          </button>
        </div>
      )}
    </form>
  );
}

export default PersonalInfo;