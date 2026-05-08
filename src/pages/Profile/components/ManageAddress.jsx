import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import { getProfileDetails } from "../../../utils/profileApi";
import { addAddress, updateAddress, deleteAddress } from "../../../utils/addressApi";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addressFor, setAddressFor] = useState("SELF");

  const initialForm = {
    address_name: "Office",
    contact_person_name: "",
    contact_phone: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "", 
    pincode: "",
    is_default: false,
    latitude: 17.4483,
    longitude: 78.3915,
    country: "India"
  };

  const [formData, setFormData] = useState(initialForm);

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

  //  DELETE ADDRESS FUNCTION 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await deleteAddress(id);
      
      if (res.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      } else {
        toast.error(res.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong while deleting");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contact_person_name) return toast.error("Full Name is required");
    if (!formData.contact_phone || formData.contact_phone.length < 10) return toast.error("Valid Mobile Number is required");
    if (!formData.address_line_1) return toast.error("Address Line 1 is required");
    if (!formData.city) return toast.error("City is required");
    if (!formData.state) return toast.error("State is required");
    if (!formData.pincode) return toast.error("Pincode is required");

    try {
      setIsSubmitting(true);
      const res = editId 
        ? await updateAddress(editId, formData) 
        : await addAddress(formData);
      
      if (res.success) {
        toast.success(editId ? "Address Updated" : "Address Saved Successfully");
        setShowForm(false);
        setEditId(null);
        setFormData(initialForm);
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-5">
        <h2 className="text-2xl font-black text-slate-900">My Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => { setEditId(null); setFormData(initialForm); setShowForm(true); }}
            className="bg-[#1a1f2c] text-white px-8 py-3 rounded-full font-bold text-sm"
          >
            Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
          <div className="flex bg-[#f4f7fe] p-1.5 rounded-2xl">
            {["SELF", "SOMEONE ELSE"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAddressFor(opt)}
                className={`flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${addressFor === opt ? "bg-white text-[#1a1f2c] shadow-sm" : "text-[#8e94a3]"}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {["Home", "Office", "Other"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({...formData, address_name: t})}
                className={`px-8 py-2.5 rounded-full text-xs font-bold border transition-all ${formData.address_name === t ? "bg-[#1a1f2c] text-white border-[#1a1f2c]" : "bg-white text-[#8e94a3] border-slate-200"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#8e94a3] ml-1">Full Name</label>
                <input name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} className="w-full p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. Lucky Sisodya" required />
            </div>
            <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#8e94a3] ml-1">Mobile Number</label>
                <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. 8085740329" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-[#8e94a3] ml-1">Address Line 1 (House/Building)</label>
            <input name="address_line_1" value={formData.address_line_1} onChange={handleChange} className="w-full p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="House No, Building Name" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#8e94a3] ml-1">Area / Street (Optional)</label>
                <input name="address_line_2" value={formData.address_line_2} onChange={handleChange} className="w-full p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="Area, Sector" />
            </div>
            <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#8e94a3] ml-1">Landmark (Optional)</label>
                <input name="landmark" value={formData.landmark} onChange={handleChange} className="w-full p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="Nearby Landmark" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="city" value={formData.city} onChange={handleChange} className="p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="City" required />
            <input name="state" value={formData.state} onChange={handleChange} className="p-4 bg-[#eef2ff] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-200" placeholder="State (e.g. Madhya Pradesh)" required />
            <input name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6" className="p-4 bg-[#f4f7fe] rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-slate-200" placeholder="Pincode" required />
          </div>

          <div className="flex gap-4 pt-8">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest text-[#1a1f2c]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-2xl bg-[#1a1f2c] text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95">
              {isSubmitting ? "Processing..." : "Save Address"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((loc) => (
            <div key={loc.id} className="p-6 rounded-[32px] bg-[#f8fafc] border-2 border-transparent hover:border-[#1a1f2c] transition-all relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1a1f2c]">
                  {loc.address_name === "Home" ? <HomeOutlinedIcon /> : loc.address_name === "Office" ? <BusinessOutlinedIcon /> : <LocationOnOutlinedIcon />}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditId(loc.id); setFormData(loc); setShowForm(true); }} className="p-2 text-slate-400 hover:text-blue-600"><EditOutlinedIcon fontSize="small" /></button>
                  <button onClick={() => handleDelete(loc.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </div>
              </div>
              <h4 className="font-black text-[#1a1f2c] text-lg mb-1">{loc.address_name}</h4>
              <p className="text-xs font-black text-[#8e94a3] mb-3">{loc.contact_person_name} | {loc.contact_phone}</p>
              <p className="text-xs text-[#8e94a3] font-bold leading-relaxed">
                {loc.address_line_1}, {loc.address_line_2 && loc.address_line_2 + ","} <br />
                {loc.city}, {loc.state} - {loc.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageAddress;