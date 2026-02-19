function RatingBreakdown() {
  return (
    <div className="rating-breakdown">

      <div className="rating-summary">
        <h2>4.5</h2>
        ⭐⭐⭐⭐⭐
        <p>(245 reviews)</p>
      </div>

      <div className="rating-bars">
        {[5,4,3,2,1].map(star=>(
          <div key={star} className="rating-row">
            <span>{star}★</span>
            <div className="bar">
              <div className="fill"/>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RatingBreakdown;
