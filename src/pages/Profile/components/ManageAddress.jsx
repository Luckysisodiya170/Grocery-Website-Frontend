import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { getProfileDetails} from "../../../utils/profileApi";
import { addAddress } from "../../../utils/addressApi";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    address_name: "", // Home, Work, etc.
    contact_person_name: "",
    contact_phone: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
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
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getIcon = (label) => {
    const lower = (label || "").toLowerCase();
    if (lower.includes("home")) return <HomeOutlinedIcon />;
    if (lower.includes("office") || lower.includes("work")) return <BusinessOutlinedIcon />;
    return <LocationOnOutlinedIcon />;
  };

  const handleDelete = (id) => {
    // API logic for delete to be added here later
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
      
      const payload = {
        ...formData,
        country: "India",
        latitude: 0, // Sending dummy logic as no map is present yet
        longitude: 0,
      };

      const res = await addAddress(payload);
      
      if (res.success) {
        toast.success("Address added successfully!", { position: "top-center" });
        setShowForm(false);
        setFormData({
          address_name: "", contact_person_name: "", contact_phone: "",
          address_line_1: "", address_line_2: "", landmark: "", city: "", state: "", pincode: "", is_default: false
        });
        fetchAddresses(); // Refresh list
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading addresses...</div>;

  return (
    <div className="manage-address-section">
      <div className="section-header-action">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Saved Addresses</h2>

        {!showForm && (
          <button
            type="button"
            className="edit-icon-btn"
            onClick={() => setShowForm(true)}
          >
            <AddIcon fontSize="small" /> Add New
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="add-address-form form-slide-in">
          <p className="section-subtitle">Enter details for your new delivery location.</p>

          <div className="grid-2">
            <div className="form-group">
              <input name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} placeholder=" " required />
              <label>Contact Name *</label>
            </div>
            <div className="form-group">
              <input type="tel" maxLength="10" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder=" " required />
              <label>Contact Phone *</label>
            </div>
          </div>

          <div className="form-group">
            <input name="address_name" value={formData.address_name} onChange={handleChange} placeholder=" " required />
            <label>Address Label (e.g. Home, Office) *</label>
          </div>

          <div className="form-group">
            <input name="address_line_1" value={formData.address_line_1} onChange={handleChange} placeholder=" " required />
            <label>Flat, House no., Building, Company, Apartment *</label>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <input name="address_line_2" value={formData.address_line_2} onChange={handleChange} placeholder=" " />
              <label>Area, Street, Sector, Village</label>
            </div>
            <div className="form-group">
              <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder=" " />
              <label>Landmark</label>
            </div>
          </div>

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
             <div className="form-group">
              <input name="city" value={formData.city} onChange={handleChange} placeholder=" " required />
              <label>Town/City *</label>
            </div>
            <div className="form-group">
              <input name="state" value={formData.state} onChange={handleChange} placeholder=" " required />
              <label>State *</label>
            </div>
            <div className="form-group">
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder=" " maxLength="6" required />
              <label>Pincode *</label>
            </div>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="is_default" name="is_default" checked={formData.is_default} onChange={handleChange} style={{ width: 'auto', cursor: 'pointer' }} />
            <label htmlFor="is_default" style={{ position: 'static', transform: 'none', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer' }}>Make this my default address</label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" style={{ marginTop: 0 }} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      ) : (
        <div className="address-cards-grid">
          {addresses.map((loc) => (
            <div className="profile-address-card" key={loc.id}>
              <div className="addr-icon">{getIcon(loc.address_name)}</div>
              <div className="addr-details">
                <h4>{loc.address_name} {loc.is_default && <span style={{fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px'}}>Default</span>}</h4>
                <p style={{fontSize: '12px', fontWeight: 'bold'}}>{loc.contact_person_name} ({loc.contact_phone})</p>
                <p>{loc.address_line_1}, {loc.address_line_2}</p>
                <p>{loc.city}, {loc.state}</p>
                <span>Pin: {loc.pincode}</span>
              </div>
              <button
                className="delete-addr-btn"
                onClick={() => handleDelete(loc.id)}
                title="Delete Address"
              >
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          ))}

          <div className="profile-address-card add-new-card" onClick={() => setShowForm(true)}>
            <div className="add-circle">
              <AddIcon />
            </div>
            <h4>Add New Address</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAddress;