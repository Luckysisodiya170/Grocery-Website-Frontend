import "./headerSearch.css";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import appData from "../../../data/mockData.json";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";

function HeaderSearch() {
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, 110001");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [manualAddress, setManualAddress] = useState(""); // New state

  const handleDetectLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocation("Madhya Pradesh, Indore"); 
        setLoading(false);
        setShowLocationModal(false);
        toast.success("Location updated successfully!");
      },
      () => { setLoading(false); toast.error("Location permission denied"); }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if(manualAddress.trim()) {
      setSelectedLocation(manualAddress);
      setShowLocationModal(false);
      setManualAddress("");
    }
  };

  return (
    <>
      <div className="header-search">
        <div className="container header-search__inner">
          <button className="location-pill premium-hover" onClick={() => setShowLocationModal(true)}>
            <div className="loc-icon-wrapper"><LocationOnIcon className="pin-icon" /></div>
            <div className="loc-text-wrapper">
              <span className="loc-label">Deliver to</span>
              <strong className="loc-value">{selectedLocation}</strong>
            </div>
            <KeyboardArrowDownIcon className="dropdown-arrow" />
          </button>

          <div className="search-pill-container">
            <SearchIcon className="search-icon" />
            <input type="text" className="search-input" placeholder="Search for fresh food, electronics..." value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button className="clear-search" onClick={() => setQuery("")}><CloseIcon fontSize="small" /></button>}
          </div>
        </div>
      </div>

      {showLocationModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Delivery Location</h3>
              <button className="close-btn" onClick={() => setShowLocationModal(false)}><CloseIcon /></button>
            </div>

            {/* MANUAL ENTRY ADDED HERE */}
            <form onSubmit={handleManualSubmit} className="manual-location-form">
              <input 
                type="text" 
                placeholder="Enter area, street, or zip code manually..." 
                value={manualAddress} 
                onChange={(e) => setManualAddress(e.target.value)}
                className="manual-input"
              />
              <button type="submit" className="manual-submit-btn">Apply</button>
            </form>

            <div className="divider-text"><span>or</span></div>

            <button className="geo-btn premium-shadow" onClick={handleDetectLocation} disabled={loading}>
              <MyLocationIcon className={loading ? "spin-icon" : ""} />
              {loading ? "Detecting..." : "Detect Current Location"}
            </button>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
export default HeaderSearch;