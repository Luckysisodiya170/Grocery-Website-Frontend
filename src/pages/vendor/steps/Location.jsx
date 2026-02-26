function Location({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Door No / Building / Street</label>
        <input type="text" name="address" placeholder="Full address" value={vendorData.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="city" placeholder="City" value={vendorData.city} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>State / Province</label>
        <input type="text" name="state" placeholder="State" value={vendorData.state} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Country</label>
        <select name="country" value={vendorData.country} onChange={handleChange}>
          <option value="India">India</option>
          <option value="USA">USA</option>
        </select>
      </div>
      <div className="form-group">
        <label>Pincode / Zip</label>
        <input type="text" name="pincode" placeholder="6-digit code" value={vendorData.pincode} onChange={handleChange} />
      </div>
      <div className="form-group full-width">
        <label>Geo Location (Coordinates)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" name="geoLocation" placeholder="Lat / Long" value={vendorData.geoLocation} onChange={handleChange} style={{ flex: 1 }} />
          <button type="button" className="secondary-btn">Pick from Map</button>
        </div>
      </div>
    </div>
  );
}

export default Location;