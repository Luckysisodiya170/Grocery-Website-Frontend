import BadgeIcon from "@mui/icons-material/Badge";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useRef, useState } from "react";

function BusinessIds({ vendorData, handleChange }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      // Agar backend bhejte waqt set karna ho:
      // handleChange({ target: { name: "tradeLicenseFile", value: e.target.files[0] }});
    }
  };

  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Trade License Number</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><BadgeIcon fontSize="small" /></div>
          <input type="text" name="tradeLicense" placeholder="Enter trade license ID" value={vendorData.tradeLicense} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group full-width">
        <label>Upload Trade License (PDF/Image)</label>
        
        {/* Clickable Upload Box */}
        <div 
          className="upload-box" 
          onClick={() => fileRef.current.click()}
          style={{ border: '2px dashed var(--border)', padding: '25px', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: 'var(--bg-soft)', transition: '0.3s' }}
        >
          {/* Actual Hidden File Input for PDF and Images */}
          <input 
            type="file" 
            accept="image/*,.pdf" 
            ref={fileRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <UploadFileIcon style={{ fontSize: '35px', color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-main)', marginTop: '10px', fontWeight: '600', fontSize: '13px' }}>
            {fileName ? fileName : "Click to upload PDF or Image"}
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default BusinessIds;