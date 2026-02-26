function BasicInfo({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Business Name</label>
        <input type="text" name="businessName" placeholder="e.g. Spice Garden Restaurant" value={vendorData.businessName} onChange={handleChange} />
      </div>
      <div className="form-group full-width">
        <label>Business Category</label>
        <select name="businessCategory" value={vendorData.businessCategory} onChange={handleChange}>
          <option value="Restaurant">Restaurant</option>
          <option value="Grocery">Grocery</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
      </div>
      <div className="form-group">
        <label>Owner Full Name</label>
        <input type="text" name="ownerName" placeholder="Legal name of owner" value={vendorData.ownerName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" placeholder="contact@business.com" value={vendorData.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="********" value={vendorData.password} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Contact Number</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={{ width: '80px' }}><option>+91</option></select>
          <input type="text" name="contactNumber" placeholder="Primary Phone" value={vendorData.contactNumber} onChange={handleChange} style={{ flex: 1 }} />
        </div>
      </div>
      <div className="form-group full-width">
        <label>Emergency Contact</label>
        <input type="text" name="emergencyContact" placeholder="Emergency number" value={vendorData.emergencyContact} onChange={handleChange} />
      </div>
    </div>
  );
}

export default BasicInfo;