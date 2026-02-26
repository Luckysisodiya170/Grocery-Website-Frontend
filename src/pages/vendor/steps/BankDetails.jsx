function BankDetails({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Bank Name</label>
        <input type="text" name="bankName" placeholder="e.g. HDFC Bank" value={vendorData.bankName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Account Holder Name</label>
        <input type="text" name="accountHolderName" placeholder="Name as per passbook" value={vendorData.accountHolderName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Account Number</label>
        <input type="text" name="accountNumber" placeholder="Enter account number" value={vendorData.accountNumber} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>IFSC Code</label>
        <input type="text" name="ifscCode" placeholder="SBIN0001234" value={vendorData.ifscCode} onChange={handleChange} />
      </div>
    </div>
  );
}

export default BankDetails;