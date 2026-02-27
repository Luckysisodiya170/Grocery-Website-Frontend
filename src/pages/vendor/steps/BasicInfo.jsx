import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function BasicInfo({ vendorData, handleChange }) {
  
  // ✅ Available Categories List
  const availableCategories = ["Restaurant", "Grocery", "Pharmacy", "Electronics", "Fashion"];

  // ✅ Function to handle multiple selection
  const handleCategoryToggle = (category) => {
    let currentCategories = vendorData.businessCategory || [];
    
    // Agar category pehle se selected hai, toh usko hata do (deselect)
    if (currentCategories.includes(category)) {
      currentCategories = currentCategories.filter(c => c !== category);
    } 
    // Agar nahi hai, toh add kar do
    else {
      currentCategories = [...currentCategories, category];
    }

    // handleChange ko waisa hi data bhejenge jaisa normal input bhejta hai
    handleChange({
      target: { name: "businessCategory", value: currentCategories }
    });
  };

  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Business Name</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><StorefrontIcon fontSize="small" /></div>
          <input type="text" name="businessName" placeholder="e.g. Spice Garden Restaurant" value={vendorData.businessName} onChange={handleChange} />
        </div>
      </div>
      
      {/* ✅ NEW MULTI-SELECT CHIPS UI */}
      <div className="form-group full-width">
        <label>Business Category (Select multiple)</label>
        <div className="category-chips-container">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              // Check karenge ki selected array me ye category hai ya nahi
              className={`chip-btn ${vendorData.businessCategory?.includes(cat) ? 'active' : ''}`}
              onClick={() => handleCategoryToggle(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label>Owner Full Name</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><PersonIcon fontSize="small" /></div>
          <input type="text" name="ownerName" placeholder="Legal name of owner" value={vendorData.ownerName} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Email Address</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><EmailIcon fontSize="small" /></div>
          <input type="email" name="email" placeholder="contact@business.com" value={vendorData.email} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><LockIcon fontSize="small" /></div>
          <input type="password" name="password" placeholder="********" value={vendorData.password} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Contact Number</label>
        <div className="phone-wrapper">
          <PhoneInput 
            country="in" 
            value={vendorData.contactNumber} 
            onChange={(value) => handleChange({ target: { name: 'contactNumber', value } })} 
          />
        </div>
      </div>
      
      <div className="form-group full-width">
        <label>Emergency Contact</label>
        <div className="input-with-icon">
          <div className="input-icon-wrapper"><ContactEmergencyIcon fontSize="small" /></div>
          <input type="text" name="emergencyContact" placeholder="Emergency number" value={vendorData.emergencyContact} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;