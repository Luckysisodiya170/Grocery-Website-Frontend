function BusinessIds({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Trade License Number</label>
        <input type="text" name="tradeLicense" placeholder="Enter trade license ID" value={vendorData.tradeLicense} onChange={handleChange} />
      </div>
      <div className="form-group full-width">
        <label>Upload Trade License (PDF/Image)</label>
        <div className="upload-box" style={{ border: '2px dashed #ccc', padding: '40px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
          <span style={{ fontSize: '24px' }}>↑</span>
          <p style={{ color: '#666', marginTop: '10px' }}>Click to upload or drag and drop</p>
        </div>
      </div>
    </div>
  );
}

export default BusinessIds;