function ManageAddress() {
  return (
    <>
      <h2>Manage Address</h2>

      <div className="grid-2">
        <div className="form-group">
          <label>First Name *</label>
          <input placeholder="Ex. John" />
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input placeholder="Ex. Doe" />
        </div>
      </div>

      <div className="form-group">
        <label>Street Address *</label>
        <input placeholder="Enter Street Address" />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>City *</label>
          <input placeholder="Select City" />
        </div>

        <div className="form-group">
          <label>State *</label>
          <input placeholder="Select State" />
        </div>
      </div>

      <button className="primary-btn">Add Address</button>
    </>
  );
}

export default ManageAddress;