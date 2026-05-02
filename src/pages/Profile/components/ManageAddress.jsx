import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { getProfileDetails } from "../../../utils/profileApi";
import { addAddress } from "../../../utils/addressApi";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    address_name: "", contact_person_name: "", contact_phone: "",
    address_line_1: "", address_line_2: "", landmark: "", city: "", state: "", pincode: "", is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileDetails();
      if (res && res.success) {
        setAddresses(res.data.addresses || []);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const getIcon = (label) => {
    const lower = (label || "").toLowerCase();
    if (lower.includes("home")) return <HomeOutlinedIcon fontSize="small" />;
    if (lower.includes("office") || lower.includes("work")) return <BusinessOutlinedIcon fontSize="small" />;
    return <LocationOnOutlinedIcon fontSize="small" />;
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.info("Address removed locally. API integration pending.", { position: "top-center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address_name || !formData.address_line_1 || !formData.city || !formData.state || !formData.pincode || !formData.contact_person_name || !formData.contact_phone) {
      return toast.error("Please fill all required fields", { position: "top-center" });
    }

    try {
      setIsSubmitting(true);
      const payload = { ...formData, country: "India", latitude: 0, longitude: 0 };
      const res = await addAddress(payload);
      
      if (res.success) {
        toast.success("Address added successfully!", { position: "top-center" });
        setShowForm(false);
        setFormData({
          address_name: "", contact_person_name: "", contact_phone: "",
          address_line_1: "", address_line_2: "", landmark: "", city: "", state: "", pincode: "", is_default: false
        });
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 font-bold text-[var(--primary)] animate-pulse w-full h-full min-h-[500px] flex items-center justify-center">Loading addresses...</div>;

  return (
    <div className="p-6 md:p-8 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] w-full h-full min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
        <h2 className="text-[22px] font-black text-[var(--text-main)]">Saved Addresses</h2>
        {!showForm && (
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-soft)] text-[var(--primary)] font-bold text-sm rounded-[var(--radius-pill)] hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors mt-4 sm:mt-0"
            onClick={() => setShowForm(true)}
          >
            <AddIcon fontSize="small" /> Add New
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="animate-in slide-in-from-right-8 duration-300">
          <p className="text-[13px] text-[var(--text-muted)] font-medium mb-5">Enter details for your new delivery location.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative group">
              <input name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Contact Name *" required />
            </div>
            <div className="relative group">
              <input type="tel" maxLength="10" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Contact Phone *" required />
            </div>
          </div>

          <div className="relative group mb-4">
            <input name="address_name" value={formData.address_name} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Address Label (e.g. Home, Office) *" required />
          </div>

          <div className="relative group mb-4">
            <input name="address_line_1" value={formData.address_line_1} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Flat, House no., Building, Company, Apartment *" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative group">
              <input name="address_line_2" value={formData.address_line_2} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Area, Street, Sector, Village" />
            </div>
            <div className="relative group">
              <input name="landmark" value={formData.landmark} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Landmark" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="relative group">
              <input name="city" value={formData.city} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Town/City *" required />
            </div>
            <div className="relative group">
              <input name="state" value={formData.state} onChange={handleChange} className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="State *" required />
            </div>
            <div className="relative group">
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6" className="w-full p-3.5 bg-[var(--bg-soft)] rounded-[var(--radius-md)] text-sm font-bold text-[var(--text-main)] outline-none border-2 border-transparent focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all" placeholder="Pincode *" required />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input type="checkbox" id="is_default" name="is_default" checked={formData.is_default} onChange={handleChange} className="w-4 h-4 accent-[var(--primary)] cursor-pointer" />
            <label htmlFor="is_default" className="text-[13px] font-bold text-[var(--text-main)] cursor-pointer select-none">Make this my default address</label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button type="button" className="px-8 py-3 rounded-[var(--radius-pill)] font-black uppercase tracking-widest text-[12px] transition-all border-2 border-[var(--border)] text-[var(--text-light)] hover:bg-[var(--bg-soft)]" onClick={() => setShowForm(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={`px-8 py-3 rounded-[var(--radius-pill)] font-black uppercase tracking-widest text-[12px] transition-all shadow-[var(--shadow-md)] bg-[var(--primary)] text-[var(--secondary)] hover:bg-[var(--primary-hover)] hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((loc) => (
            <div className="relative p-4 rounded-[var(--radius-lg)] border-2 border-[var(--bg-soft)] bg-[var(--bg)] hover:border-[var(--primary)] transition-all group shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] flex flex-col justify-between" key={loc.id}>
              <div>
                <div className="w-8 h-8 rounded-full bg-[var(--bg-soft)] text-[var(--primary)] flex items-center justify-center mb-2 group-hover:bg-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors">
                  {getIcon(loc.address_name)}
                </div>
                <div className="mb-1.5">
                  <h4 className="text-[15px] font-black text-[var(--text-main)] flex items-center gap-2">
                    {loc.address_name} 
                    {loc.is_default && <span className="text-[9px] bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>}
                  </h4>
                  <p className="text-[12px] font-extrabold text-[var(--text-light)]">{loc.contact_person_name} ({loc.contact_phone})</p>
                </div>
                <div className="text-[12px] text-[var(--text-muted)] font-medium leading-relaxed">
                  <p className="truncate">{loc.address_line_1}, {loc.address_line_2}</p>
                  <p>{loc.city}, {loc.state}</p>
                  <p className="font-bold text-[var(--text-main)] mt-0.5">Pin: {loc.pincode}</p>
                </div>
              </div>
              <button className="absolute top-3 right-3 p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[#fef2f2] rounded-full transition-colors" onClick={() => handleDelete(loc.id)}>
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          ))}

          <div className="p-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border)] bg-[var(--bg-soft)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--bg)] transition-all min-h-[140px] group" onClick={() => setShowForm(true)}>
            <div className="w-8 h-8 rounded-full bg-[var(--card-bg)] text-[var(--text-muted)] flex items-center justify-center mb-2 shadow-[var(--shadow-sm)] group-hover:bg-[var(--primary)] group-hover:text-[var(--secondary)] transition-all">
              <AddIcon fontSize="small" />
            </div>
            <h4 className="text-[13px] font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">Add New Address</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAddress;