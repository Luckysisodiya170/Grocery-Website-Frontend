import { useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./common.css";

function LocationPicker() {
  const [location, setLocation] = useState("Detect location");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Indore, MP"); // fallback
      return;
    }

    setLocation("Detecting...");

    navigator.geolocation.getCurrentPosition(
      () => {
        // In real app call reverse geocode API
        setLocation("Indore, MP"); // dummy result
      },
      () => {
        setLocation("Indore, MP"); // fallback
      }
    );
  };

  return (
    <button className="location-btn glass-panel premium-hover" onClick={detectLocation}>
      <div className="icon-circle">
        <LocationOnOutlinedIcon fontSize="small" />
      </div>
      <span className="loc-text">{location}</span>
      <KeyboardArrowDownIcon fontSize="small" className="arrow-icon" />
    </button>
  );
}

export default LocationPicker;