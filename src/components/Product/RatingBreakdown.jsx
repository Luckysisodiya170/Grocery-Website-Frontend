function RatingBreakdown() {
  return (
    <div className="rating-breakdown">
      
      <div className="rating-summary">
        <h2>4.5</h2>
        <div className="stars">★★★★★</div>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "4px", fontSize: "14px" }}>
          (245 verified reviews)
        </p>
      </div>

      <div className="rating-bars">
        {[
          { stars: 5, fill: "80%" },
          { stars: 4, fill: "15%" },
          { stars: 3, fill: "5%" },
          { stars: 2, fill: "0%" },
          { stars: 1, fill: "0%" }
        ].map((item) => (
          <div key={item.stars} className="rating-row">
            <span>{item.stars}★</span>
            <div className="bar">
              <div className="fill" style={{ width: item.fill }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RatingBreakdown;