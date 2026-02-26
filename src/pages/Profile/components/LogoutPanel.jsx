function LogoutPanel() {
  return (
    <>
      <Link to="/login">
      </Link>
      <p>Are you sure you want to log out?</p>
      <button className="primary-btn">Yes, Logout</button>
    </>
  );
}

export default LogoutPanel;