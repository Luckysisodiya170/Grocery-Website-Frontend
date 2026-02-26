function BankDetails({ data, setData, prev, finish }) {
  return (
    <>
      <div className="grid-2">
        <div className="form-group">
          <label>Bank Name</label>
          <input
            value={data.bankName}
            onChange={(e) =>
              setData({ ...data, bankName: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>IFSC Code</label>
          <input
            value={data.ifsc}
            onChange={(e) =>
              setData({ ...data, ifsc: e.target.value })
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label>Account Number</label>
        <input
          value={data.accountNumber}
          onChange={(e) =>
            setData({ ...data, accountNumber: e.target.value })
          }
        />
      </div>

      <div className="step-actions">
        <button className="outline-btn" onClick={prev}>
          ← Previous
        </button>
        <button className="green-btn" onClick={finish}>
          Finish Registration ✓
        </button>
      </div>
    </>
  );
}

export default BankDetails;