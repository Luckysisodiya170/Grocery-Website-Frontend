import "./Help.css";

function Help() {
  return (
    <div className="help-hero">

      <div className="help-overlay" />

      <div className="container help-content">
        <h1>
          My <span className="text-gradient">Help</span>
        </h1>

        <div className="help-cards">

          <div className="help-box">
            <h3>FAQs</h3>
            <p>Find answers to commonly asked questions.</p>
          </div>

          <div className="help-box">
            <h3>Contact Support</h3>
            <p>Reach our team for assistance anytime.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Help;