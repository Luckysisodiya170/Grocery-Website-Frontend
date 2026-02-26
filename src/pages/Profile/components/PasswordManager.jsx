function PasswordManager() {
  return (
    <>
      <h2>Password Manager</h2>

      <div className="form-group">
        <label>Password *</label>
        <input type="password" placeholder="Enter Password" />
      </div>

      <div className="form-group">
        <label>New Password *</label>
        <input type="password" placeholder="Enter Password" />
      </div>

      <div className="form-group">
        <label>Confirm New Password *</label>
        <input type="password" placeholder="Enter Password" />
      </div>

      <button className="primary-btn">Update Password</button>
    </>
  );
}

export default PasswordManager;