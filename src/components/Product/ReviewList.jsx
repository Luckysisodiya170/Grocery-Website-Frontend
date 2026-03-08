function ReviewList() {

  const reviews = [
    {
      id: 1,
      name: "Rahul S.",
      rating: "★★★★★",
      text: "Absolutely fantastic. Very fresh product and arrived right on time. Will definitely buy again."
    },
    {
      id: 2,
      name: "Amit K.",
      rating: "★★★★☆",
      text: "Great quality, but the packaging could have been slightly better. Overall very satisfied."
    }
  ];

  return (
    <div className="review-list">

      <h3 className="review-title">
        Review this product
      </h3>

      <button className="write-review">
        Write a customer review
      </button>

      <div className="reviews-container">

        {reviews.map((review) => (

          <div className="review-item" key={review.id}>

            <strong className="review-name">
              {review.name}
            </strong>

            <p className="review-stars">
              {review.rating}
            </p>

            <p className="review-text">
              {review.text}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ReviewList;