function Location({ data, setData, next, prev }) {
  return (
    <>
      <div className="form-group">
        <label>Address</label>
        <input
          value={data.address}
          onChange={(e) =>
            setData({ ...data, address: e.target.value })
          }
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>City</label>
          <input
            value={data.city}
            onChange={(e) =>
              setData({ ...data, city: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            value={data.state}
            onChange={(e) =>
              setData({ ...data, state: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Zip</label>
        <input
          value={data.zip}
          onChange={(e) =>
            setData({ ...data, zip: e.target.value })
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

export default Location;