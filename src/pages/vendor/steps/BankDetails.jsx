import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NumbersIcon from "@mui/icons-material/Numbers";
import CodeIcon from "@mui/icons-material/Code";

function BankDetails({ vendorData, handleChange }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Bank Name</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><AccountBalanceIcon fontSize="small" /></div>
          <input type="text" name="bankName" placeholder="e.g. HDFC Bank" value={vendorData.bankName} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Account Holder Name</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><AccountBoxIcon fontSize="small" /></div>
          <input type="text" name="accountHolderName" placeholder="Name as per passbook" value={vendorData.accountHolderName} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Account Number</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><NumbersIcon fontSize="small" /></div>
          <input type="text" name="accountNumber" placeholder="Enter account number" value={vendorData.accountNumber} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>IFSC Code</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><CodeIcon fontSize="small" /></div>
          <input type="text" name="ifscCode" placeholder="SBIN0001234" value={vendorData.ifscCode} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}

export default BankDetails;