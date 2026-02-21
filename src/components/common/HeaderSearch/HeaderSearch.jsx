import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "./headerSearch.css";

function HeaderSearch() {
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, 110001");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  
  // Updated states for the expanded Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pin: "",
    type: "Home" // Default to Home
  });

  const handleDetectLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          setSelectedLocation("Madhya Pradesh, Indore");
          setLoading(false);
          setShowLocationModal(false);
          toast.success("Location updated successfully!");
        }, 800); 
      },
      () => {
        setLoading(false);
        toast.error("Location permission denied");
      }
    );
  };

  const handleSelectSaved = (address) => {
    setSelectedLocation(address);
    setShowLocationModal(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setAddressForm(prev => ({ ...prev, type }));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    
    // Destructure and trim values to prevent users from just typing spaces "   "
    const { name, phone, street, city, state, pin, type } = addressForm;
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedStreet = street.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    const trimmedPin = pin.trim();

    // 1. Basic Empty Field Validation
    if (!trimmedName || !trimmedPhone || !trimmedStreet || !trimmedCity || !trimmedState || !trimmedPin) {
      toast.error("Please fill in all required fields");
      return;
    }

    // 2. Name Validation (Only letters and spaces, minimum 2 characters)
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(trimmedName)) {
      toast.error("Please enter a valid name (letters only).");
      return;
    }

    // 3. Phone Number Validation (Exactly 10 digits, starts with 6-9 for India)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    // 4. Pincode Validation (Exactly 6 digits, cannot start with 0)
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(trimmedPin)) {
      toast.error("Please enter a valid 6-digit Pincode.");
      return;
    }

    // If all validations pass, save it!
    const formattedAddress = `${type} - ${trimmedCity}, ${trimmedPin}`;
    setSelectedLocation(formattedAddress);
    setShowLocationModal(false);
    setIsAddingAddress(false);
    
    // Reset form to default blank state
    setAddressForm({ name: "", phone: "", street: "", landmark: "", city: "", state: "", pin: "", type: "Home" });
    toast.success("New address added successfully!");
  };

  return (
    <>
      <div className="header-search">
        <div className="container header-search__inner">
          <button className="location-pill premium-hover" onClick={() => setShowLocationModal(true)}>
            <div className="loc-icon-wrapper">
              <LocationOnIcon className="pin-icon" fontSize="small" />
            </div>
            <div className="loc-text-wrapper">
              <span className="loc-label">Delivering to</span>
              <strong className="loc-value">{selectedLocation}</strong>
            </div>
            <KeyboardArrowDownIcon className="dropdown-arrow" />
          </button>

          <div className="search-pill-container">
            <SearchIcon className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for fresh food, electronics..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
            {query && (
              <button className="clear-search" onClick={() => setQuery("")}>
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showLocationModal && createPortal(
        <div className="modal-overlay" onClick={() => {
          setShowLocationModal(false);
          setIsAddingAddress(false);
        }}>
          <div className="location-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                {isAddingAddress ? (
                  <button className="back-btn" onClick={() => setIsAddingAddress(false)}>
                    <ArrowBackIcon fontSize="small" /> Back
                  </button>
                ) : (
                  <>
                    <h3>Choose your location</h3>
                    <p className="modal-subtitle">Select a delivery location to see product availability.</p>
                  </>
                )}
              </div>
              <button className="close-btn" onClick={() => {
                setShowLocationModal(false);
                setIsAddingAddress(false);
              }}>
                <CloseIcon />
              </button>
            </div>

            {isAddingAddress ? (
              /* ================= PREMIUM ADDRESS FORM ================= */
              <form onSubmit={handleSaveAddress} className="detailed-address-form">
                
                {/* Visual Address Type Selector */}
                <div className="address-type-selector">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`type-chip ${addressForm.type === type ? "active" : ""}`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type === "Home" && <HomeOutlinedIcon fontSize="small" />}
                      {type === "Work" && <WorkOutlineIcon fontSize="small" />}
                      {type === "Other" && <MapOutlinedIcon fontSize="small" />}
                      {type}
                    </button>
                  ))}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Receiver's Name *</label>
                    <input type="text" name="name" placeholder="John Doe" value={addressForm.name} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" placeholder="10-digit mobile number" value={addressForm.phone} onChange={handleAddressChange} required maxLength="10" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Flat, House no., Building, Apartment *</label>
                  <input type="text" name="street" value={addressForm.street} onChange={handleAddressChange} required />
                </div>

                <div className="form-group">
                  <label>Area, Street, Sector, Village (Optional)</label>
                  <input type="text" name="landmark" value={addressForm.landmark} onChange={handleAddressChange} />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Town / City *</label>
                    <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" name="pin" placeholder="6 digits" value={addressForm.pin} onChange={handleAddressChange} required maxLength="6" />
                  </div>
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange} required />
                </div>

                <button type="submit" className="save-address-btn">Save Address Details</button>
              </form>
            ) : (
              /* ================= DEFAULT MODAL VIEW ================= */
              <>
                <button className="add-address-trigger" onClick={() => setIsAddingAddress(true)}>
                  <div className="add-icon-wrapper"><AddIcon /></div>
                  <div className="add-text">
                    <strong>Add New Address</strong>
                    <span>Deliver to a different location</span>
                  </div>
                </button>

                <div className="divider-text"><span>or</span></div>

                <button className={`geo-btn premium-shadow ${loading ? 'loading' : ''}`} onClick={handleDetectLocation} disabled={loading}>
                  <div className="geo-btn-content">
                    <MyLocationIcon className={loading ? "spin-icon" : "pulse-icon"} />
                    <div className="geo-text">
                      <span className="geo-title">{loading ? "Detecting location..." : "Use current location"}</span>
                      <span className="geo-subtitle">Using GPS</span>
                    </div>
                  </div>
                </button>

                <div className="saved-addresses-container">
                  <h4 className="saved-title">Saved Addresses</h4>
                  <div className="saved-addresses">
                    <div className="address-item" onClick={() => handleSelectSaved("Home - New Delhi, 110001")}>
                      <div className="address-icon home-icon"><HomeOutlinedIcon /></div>
                      <div className="address-details">
                        <strong>Home</strong>
                        <p>Block C, Connaught Place, New Delhi, 110001</p>
                      </div>
                    </div>

                    <div className="address-item" onClick={() => handleSelectSaved("Work - Gurugram, 122018")}>
                      <div className="address-icon work-icon"><WorkOutlineIcon /></div>
                      <div className="address-details">
                        <strong>Work</strong>
                        <p>Cyber City, DLF Phase 2, Gurugram, Haryana 122018</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default HeaderSearch;


