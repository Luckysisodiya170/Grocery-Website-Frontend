import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getProfileDetails } from "../../../utils/profileApi";
import { addAddress, updateAddress, deleteAddress } from "../../../utils/addressApi";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = { 
    address_name: "Home", 
    contact_person_name: "", 
    contact_phone: "", 
    address_line_1: "", 
    address_line_2: "", 
    city: "", 
    state: "", 
    pincode: "", 
    is_default: false, 
    country: "India" 
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await getProfileDetails();
      if (res?.success) setAddresses(res.data.addresses || []);
    } catch (error) { toast.error("Failed to load addresses"); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await deleteAddress(id);
      if (res.success) { 
        toast.success("Address deleted"); 
        fetchAddresses(); 
      }
    } catch (error) { toast.error("Failed to delete"); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = editId ? await updateAddress(editId, formData) : await addAddress(formData);
      if (res.success) {
        toast.success(editId ? "Address Updated" : "Address Saved");
        setShowForm(false);
        setEditId(null);
        fetchAddresses();
      }
    } catch (error) { toast.error("Failed to save address"); }
    finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div className="h-[414px] flex items-center justify-center w-full bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] animate-pulse font-bold text-[var(--primary)]">Loading Addresses...</div>;

  return (
    <div className="h-[414px] w-full p-8 bg-[var(--card-bg)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)] shrink-0">
        <h2 className="text-2xl font-black text-[var(--text-main)]">My Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => { setEditId(null); setFormData(initialForm); setShowForm(true); }} 
            className="px-6 py-2.5 bg-[var(--primary)] text-white font-black text-[12px] uppercase tracking-widest rounded-full shadow-md hover:bg-[var(--primary-hover)] transition-all active:scale-95"
          >
            Add New Address
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-6 pb-2">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {["Home", "Office", "Other"].map(t => (
                <button 
                  key={t} 
                  type="button" 
                  onClick={() => setFormData({...formData, address_name: t})} 
                  className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.address_name === t ? 'bg-white text-[var(--primary)] shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Receiver Name</label>
                <input name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} placeholder="e.g. Lucky Sisodya" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mobile Number</label>
                <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="10-digit number" maxLength="10" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">House / Area Details</label>
              <input name="address_line_1" value={formData.address_line_1} onChange={handleChange} placeholder="House No, Street, Building" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" required className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
              <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" maxLength="6" required className="p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-[15px] font-bold transition-all" />
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-2xl bg-[var(--primary)] text-white font-black text-xs uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all active:scale-95">
                {isSubmitting ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            {addresses.map((loc) => (
              <div key={loc.id} className="p-6 rounded-[32px] bg-slate-50 border-2 border-transparent hover:border-[var(--primary)] hover:bg-white hover:shadow-xl transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--primary)] shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                    {loc.address_name === "Home" ? <HomeOutlinedIcon /> : loc.address_name === "Office" ? <BusinessOutlinedIcon /> : <LocationOnOutlinedIcon />}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditId(loc.id); setFormData(loc); setShowForm(true); }} className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><EditOutlinedIcon fontSize="small" /></button>
                    <button onClick={() => handleDelete(loc.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><DeleteOutlineIcon fontSize="small" /></button>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 text-lg mb-1">{loc.address_name}</h4>
                <p className="text-[11px] font-black text-[var(--primary)] mb-3 uppercase tracking-tighter">{loc.contact_person_name} • {loc.contact_phone}</p>
                <p className="text-[13px] text-slate-500 font-bold leading-relaxed line-clamp-2">
                  {loc.address_line_1}, {loc.city}, {loc.state} - {loc.pincode}
                </p>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[32px]">
                <LocationOnOutlinedIcon fontSize="large" className="mb-2 opacity-20" />
                <p className="font-bold text-sm uppercase tracking-widest">No addresses found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAddress;