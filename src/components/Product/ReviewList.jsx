function ReviewList() {
  const reviews = [
    { id: 1, name: "Rahul S.", rating: "★★★★★", text: "Absolutely fantastic. Very fresh product and arrived right on time. Will definitely buy again." },
    { id: 2, name: "Amit K.", rating: "★★★★☆", text: "Great quality, but the packaging could have been slightly better. Overall very satisfied." }
  ];

  return (
    <div className="review-list">

      <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#fff" }}>Review this product</h3>
      <button className="write-review">
        Write a customer review
      </button>

      <div className="reviews-container" style={{ marginTop: "20px" }}>
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <strong style={{ fontSize: "16px", color: "#00f2fe" }}>{review.name}</strong>
            <p style={{ color: "#facc15", margin: "4px 0", letterSpacing: "2px" }}>{review.rating}</p>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ReviewList;