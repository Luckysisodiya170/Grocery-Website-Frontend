function ReviewList() {
  return (
    <div className="review-list">

      <h3>Review this product</h3>
      <button className="write-review">
        Write a customer review
      </button>

      <div className="review-item">
        <strong>Rahul</strong>
        <p>⭐⭐⭐⭐⭐</p>
        <p>Very fresh product.</p>
      </div>

      <div className="review-item">
        <strong>Amit</strong>
        <p>⭐⭐⭐⭐</p>
        <p>Good quality.</p>
      </div>

    </div>
  );
}

export default ReviewList;
