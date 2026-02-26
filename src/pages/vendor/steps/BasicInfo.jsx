function BasicInfo({ data, setData, next }) {
  return (
    <>
      <div className="form-group">
        <label>Business Name</label>
        <input
          value={data.businessName}
          onChange={(e) =>
            setData({ ...data, businessName: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Business Category</label>
        <select
          value={data.category}
          onChange={(e) =>
            setData({ ...data, category: e.target.value })
          }
        >
          <option value="">Select</option>
          <option>Restaurant</option>
          <option>Grocery</option>
          <option>Pharmacy</option>
        </select>
      </div>

      <div className="form-group">
        <label>Owner Name</label>
        <input
          value={data.owner}
          onChange={(e) =>
            setData({ ...data, owner: e.target.value })
          }
        />
      </div>

      <button className="primary-btn" onClick={next}>
        Next Step →
      </button>
    </>
  );
}

export default BasicInfo;