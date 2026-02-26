function BusinessIds({ data, setData, next, prev }) {
  return (
    <>
      <div className="form-group">
        <label>Trade License Number</label>
        <input
          value={data.tradeLicense}
          onChange={(e) =>
            setData({ ...data, tradeLicense: e.target.value })
          }
        />
      </div>

      <div className="step-actions">
        <button className="outline-btn" onClick={prev}>
          ← Previous
        </button>
        <button className="primary-btn" onClick={next}>
          Next →
        </button>
      </div>
    </>
  );
}

export default BusinessIds;