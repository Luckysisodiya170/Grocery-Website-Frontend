import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PublicIcon from "@mui/icons-material/Public";
import PinDropIcon from "@mui/icons-material/PinDrop";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

function Location({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Door No / Building / Street</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><HomeIcon fontSize="small" /></div>
          <input type="text" name="address" placeholder="Full address" value={vendorData.address} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>City</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><LocationCityIcon fontSize="small" /></div>
          <input type="text" name="city" placeholder="City" value={vendorData.city} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>State / Province</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><MapIcon fontSize="small" /></div>
          <input type="text" name="state" placeholder="State" value={vendorData.state} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Country</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><PublicIcon fontSize="small" /></div>
          <select name="country" value={vendorData.country} onChange={handleChange}>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Pincode / Zip</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><PinDropIcon fontSize="small" /></div>
          <input type="text" name="pincode" placeholder="6-digit code" value={vendorData.pincode} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Geo Location (Coordinates)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Corrected wrapper for the icon and input */}
          <div className="input-with-icon" style={{ flex: 1 }}>
            <div className="input-icon-wrapper"><GpsFixedIcon fontSize="small" /></div>
            <input type="text" name="geoLocation" placeholder="Lat / Long" value={vendorData.geoLocation} onChange={handleChange} />
          </div>
          <button type="button" style={{ height: '42px', padding: '0 20px', borderRadius: '12px', background: '#e2e8f0', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#333' }}>
            Map
          </button>
        </div>
      </div></div>
      );
}

      export default Location;