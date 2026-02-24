import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

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
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Cart & Data
import { useCart } from "../../../pages/cart/CartContext"; 
import products from "../../../data/products.json"; 

import "./headerSearch.css";

function HeaderSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  
  // --- LOCATION STATES ---
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, 110001");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", street: "", landmark: "", city: "", state: "", pin: "", type: "Home"
  });
  
  // --- SEARCH STATES ---
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- DROPDOWN DATA FILTERING ---
  const matchingProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6); 

  const textSuggestions = Array.from(new Set(
    products
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .map(p => p.name)
  )).slice(0, 5); 

  // --- CLICK HANDLERS ---
  const goToProduct = (productId) => {
    setIsSearchFocused(false);
    setQuery(""); 
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); 
    addToCart(product);
    setIsCartOpen(true); 
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (location.pathname === "/shop") {
      navigate(`/shop?search=${encodeURIComponent(val)}`, { replace: true });
    }
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
    if (location.pathname !== "/shop") {
      navigate("/shop");
    }
  };

  const executeSearch = (searchTerm) => {
    setQuery(searchTerm);
    setIsSearchFocused(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeSearch(query);
      setIsSearchFocused(false);
    }
  };

  // --- LOCATION HANDLERS ---
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
    const { name, phone, street, city, state, pin, type } = addressForm;
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedStreet = street.trim();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    const trimmedPin = pin.trim();

    if (!trimmedName || !trimmedPhone || !trimmedStreet || !trimmedCity || !trimmedState || !trimmedPin) {
      toast.error("Please fill in all required fields");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    const formattedAddress = `${type} - ${trimmedCity}, ${trimmedPin}`;
    setSelectedLocation(formattedAddress);
    setShowLocationModal(false);
    setIsAddingAddress(false);
    setAddressForm({ name: "", phone: "", street: "", landmark: "", city: "", state: "", pin: "", type: "Home" });
    toast.success("New address added successfully!");
  };

  return (
    <>
      <div className="header-search" ref={searchContainerRef}>
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
              placeholder="Search for Fresh Spinach, Milk..." 
              value={query} 
              onChange={handleInputChange} 
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button className="clear-search" onClick={() => { 
                setQuery(""); 
                navigate("/shop");
              }}>
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>

        {/* --- FULL WIDTH ZEPTO-STYLE OVERLAY --- */}
        {query && isSearchFocused && (
          <div className="zepto-dropdown-overlay">
            <div className="container zepto-dropdown-inner">
              
              {textSuggestions.length > 0 && (
                <div className="zepto-suggestions-list">
                  {textSuggestions.map((name, i) => {
                    const matchedProduct = products.find(p => p.name === name);
                    const safeImage = matchedProduct?.image || "default.png";
                    
                    return (
                      <div key={i} className="zepto-suggestion-item" onClick={() => executeSearch(name)}>
                        <div className="sugg-img-placeholder">
                          <img src={`/product/${safeImage}`} alt={name} />
                        </div>
                        <span>
                          {name.toLowerCase().startsWith(query.toLowerCase()) ? (
                            <><strong>{query}</strong>{name.substring(query.length)}</>
                          ) : (
                            name
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {matchingProducts.length > 0 && (
                <div className="zepto-products-section">
                  <h4 className="zepto-results-title">Showing results for "{query}"</h4>
                  <div className="zepto-products-row">
                    {matchingProducts.map((product) => (
                      <div className="zepto-mini-card" key={product.id} onClick={() => goToProduct(product.id)}>
                        <div className="img-box">
                          {product.discount && <span className="blue-badge">{product.discount}</span>}
                          {product.isNew && !product.discount && <span className="new-badge">NEW</span>}
                          <img src={`/product/${product.image}`} alt={product.name} />
                        </div>
                        
                        <div className="delivery-time">
                          <AccessTimeIcon style={{fontSize: "10px"}} /> 8 MINS
                        </div>
                        
                        <div className="mini-title">{product.name}</div>
                        <div className="weight-selector">1 pc <KeyboardArrowDownIcon style={{fontSize: "14px"}} /></div>
                        
                        <div className="price-add-row">
                          <div className="price-block">
                            <span className="current-price">₹{product.price}</span>
                            {product.originalPrice && <span className="old-price">₹{product.originalPrice}</span>}
                          </div>
                          
                          <button 
                            className="mini-add-btn" 
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* --- LOCATION MODAL --- */}
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
              <form onSubmit={handleSaveAddress} className="detailed-address-form">
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