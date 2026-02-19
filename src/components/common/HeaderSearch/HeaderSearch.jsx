import "./headerSearch.css";
import { useState } from "react";
import { createPortal } from "react-dom"; // <-- Added this import
import { toast } from "react-toastify";
import appData from "../../../data/mockData.json";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";

function HeaderSearch() {
  const [selectedLocation, setSelectedLocation] = useState(
    "New Delhi, 110001"
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // detect location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      () => {
        setSelectedLocation("Madhya Pradesh, Indore"); 
        setLoading(false);
        setShowLocationModal(false);
        toast.success("Location updated successfully!");
      },
      () => {
        setLoading(false);
        toast.error("Location permission denied");
      }
    );
  };

  return (
    <>
      {/* ---------- HEADER SEARCH ---------- */}
      <div className="header-search">
        <div className="container header-search__inner">

          {/* PREMIUM LOCATION PILL */}
          <button
            className="location-pill premium-hover"
            onClick={() => setShowLocationModal(true)}
            aria-label="Select Delivery Location"
          >
            <div className="loc-icon-wrapper">
              <LocationOnIcon className="pin-icon" />
            </div>
            <div className="loc-text-wrapper">
              <span className="loc-label">Deliver to</span>
              <strong className="loc-value">{selectedLocation}</strong>
            </div>
            <KeyboardArrowDownIcon className="dropdown-arrow" />
          </button>

          {/* PREMIUM SEARCH PILL */}
          <div className="search-pill-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for fresh food, electronics, or vendors..."
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

      {/* ---------- ELITE LOCATION MODAL ---------- */}
      {/* Wrapped the modal in createPortal to escape Navbar's CSS constraints */}
      {showLocationModal && createPortal(
        <div
          className="modal-overlay"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="location-modal glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h3>Select Delivery Location</h3>
              <button
                className="close-btn"
                onClick={() => setShowLocationModal(false)}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Glowing Detect Button */}
            <button
              className="geo-btn premium-shadow"
              onClick={handleDetectLocation}
              disabled={loading}
            >
              <MyLocationIcon className={loading ? "spin-icon" : ""} />
              {loading ? "Detecting your location..." : "Detect My Current Location"}
            </button>

            <div className="divider-text"><span>or choose from saved</span></div>

            {/* Saved Locations List */}
            <div className="saved-addresses">
              {appData.locations?.map((loc) => (
                <div
                  key={loc.id}
                  className="address-item"
                  onClick={() => {
                    setSelectedLocation(`${loc.address}, ${loc.zip}`);
                    setShowLocationModal(false);
                    toast.success(`Location set to ${loc.label}`);
                  }}
                >
                  <div className="address-icon">📍</div>
                  <div className="address-details">
                    <strong>{loc.label}</strong>
                    <p>{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>,
        document.body // <-- This tells React to render the modal at the root level
      )}
    </>
  );
}

export default HeaderSearch;