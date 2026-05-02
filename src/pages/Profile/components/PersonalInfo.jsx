import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; 
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { getProfileDetails, updateProfileDetails } from "../../../utils/profileApi";

function PersonalInfo() {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "", avatar: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileDetails();
      if (res && res.success) {
        const customer = res.data.customer;
        const initialData = {
          name: customer.name || "", email: customer.email || "", phone: customer.mobile || "", gender: customer.gender || "", avatar: customer.profile_image || "",
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    } catch (error) { toast.error("Failed to load profile details"); } 
    finally { setIsLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageClick = () => {
    if (!isEditing) return toast.info("Please click 'Edit Profile' to change your photo.", { position: "top-center" });
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error("Name and Email are required!");
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('email', formData.email);
      if (formData.gender) dataToSubmit.append('gender', formData.gender);
      if (selectedFile) dataToSubmit.append('profile_image', selectedFile);
      const res = await updateProfileDetails(dataToSubmit);
      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile(); 
      }
    } catch (error) { toast.error("Failed to update profile"); }
  };

  const handleCancel = () => {
    if (originalData) setFormData(originalData);
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[500px] w-full bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-[var(--primary)] font-bold animate-pulse">Loading profile...</div>;

  return (
    <div className="flex flex-col min-h-[500px] w-full p-8 md:p-10 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
          <h2 className="text-[24px] font-black text-[var(--text-main)]">Personal Information</h2>
          {!isEditing && (
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-black text-[12px] uppercase tracking-widest rounded-[var(--radius-pill)] hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-all shrink-0 shadow-sm"
              onClick={() => setIsEditing(true)}
            >
              <EditOutlinedIcon fontSize="small" /> Edit
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col w-full">
          <div className="mb-10 flex flex-col items-center justify-center w-full">
            <div className={`relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 bg-[var(--bg-soft)] shadow-[var(--shadow-md)] transition-all group ${isEditing ? 'border-[var(--primary)] cursor-pointer' : 'border-[var(--border)]'}`} onClick={handleImageClick}>
              {formData.avatar ? <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" /> : <PersonOutlineOutlinedIcon style={{ fontSize: '40px' }} className="opacity-30" />}
              {isEditing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><CameraAltOutlinedIcon className="text-white scale-75" /></div>}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden disabled={!isEditing} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 pl-2">Full Name</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] border-2 transition-all ${isEditing ? 'bg-[var(--bg-soft)] border-transparent focus-within:border-[var(--primary)] focus-within:bg-[var(--bg)]' : 'bg-transparent border-[var(--border)] opacity-80'}`}>
                <PersonOutlineOutlinedIcon className="text-[var(--text-muted)] scale-90" />
                <input name="name" value={formData.name} onChange={handleChange} required disabled={!isEditing} className="w-full bg-transparent outline-none text-[15px] font-bold text-[var(--text-main)]" placeholder="Name" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 pl-2">Email Address</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] border-2 transition-all ${isEditing ? 'bg-[var(--bg-soft)] border-transparent focus-within:border-[var(--primary)] focus-within:bg-[var(--bg)]' : 'bg-transparent border-[var(--border)] opacity-80'}`}>
                <MailOutlineIcon className="text-[var(--text-muted)] scale-90" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={!isEditing} className="w-full bg-transparent outline-none text-[15px] font-bold text-[var(--text-main)]" placeholder="Email" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 pl-2">Phone</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] border-2 transition-all ${isEditing ? 'bg-[var(--bg-soft)] border-transparent focus-within:border-[var(--primary)] focus-within:bg-[var(--bg)]' : 'bg-transparent border-[var(--border)] opacity-80'}`}>
                <PhoneOutlinedIcon className="text-[var(--text-muted)] scale-90" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength="10" disabled={!isEditing} className="w-full bg-transparent outline-none text-[15px] font-bold text-[var(--text-main)]" placeholder="Phone" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 pl-2">Gender</label>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] border-2 transition-all ${isEditing ? 'bg-[var(--bg-soft)] border-transparent focus-within:border-[var(--primary)] focus-within:bg-[var(--bg)]' : 'bg-transparent border-[var(--border)] opacity-80'}`}>
                <WcOutlinedIcon className="text-[var(--text-muted)] scale-90" />
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} className="w-full bg-transparent outline-none text-[15px] font-bold text-[var(--text-main)] appearance-none cursor-pointer">
                  <option value="" disabled hidden>Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-4 pt-8 mt-10 border-t border-[var(--border)]">
            <button type="button" className="px-8 py-3 rounded-[var(--radius-pill)] font-black uppercase tracking-widest text-[12px] border-2 border-[var(--border)] text-[var(--text-light)] hover:bg-[var(--bg-soft)]" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="px-8 py-3 rounded-[var(--radius-pill)] font-black uppercase tracking-widest text-[12px] shadow-md bg-[var(--primary)] text-[var(--secondary)] hover:bg-[var(--primary-hover)] hover:-translate-y-1">Save</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonalInfo;